import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, PenLine, FileText, ShieldCheck } from 'lucide-react'
import { formatDate, statusColor } from '@/lib/utils'
import DocumentActions from './DocumentActions'
import CopyLinkButton from './CopyLinkButton'
import NotarizationSection from './NotarizationSection'

export const dynamic = 'force-dynamic'

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: doc } = await admin
    .from('zd_documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) notFound()

  const { data: recipients } = await admin
    .from('zd_recipients')
    .select('*')
    .eq('document_id', id)
    .order('signing_order', { ascending: true })

  const { data: auditLog } = await admin
    .from('zd_audit_log')
    .select('*')
    .eq('document_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: proofIntegration } = await admin
    .from('zd_org_integrations')
    .select('config')
    .eq('user_id', user.id)
    .eq('provider', 'proof')
    .single()

  const proofConfigured = !!(proofIntegration?.config?.api_key && proofIntegration?.config?.account_id)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-6 h-6 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <PenLine size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm truncate max-w-xs">{doc.title}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document card */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-xl font-bold text-white mb-2">{doc.title}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center">
                  <FileText size={18} className="text-[#7c3aed]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1">Created</p>
                  <p className="text-white">{formatDate(doc.created_at)}</p>
                </div>
                {doc.sent_at && (
                  <div>
                    <p className="text-[#555] text-xs uppercase tracking-widest mb-1">Sent</p>
                    <p className="text-white">{formatDate(doc.sent_at)}</p>
                  </div>
                )}
                {doc.signed_at && (
                  <div>
                    <p className="text-[#555] text-xs uppercase tracking-widest mb-1">Signed</p>
                    <p className="text-green-400">{formatDate(doc.signed_at)}</p>
                  </div>
                )}
                {doc.expires_at && (
                  <div>
                    <p className="text-[#555] text-xs uppercase tracking-widest mb-1">Expires</p>
                    <p className="text-[#888]">{formatDate(doc.expires_at)}</p>
                  </div>
                )}
              </div>

              {doc.signer_name && (
                <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                  <p className="text-[#555] text-xs uppercase tracking-widest mb-1">Signed by</p>
                  <p className="text-white font-medium">{doc.signer_name}</p>
                  {doc.signer_ip && <p className="text-[#888] text-xs mt-0.5">IP: {doc.signer_ip}</p>}
                </div>
              )}
            </div>

            {/* Recipients */}
            {recipients && recipients.length > 0 && (
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Recipients</h2>
                  {doc.sequential_signing && (
                    <span className="text-xs text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-2 py-0.5 rounded-full">Sequential</span>
                  )}
                </div>
                <div className="space-y-3">
                  {recipients.map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                      <div className="flex items-center gap-3">
                        {doc.sequential_signing && (
                          <span className="w-6 h-6 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] text-xs font-bold flex items-center justify-center shrink-0">
                            {(r as any).signing_order ?? 1}
                          </span>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">{r.name}</p>
                          <p className="text-[#888] text-xs">{r.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {r.signed_at ? (
                          <span className="text-green-400 text-xs font-medium">Signed {formatDate(r.signed_at)}</span>
                        ) : (r as any).declined_at ? (
                          <span className="text-orange-400 text-xs font-medium">Declined</span>
                        ) : (
                          <div className="space-y-1 text-right">
                            <span className="text-[#888] text-xs">Pending</span>
                            {doc.status !== 'draft' && (
                              <CopyLinkButton link={`${appUrl}/sign/${r.token}`} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit trail */}
            {auditLog && auditLog.length > 0 && (
              <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Audit Trail</h2>
                <div className="space-y-3">
                  {auditLog.map(log => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-white capitalize">{log.event.replace(/_/g, ' ')}</p>
                        {log.actor && <p className="text-[#888] text-xs">{log.actor}</p>}
                        <p className="text-[#555] text-xs">{formatDate(log.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar actions */}
          <div className="space-y-4">
            <DocumentActions doc={doc} recipients={recipients ?? []} appUrl={appUrl} />

            {/* Place fields */}
            {doc.status === 'draft' && (
              <Link
                href={`/documents/${id}/fields`}
                className="flex items-center justify-center gap-2 w-full border border-[#333] hover:border-[#7c3aed]/50 text-[#888] hover:text-white py-3 rounded-xl text-sm transition-colors"
              >
                <PenLine size={14} />
                Place Signature Fields
              </Link>
            )}

            {/* Download */}
            {(doc.signed_pdf_url || (doc.file_url && doc.status === 'signed')) && (
              <a
                href={`/api/documents/${id}/download`}
                className="flex items-center justify-center gap-2 w-full border border-[#333] hover:border-green-500/50 text-[#888] hover:text-green-400 py-3 rounded-xl text-sm transition-colors"
              >
                <Download size={14} />
                Download Signed PDF
              </a>
            )}

            {/* Audit certificate */}
            <a
              href={`/api/documents/${id}/audit-certificate`}
              className="flex items-center justify-center gap-2 w-full border border-[#333] hover:border-[#7c3aed]/50 text-[#888] hover:text-[#a78bfa] py-3 rounded-xl text-sm transition-colors"
            >
              <ShieldCheck size={14} />
              Audit Certificate
            </a>

            {/* Notarization */}
            <NotarizationSection
              doc={{
                id: doc.id,
                status: doc.status,
                notarization_required: doc.notarization_required ?? false,
                proof_transaction_id: doc.proof_transaction_id ?? null,
                notarized_at: doc.notarized_at ?? null,
                notarization_certificate_url: doc.notarization_certificate_url ?? null,
                notarized_by: doc.notarized_by ?? null,
              }}
              recipients={(recipients ?? []).map(r => ({ id: r.id, name: r.name, email: r.email }))}
              proofConfigured={proofConfigured}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
