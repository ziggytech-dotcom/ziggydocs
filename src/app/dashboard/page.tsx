import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Send, CheckCircle, Clock, LayoutTemplate, Archive, Users, Settings, ShieldCheck } from 'lucide-react'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import { formatDate, statusColor } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: docs } = await admin
    .from('zd_documents')
    .select('id, title, status, created_at, signed_at, sent_at, notarization_required, notarized_at, proof_transaction_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allDocs = docs ?? []
  const stats = {
    total: allDocs.length,
    draft: allDocs.filter(d => d.status === 'draft').length,
    sent: allDocs.filter(d => ['sent', 'viewed'].includes(d.status)).length,
    signed: allDocs.filter(d => d.status === 'signed').length,
    voided: allDocs.filter(d => d.status === 'voided').length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <ZiggyDocsLogo size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/templates" className="hidden sm:flex text-sm text-[#888] hover:text-white transition-colors items-center gap-1.5">
              <LayoutTemplate size={14} />
              Templates
            </Link>
            <Link href="/bulk-send" className="hidden sm:flex text-sm text-[#888] hover:text-white transition-colors items-center gap-1.5">
              <Users size={14} />
              Bulk Send
            </Link>
            <Link href="/archive" className="hidden sm:flex text-sm text-[#888] hover:text-white transition-colors items-center gap-1.5">
              <Archive size={14} />
              Archive
            </Link>
            <Link href="/settings" className="hidden sm:flex text-sm text-[#888] hover:text-white transition-colors items-center gap-1.5">
              <Settings size={14} />
              Settings
            </Link>
            <form action="/api/auth/signout" method="post">
              <button className="text-sm text-[#888] hover:text-white transition-colors">Sign out</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-20 md:pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Documents</h1>
            <p className="text-[#888] text-sm mt-0.5">{user.email}</p>
          </div>
          <Link
            href="/documents/new"
            className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <Plus size={16} />
            New Document
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, icon: FileText, color: 'text-[#888]' },
            { label: 'Drafts', value: stats.draft, icon: Clock, color: 'text-[#888]' },
            { label: 'Pending', value: stats.sent, icon: Send, color: 'text-blue-400' },
            { label: 'Signed', value: stats.signed, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Voided', value: stats.voided, icon: Archive, color: 'text-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111] border border-[#222] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#888] uppercase tracking-widest">{stat.label}</span>
                <stat.icon size={14} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Documents list */}
        {allDocs.length === 0 ? (
          <div className="bg-[#111] border border-[#222] border-dashed rounded-2xl p-16 text-center">
            <FileText size={32} className="text-[#444] mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No documents yet</h3>
            <p className="text-[#888] text-sm mb-6">Create your first document to get started</p>
            <Link
              href="/documents/new"
              className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              <Plus size={16} />
              New Document
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile cards (< md) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
              {allDocs.map(doc => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#7c3aed]/40 hover:bg-[#0f0f0f] transition-all block"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-[#7c3aed]" />
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <p className="text-white text-sm font-medium line-clamp-2">{doc.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[#555] text-xs">{formatDate(doc.created_at)}</p>
                    {doc.notarized_at && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full font-medium">
                        <ShieldCheck size={9} /> Notarized
                      </span>
                    )}
                    {doc.proof_transaction_id && !doc.notarized_at && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-1.5 py-0.5 rounded-full font-medium">
                        <ShieldCheck size={9} /> RON Pending
                      </span>
                    )}
                    {doc.notarization_required && !doc.proof_transaction_id && !doc.notarized_at && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full font-medium">
                        <ShieldCheck size={9} /> RON Required
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop table (≥ md) */}
            <div className="hidden md:block bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-6 py-3 border-b border-[#1a1a1a] text-xs text-[#555] uppercase tracking-widest">
                <span>Document</span>
                <span>Status</span>
                <span>Created</span>
                <span></span>
              </div>
              {allDocs.map(doc => (
                <div
                  key={doc.id}
                  className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-6 py-4 border-b border-[#1a1a1a] last:border-0 hover:bg-[#0f0f0f] transition-colors items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-[#7c3aed]" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{doc.title}</p>
                      {doc.notarized_at && (
                        <span className="inline-flex items-center gap-0.5 shrink-0 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full font-medium">
                          <ShieldCheck size={9} /> Notarized
                        </span>
                      )}
                      {doc.proof_transaction_id && !doc.notarized_at && (
                        <span className="inline-flex items-center gap-0.5 shrink-0 text-[10px] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-1.5 py-0.5 rounded-full font-medium">
                          <ShieldCheck size={9} /> RON Pending
                        </span>
                      )}
                      {doc.notarization_required && !doc.proof_transaction_id && !doc.notarized_at && (
                        <span className="inline-flex items-center gap-0.5 shrink-0 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full font-medium">
                          <ShieldCheck size={9} /> RON Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="text-[#888] text-xs">{formatDate(doc.created_at)}</div>
                  <div>
                    <Link
                      href={`/documents/${doc.id}`}
                      className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
