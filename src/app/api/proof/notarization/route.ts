export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/proof/notarization
// Body: { documentId: string, signerIds?: string[], message?: string }
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { documentId: string; signerIds?: string[]; message?: string }
  const { documentId, signerIds, message } = body
  if (!documentId) return Response.json({ error: 'documentId required' }, { status: 400 })

  const admin = createAdminClient()

  // Fetch Proof credentials for this workspace
  const { data: integration } = await admin
    .from('zd_org_integrations')
    .select('config')
    .eq('user_id', user.id)
    .eq('provider', 'proof')
    .single()

  if (!integration?.config?.api_key || !integration?.config?.account_id) {
    return Response.json({ error: 'Proof not configured. Set up your API key in Settings → Integrations.' }, { status: 422 })
  }

  const { api_key, account_id } = integration.config as { api_key: string; account_id: string }

  // Fetch document
  const { data: doc } = await admin
    .from('zd_documents')
    .select('id, title, file_url, status, user_id')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) return Response.json({ error: 'Document not found' }, { status: 404 })

  // Fetch recipients
  const { data: allRecipients } = await admin
    .from('zd_recipients')
    .select('id, name, email')
    .eq('document_id', documentId)

  const recipients = signerIds?.length
    ? (allRecipients ?? []).filter(r => signerIds.includes(r.id))
    : (allRecipients ?? [])

  if (!recipients.length) {
    return Response.json({ error: 'No recipients selected for notarization' }, { status: 400 })
  }

  // Call Proof API -- create transaction
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const proofPayload = {
    account_id,
    name: doc.title,
    ...(message ? { note: message } : {}),
    webhook_url: `${appUrl}/api/proof/webhook`,
    signers: recipients.map(r => ({
      name: r.name,
      email: r.email,
    })),
    // documents array -- reference by URL or upload separately per Proof docs
    // For BYOK integrations Proof accepts a document URL
    ...(doc.file_url ? { document_url: doc.file_url } : {}),
  }

  let proofTransactionId: string | null = null
  const sessionUrls: Record<string, string> = {}

  try {
    const proofRes = await fetch('https://api.proof.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify(proofPayload),
    })

    if (!proofRes.ok) {
      const errText = await proofRes.text()
      console.error('[proof] create transaction failed:', proofRes.status, errText)
      return Response.json({ error: `Proof API error: ${proofRes.status}` }, { status: 502 })
    }

    const proofData = await proofRes.json() as {
      id?: string
      transaction_id?: string
      signers?: Array<{ email: string; session_url?: string }>
    }

    proofTransactionId = proofData.id ?? proofData.transaction_id ?? null

    for (const signer of proofData.signers ?? []) {
      if (signer.email && signer.session_url) {
        sessionUrls[signer.email] = signer.session_url
      }
    }
  } catch (err) {
    console.error('[proof] fetch error:', err)
    return Response.json({ error: 'Could not reach Proof API' }, { status: 502 })
  }

  // Update document record
  await admin
    .from('zd_documents')
    .update({
      proof_transaction_id: proofTransactionId,
      status: 'notarization_requested',
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId)

  // Audit log
  await admin.from('zd_audit_log').insert({
    document_id: documentId,
    event: 'notarization_requested',
    actor: user.email ?? user.id,
    metadata: { proof_transaction_id: proofTransactionId, recipient_count: recipients.length },
  })

  return Response.json({ success: true, proofTransactionId, sessionUrls })
}
