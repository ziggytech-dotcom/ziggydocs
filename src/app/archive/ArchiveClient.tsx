'use client'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { formatDate, statusColor } from '@/lib/utils'
import Link from 'next/link'

const STATUS_OPTIONS = ['all', 'draft', 'sent', 'viewed', 'signed', 'declined', 'voided', 'cancelled']

interface Doc {
  id: string
  title: string
  status: string
  created_at: string
  signed_at: string | null
  sent_at: string | null
  signer_name: string | null
  zd_recipients: Array<{ name: string; email: string; signed_at: string | null }>
}

export default function ArchiveClient({ docs, total }: { docs: Doc[]; total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [status, setStatus] = useState(searchParams.get('status') ?? 'all')
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') ?? '')
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') ?? '')

  const applyFilters = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams()
    const s = overrides.search ?? search
    const st = overrides.status ?? status
    const df = overrides.date_from ?? dateFrom
    const dt = overrides.date_to ?? dateTo
    if (s) params.set('search', s)
    if (st && st !== 'all') params.set('status', st)
    if (df) params.set('date_from', df)
    if (dt) params.set('date_to', dt)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setDateFrom('')
    setDateTo('')
    startTransition(() => router.push(pathname))
  }

  const hasFilters = search || (status && status !== 'all') || dateFrom || dateTo

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-[#111] border border-[#222] rounded-2xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            placeholder="Search by title or signer name…"
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Status filter */}
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-[#555] uppercase tracking-widest mb-1">Status</label>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }) }}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#7c3aed] text-sm"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-[#555] uppercase tracking-widest mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); applyFilters({ date_from: e.target.value }) }}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#7c3aed] text-sm [color-scheme:dark]"
            />
          </div>

          {/* Date to */}
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-[#555] uppercase tracking-widest mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); applyFilters({ date_to: e.target.value }) }}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#7c3aed] text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => applyFilters()}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Apply
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-[#555] hover:text-white transition-colors">
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#555]">
        {total === 0 ? 'No documents found' : `${total} document${total !== 1 ? 's' : ''} found`}
      </p>

      {/* Documents table */}
      {docs.length > 0 && (
        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_110px_130px_130px_80px] gap-4 px-6 py-3 border-b border-[#1a1a1a] text-xs text-[#555] uppercase tracking-widest">
            <span>Document</span>
            <span>Status</span>
            <span>Created</span>
            <span>Signed</span>
            <span></span>
          </div>
          {docs.map(doc => {
            const signers = doc.zd_recipients.filter(r => r.signed_at)
            return (
              <div
                key={doc.id}
                className="grid md:grid-cols-[1fr_110px_130px_130px_80px] gap-4 px-6 py-4 border-b border-[#1a1a1a] last:border-0 hover:bg-[#0f0f0f] transition-colors items-center"
              >
                <div>
                  <p className="text-white text-sm font-medium truncate">{doc.title}</p>
                  {signers.length > 0 && (
                    <p className="text-[#555] text-xs mt-0.5 truncate">
                      {signers.map(s => s.name).join(', ')}
                    </p>
                  )}
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                <div className="text-[#888] text-xs">{formatDate(doc.created_at)}</div>
                <div className="text-[#888] text-xs">{doc.signed_at ? formatDate(doc.signed_at) : '&mdash;'}</div>
                <div>
                  <Link href={`/documents/${doc.id}`} className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-medium">
                    View →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
