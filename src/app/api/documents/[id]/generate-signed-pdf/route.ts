import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSignedPdf, SignerRecord } from '@/lib/pdf'
import { resend } from '@/lib/resend'
import { adminSignedNotificationHtml, signerConfirmationEmailHtml } from '@/lib/emails/documentEmail'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const key = req.headers.get('x-internal-key')
  if (key !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { signer_name, signer_ip, field_data, recipient_email } = body

  const supabase = createAdminClient()

  const { data: doc, error } = await supabase
    .from('zd_documents')
    .select('*, zd_recipients(name, email, signed_at, ip_address, declined_at)')
    .eq('id', id)
    .single()

  if (error || !doc) return Response.json({ error: 'Document not found' }, { status: 404 })

  // Fetch audit events
  const { data: events } = await supabase
    .from('zd_audit_log')
    .select('event, created_at, ip_address')
    .eq('document_id', id)
    .order('created_at', { ascending: true })

  // Collect all signers for the certificate
  const allSigners: SignerRecord[] = ((doc.zd_recipients as any[]) ?? [])
    .filter((r: any) => r.signed_at)
    .sort((a: any, b: any) => new Date(a.signed_at).getTime() - new Date(b.signed_at).getTime())

  let signedPdfUrl: string | null = null

  if (doc.file_url) {
    try {
      const { data: fileData, error: dlError } = await supabase.storage.from('zd-documents').download(doc.file_url)
      if (!dlError && fileData) {
        const pdfBytes = new Uint8Array(await fileData.arrayBuffer())
        const fields = (doc.fields_json as any[]) ?? []
        const signedAt = doc.signed_at
          ? new Date(doc.signed_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET'
          : new Date().toLocaleString()

        const signedBytes = await generateSignedPdf({
          pdfBytes,
          fields,
          fieldData: field_data ?? {},
          signerName: signer_name,
          signerIp: signer_ip ?? 'unknown',
          documentId: id,
          documentTitle: doc.title,
          signedAt,
          auditEvents: events ?? [],
          allSigners,
        })

        const signedPath = `${id}/signed.pdf`
        const { error: uploadError } = await supabase.storage
          .from('zd-documents')
          .upload(signedPath, signedBytes, { contentType: 'application/pdf', upsert: true })

        if (!uploadError) {
          await supabase.from('zd_documents').update({ signed_pdf_url: signedPath }).eq('id', id)
          signedPdfUrl = signedPath
        }
      }
    } catch (err) {
      console.error('PDF generation error:', err)
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const signedAt = doc.signed_at
    ? new Date(doc.signed_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleString()
  const downloadLink = signedPdfUrl ? `${appUrl}/api/documents/${id}/download` : undefined

  // Get owner email for notification
  const { data: owner } = await supabase.auth.admin.getUserById(doc.user_id)
  const ownerEmail = owner?.user?.email ?? 'ziggytech@icloud.com'

  await Promise.allSettled([
    resend.emails.send({
      from: 'ZiggyDocs <noreply@ziggydocs.com>',
      to: ownerEmail,
      subject: `[Signed] ${doc.title}`,
      html: adminSignedNotificationHtml({
        recipientName: signer_name,
        documentTitle: doc.title,
        signedAt,
        signerName: signer_name,
        downloadLink,
      }),
    }),
    recipient_email && resend.emails.send({
      from: 'ZiggyDocs <noreply@ziggydocs.com>',
      to: recipient_email,
      subject: `Signing complete: ${doc.title}`,
      html: signerConfirmationEmailHtml({
        signerName: signer_name,
        documentTitle: doc.title,
        signedAt,
        downloadLink,
      }),
    }),
  ])

  return Response.json({ success: true, signed_pdf_url: signedPdfUrl })
}
