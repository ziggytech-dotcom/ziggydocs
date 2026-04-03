import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Archive } from 'lucide-react'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import ArchiveClient from './ArchiveClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; date_from?: string; date_to?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('zd_documents')
    .select('id, title, status, created_at, signed_at, sent_at, signer_name, zd_recipients(name, email, signed_at)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,signer_name.ilike.%${params.search}%`)
  }
  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }
  if (params.date_from) {
    query = query.gte('created_at', params.date_from)
  }
  if (params.date_to) {
    // Include entire day
    const toDate = new Date(params.date_to)
    toDate.setDate(toDate.getDate() + 1)
    query = query.lt('created_at', toDate.toISOString())
  }

  const { data: docs, count } = await query

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/dashboard" className="flex items-center">
            <ZiggyDocsLogo size="md" />
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center">
            <Archive size={18} className="text-[#7c3aed]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Document Archive</h1>
            <p className="text-[#888] text-sm mt-0.5">Search and filter all your documents</p>
          </div>
        </div>

        <Suspense fallback={<div className="text-[#555] text-sm">Loading…</div>}>
          <ArchiveClient docs={(docs ?? []) as any} total={count ?? 0} />
        </Suspense>
      </div>
    </div>
  )
}
