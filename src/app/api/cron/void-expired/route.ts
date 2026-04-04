export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { voidNotificationEmailHtml } from '@/lib/emails/documentEmail'
import { triggerZapierWebhook } from '@/lib/zapier'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()

  // Find sent/viewed documents past their expiry
  const { data: expiredDocs, error } = await supabase
    .from('zd_documents')
    .select('id, title, user_id, expires_at')
    .in('status', ['sent', 'viewed'])
    .lt('expires_at', now.toISOString())
    .not('expires_at', 'is', null)

  if (error) {
    console.error('void-expired cron error:', error)
    return Response.json({ error: 'Failed to fetch expired documents' }, { status: 500 })
  }

  let voided = 0
  let failed = 0

  for (const doc of expiredDocs ?? []) {
    try {
      // Void the document
      await supabase
        .from('zd_documents')
        .update({ status: 'voided', voided_at: now.toISOString() })
        .eq('id', doc.id)

      // Audit log
      await supabase.from('zd_audit_log').insert({
        document_id: doc.id,
        event: 'voided',
        metadata: { reason: 'expired', expires_at: doc.expires_at },
      })

      // Get sender email from auth.users via their user_id
      const { data: authUser } = await supabase.auth.admin.getUserById(doc.user_id)
      const ownerEmail = authUser?.user?.email
      const ownerName = authUser?.user?.user_metadata?.full_name ?? ownerEmail ?? 'there'

      if (ownerEmail) {
        const expiredAt = new Date(doc.expires_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })

        await resend.emails.send({
          from: 'ZiggyDocs <noreply@ziggydocs.com>',
          to: ownerEmail,
          subject: `Document voided: "${doc.title}"`,
          html: voidNotificationEmailHtml({
            ownerName: String(ownerName),
            documentTitle: doc.title,
            expiredAt,
          }),
        })
      }

      triggerZapierWebhook(doc.user_id, 'document.voided', {
        document: { id: doc.id, title: doc.title },
        reason: 'expired',
      })

      voided++
    } catch (err) {
      console.error(`Failed to void document ${doc.id}:`, err)
      failed++
    }
  }

  return Response.json({ success: true, voided, failed })
}
