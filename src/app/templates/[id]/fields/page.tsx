import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import FieldPlacementClient from '@/components/docsign/FieldPlacementClient'

export const dynamic = 'force-dynamic'

export default async function TemplateFieldsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: tmpl } = await admin
    .from('zd_templates')
    .select('id, title, file_url, fields_json')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!tmpl) notFound()

  let pdfSignedUrl: string | null = null
  if (tmpl.file_url) {
    const { data } = await admin.storage.from('zd-documents').createSignedUrl(tmpl.file_url, 3600)
    pdfSignedUrl = data?.signedUrl ?? null
  }

  // Adapt template to the doc shape FieldPlacementClient expects
  // Saves go to /api/documents/templates/[id] PUT
  const docShape = {
    id: tmpl.id,
    title: tmpl.title,
    file_url: tmpl.file_url ?? null,
    fields_json: tmpl.fields_json,
    status: 'template',
    clients: null,
  }

  return (
    <FieldPlacementClient
      doc={docShape}
      pdfSignedUrl={pdfSignedUrl}
      backHref="/templates"
      saveEndpoint={`/api/documents/templates/${id}`}
    />
  )
}
