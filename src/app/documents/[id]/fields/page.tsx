import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import FieldPlacementClient from '@/components/docsign/FieldPlacementClient'

export const dynamic = 'force-dynamic'

export default async function FieldPlacementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: doc } = await admin
    .from('zd_documents')
    .select('id, title, file_url, fields_json, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) notFound()

  const { data: recipients } = await admin
    .from('zd_recipients')
    .select('id, name, email, signing_order')
    .eq('document_id', id)
    .order('signing_order', { ascending: true })

  let pdfSignedUrl: string | null = null
  if (doc.file_url) {
    const { data } = await admin.storage.from('zd-documents').createSignedUrl(doc.file_url, 3600)
    pdfSignedUrl = data?.signedUrl ?? null
  }

  return (
    <FieldPlacementClient
      doc={{ ...doc, clients: null }}
      pdfSignedUrl={pdfSignedUrl}
      backHref={`/documents/${id}`}
      recipients={recipients ?? []}
    />
  )
}
