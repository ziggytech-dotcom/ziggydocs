export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

// POST /api/proof/webhook
// Proof sends: { event, transaction_id, notary_name, certificate_url, ... }
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Verify Proof webhook signature if secret is set
  const webhookSecret = process.env.PROOF_WEBHOOK_SECRET
  if (webhookSecret) {
    const sig = req.headers.get('x-proof-signature') ?? ''
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventId = (payload.event_id ?? payload.id) as string | undefined
  const transactionId = (payload.transaction_id ?? payload.id) as string | undefined
  const event = payload.event as string | undefined

  const admin = createAdminClient()

  // Idempotency — skip if already processed
  if (eventId) {
    const { data: existing } = await admin
      .from('zd_webhook_events')
      .select('id, processed_at')
      .eq('provider', 'proof')
      .eq('event_id', eventId)
      .single()

    if (existing?.processed_at) {
      return Response.json({ ok: true, skipped: true })
    }
  }

  // Store raw event
  const { data: webhookRow } = await admin
    .from('zd_webhook_events')
    .upsert(
      { provider: 'proof', event_id: eventId ?? null, payload },
      { onConflict: eventId ? 'provider,event_id' : undefined }
    )
    .select('id')
    .single()

  // Only act on completion events
  const isCompleted = event === 'transaction.completed' || event === 'notarization.completed'
  const isCancelled = event === 'transaction.cancelled' || event === 'transaction.failed'

  if (transactionId && (isCompleted || isCancelled)) {
    const { data: doc } = await admin
      .from('zd_documents')
      .select('id, user_id')
      .eq('proof_transaction_id', transactionId)
      .single()

    if (doc) {
      if (isCompleted) {
        const certificateUrl = payload.certificate_url as string | undefined
        const notaryName = (payload.notary_name ?? (payload.notary as { name?: string } | undefined)?.name) as string | undefined

        await admin
          .from('zd_documents')
          .update({
            status: 'notarized',
            notarized_at: new Date().toISOString(),
            notarization_certificate_url: certificateUrl ?? null,
            notarized_by: notaryName ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', doc.id)

        await admin.from('zd_audit_log').insert({
          document_id: doc.id,
          event: 'document_notarized',
          actor: notaryName ? `Notary: ${notaryName}` : 'Proof.com',
          metadata: { proof_transaction_id: transactionId, certificate_url: certificateUrl },
        })
      } else {
        // cancelled/failed — revert to signed so user can re-request
        await admin
          .from('zd_documents')
          .update({
            status: 'signed',
            proof_transaction_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', doc.id)

        await admin.from('zd_audit_log').insert({
          document_id: doc.id,
          event: 'notarization_cancelled',
          actor: 'Proof.com',
          metadata: { proof_transaction_id: transactionId, event },
        })
      }
    }
  }

  // Mark webhook as processed
  if (webhookRow?.id) {
    await admin
      .from('zd_webhook_events')
      .update({ processed_at: new Date().toISOString() })
      .eq('id', webhookRow.id)
  }

  return Response.json({ ok: true })
}
