import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Tablet } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'

export const dynamic = 'force-dynamic'

export default async function InPersonSigningPage({ params }: { params: Promise<{ id: string }> }) {
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
    .is('signed_at', null)
    .is('declined_at', null)
    .order('signing_order', { ascending: true })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const unsigned = recipients ?? []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href={`/documents/${id}`} className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Back</span>
          </Link>
          <ZiggyDocsLogo size="sm" />
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#7c3aed]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tablet size={28} className="text-[#7c3aed]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">In-Person Signing</h1>
          <p className="text-[#888] text-sm">
            Select the recipient who is present to sign. Then hand the device to them.
          </p>
          <p className="text-[#555] text-xs mt-1 font-medium truncate">{doc.title}</p>
        </div>

        {unsigned.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-center">
            <p className="text-green-400 font-medium mb-1">All recipients have signed</p>
            <p className="text-[#888] text-sm">There are no unsigned recipients remaining.</p>
            <Link
              href={`/documents/${id}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
            >
              Back to document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {unsigned.map(r => (
              <a
                key={r.id}
                href={`${appUrl}/sign/${r.token}?inperson=1`}
                className="group flex items-center justify-between bg-[#111] border border-[#222] hover:border-[#7c3aed]/50 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#7c3aed] font-bold text-sm">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{r.name}</p>
                    <p className="text-[#555] text-xs">{r.email}</p>
                    {(r as any).signing_order && (
                      <p className="text-[#7c3aed] text-xs mt-0.5">Signer #{(r as any).signing_order}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#555] group-hover:text-[#7c3aed] transition-colors">
                  <span className="text-sm font-medium">Sign Now</span>
                  <span className="text-lg">→</span>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 bg-[#111] border border-[#222] rounded-xl p-4">
          <p className="text-xs text-[#555] leading-relaxed">
            <span className="text-[#888] font-medium">How it works:</span> Tap a recipient above to open the full signing view.
            Hand the device to that person so they can review and sign the document.
            Their signature will be recorded with the current timestamp and IP address.
            {doc.expires_at && (
              <span> This document expires on <span className="text-[#888]">{formatDate(doc.expires_at)}</span>.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
