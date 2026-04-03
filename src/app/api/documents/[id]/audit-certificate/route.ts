import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: doc } = await admin
    .from('zd_documents')
    .select('id, title, created_at, sent_at, signed_at, status, signer_ip')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })

  const { data: recipients } = await admin
    .from('zd_recipients')
    .select('name, email, signed_at, ip_address, signing_order')
    .eq('document_id', id)
    .order('signing_order', { ascending: true })

  const { data: auditLog } = await admin
    .from('zd_audit_log')
    .select('event, actor, ip_address, created_at, metadata')
    .eq('document_id', id)
    .order('created_at', { ascending: true })

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC' : '—'

  const recipientRows = (recipients ?? []).map(r => `
    <tr>
      <td>${r.signing_order ?? 1}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(r.email)}</td>
      <td>${r.signed_at ? `<span class="badge signed">Signed</span>` : `<span class="badge pending">Pending</span>`}</td>
      <td>${fmt(r.signed_at)}</td>
      <td>${r.ip_address ?? '—'}</td>
    </tr>`).join('')

  const auditRows = (auditLog ?? []).map(e => `
    <tr>
      <td>${fmt(e.created_at)}</td>
      <td><span class="event">${esc(e.event.replace(/_/g, ' '))}</span></td>
      <td>${esc(e.actor ?? '—')}</td>
      <td>${e.ip_address ?? '—'}</td>
    </tr>`).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Audit Certificate — ${esc(doc.title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; padding: 40px; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 2px solid #7c3aed; padding-bottom: 20px; margin-bottom: 28px; }
  .logo { font-size: 20px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px; }
  .logo span { color: #111; }
  .cert-title { font-size: 13px; color: #666; margin-top: 4px; }
  .doc-title { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 6px; }
  .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: #f9f7ff; border: 1px solid #e8e0ff; border-radius: 8px; padding: 16px; margin-bottom: 28px; }
  .meta-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; display: block; margin-bottom: 3px; }
  .meta-item span { font-size: 13px; font-weight: 600; color: #111; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin: 24px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  th { text-align: left; padding: 8px 10px; background: #f4f0ff; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #ddd; }
  td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; color: #333; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
  .badge.signed { background: #dcfce7; color: #166534; }
  .badge.pending { background: #fef3c7; color: #92400e; }
  .event { display: inline-block; padding: 2px 8px; border-radius: 4px; background: #f4f0ff; color: #7c3aed; font-size: 11px; font-weight: 500; text-transform: capitalize; }
  .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; display: flex; justify-content: space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">Ziggy<span>Docs</span></div>
    <div class="cert-title">Electronic Signature Audit Certificate</div>
  </div>
  <div style="text-align:right;font-size:12px;color:#888;">
    Document ID: ${esc(doc.id)}<br/>
    Generated: ${fmt(new Date().toISOString())}
  </div>
</div>

<div class="doc-title">${esc(doc.title)}</div>

<div class="meta">
  <div class="meta-item"><label>Status</label><span style="text-transform:capitalize;">${esc(doc.status)}</span></div>
  <div class="meta-item"><label>Created</label><span>${fmt(doc.created_at)}</span></div>
  <div class="meta-item"><label>Sent</label><span>${fmt(doc.sent_at)}</span></div>
  ${doc.signed_at ? `<div class="meta-item"><label>Completed</label><span>${fmt(doc.signed_at)}</span></div>` : ''}
</div>

<h2>Recipients</h2>
<table>
  <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Signed At</th><th>IP Address</th></tr></thead>
  <tbody>${recipientRows || '<tr><td colspan="6" style="color:#aaa">No recipients</td></tr>'}</tbody>
</table>

<h2>Audit Trail</h2>
<table>
  <thead><tr><th>Timestamp</th><th>Event</th><th>Actor</th><th>IP Address</th></tr></thead>
  <tbody>${auditRows || '<tr><td colspan="4" style="color:#aaa">No events recorded</td></tr>'}</tbody>
</table>

<div class="footer">
  <span>ZiggyDocs — ziggydocs.com</span>
  <span>This certificate is generated for audit and compliance purposes. Electronic signatures are legally binding under the ESIGN Act.</span>
</div>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="audit-certificate-${id.slice(0, 8)}.html"`,
    },
  })
}

function esc(s: string | null | undefined) {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
