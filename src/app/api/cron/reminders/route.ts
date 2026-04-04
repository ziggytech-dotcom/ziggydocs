export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/resend'
import { reminderEmailHtml } from '@/lib/emails/documentEmail'

// Intervals at which to send reminders (in hours)
const REMINDER_INTERVALS = [24, 48, 72]

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron or internally
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()
  let sent = 0
  let skipped = 0

  // Fetch all unsigned, non-declined recipients on sent/viewed documents
  const { data: recipients, error } = await supabase
    .from('zd_recipients')
    .select('*, zd_documents(id, title, status, sent_at, expires_at, user_id)')
    .is('signed_at', null)
    .is('declined_at', null)
    .in('zd_documents.status', ['sent', 'viewed'])
    .not('zd_documents', 'is', null)

  if (error) {
    console.error('Reminder cron error fetching recipients:', error)
    return Response.json({ error: 'Failed to fetch recipients' }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  for (const recipient of recipients ?? []) {
    const doc = recipient.zd_documents as any
    if (!doc?.sent_at) { skipped++; continue }

    // Skip if document is expired
    if (doc.expires_at && new Date(doc.expires_at) < now) { skipped++; continue }

    // Max 3 reminders
    const reminderCount: number = recipient.reminder_count ?? 0
    if (reminderCount >= 3) { skipped++; continue }

    // Determine the next interval to fire
    const nextIntervalHours = REMINDER_INTERVALS[reminderCount]
    if (!nextIntervalHours) { skipped++; continue }

    // Check whether enough time has passed since sent_at (or last_reminded_at)
    const baseTime = recipient.last_reminded_at
      ? new Date(recipient.last_reminded_at)
      : new Date(doc.sent_at)
    const hoursElapsed = (now.getTime() - baseTime.getTime()) / (1000 * 60 * 60)

    if (hoursElapsed < nextIntervalHours) { skipped++; continue }

    const expiresAt = doc.expires_at
      ? new Date(doc.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '30 days from now'

    try {
      await resend.emails.send({
        from: 'ZiggyDocs <noreply@ziggydocs.com>',
        to: recipient.email,
        subject: `Reminder: Please sign "${doc.title}"`,
        html: reminderEmailHtml({
          recipientName: recipient.name,
          documentTitle: doc.title,
          signingLink: `${appUrl}/sign/${recipient.token}`,
          reminderNumber: reminderCount + 1,
          expiresAt,
        }),
      })

      // Update reminder tracking
      await supabase
        .from('zd_recipients')
        .update({
          last_reminded_at: now.toISOString(),
          reminder_count: reminderCount + 1,
        })
        .eq('id', recipient.id)

      // Audit log
      await supabase.from('zd_audit_log').insert({
        document_id: doc.id,
        event: 'reminder_sent',
        actor: recipient.email,
        metadata: { reminder_number: reminderCount + 1 },
      })

      sent++
    } catch (err) {
      console.error(`Failed to send reminder to ${recipient.email}:`, err)
      skipped++
    }
  }

  return Response.json({ success: true, sent, skipped })
}
