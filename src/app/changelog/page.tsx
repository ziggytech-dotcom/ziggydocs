import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import { Zap } from 'lucide-react'

const releases = [
  {
    version: '1.4.0',
    date: 'April 2026',
    tag: 'Major',
    tagColor: '#7c3aed',
    changes: [
      'Bulk send -- send one document to hundreds of signers at once',
      'Sequential signing order -- control who signs first',
      'Document archive -- access expired and completed documents',
      'Auto-reminder scheduling improvements',
    ],
  },
  {
    version: '1.3.2',
    date: 'March 2026',
    tag: 'Improvement',
    tagColor: '#0ea5e9',
    changes: [
      'Faster PDF rendering on large files',
      'Improved mobile signing experience',
      'Fixed signature field alignment on rotated PDFs',
      'Added date-only field type',
    ],
  },
  {
    version: '1.3.0',
    date: 'February 2026',
    tag: 'Major',
    tagColor: '#7c3aed',
    changes: [
      'Template library -- save and reuse documents',
      'Multi-recipient sending with parallel signing',
      'Certificate of completion PDF download',
      'Full audit trail with IP and timestamp logging',
    ],
  },
  {
    version: '1.2.1',
    date: 'January 2026',
    tag: 'Fix',
    tagColor: '#f97316',
    changes: [
      'Fixed email delivery issues with certain mail providers',
      'Corrected signature date format for international locales',
      'Improved error messages for expired document links',
    ],
  },
  {
    version: '1.2.0',
    date: 'December 2025',
    tag: 'Major',
    tagColor: '#7c3aed',
    changes: [
      'Drag-and-drop field editor -- place fields visually on any PDF page',
      'Initials and checkbox field types',
      'Signer name pre-fill from send form',
      'Document dashboard with status filters',
    ],
  },
  {
    version: '1.0.0',
    date: 'November 2025',
    tag: 'Launch',
    tagColor: '#22c55e',
    changes: [
      'Initial launch of ZiggyDocs',
      'PDF upload and e-signature collection',
      'Email-based signer delivery',
      'ESIGN & UETA compliant signatures',
      'Basic audit trail and PDF download',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ZiggyDocsLogo size="md" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#888] hover:text-white transition-colors px-3 py-1.5">
              Log in
            </Link>
            <Link href="/signup" className="text-sm bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-[#a78bfa] mb-8">
          <Zap size={13} />
          What&apos;s new in ZiggyDocs
        </div>
        <h1 className="text-5xl font-black tracking-tight leading-none mb-4">Changelog</h1>
        <p className="text-xl text-[#888] leading-relaxed">
          Every update, improvement, and fix &mdash; in plain English.
        </p>
      </section>

      {/* Releases */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="space-y-8">
          {releases.map((release) => (
            <div key={release.version} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-lg font-bold text-white">v{release.version}</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${release.tagColor}20`, color: release.tagColor }}
                >
                  {release.tag}
                </span>
                <span className="text-[#555] text-sm ml-auto">{release.date}</span>
              </div>
              <ul className="space-y-2.5">
                {release.changes.map((change) => (
                  <li key={change} className="flex items-start gap-2.5 text-[#888] text-sm">
                    <span className="text-[#7c3aed] mt-0.5 flex-shrink-0">→</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
