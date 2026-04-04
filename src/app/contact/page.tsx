import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import { Zap } from 'lucide-react'

export default function ContactPage() {
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
            <Link href="/contact" className="text-white font-medium transition-colors">Contact</Link>
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
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-[#a78bfa] mb-8">
          <Zap size={13} />
          We typically reply within a few hours
        </div>
        <h1 className="text-5xl font-black tracking-tight leading-none mb-6">
          Get in touch
        </h1>
        <p className="text-xl text-[#888] leading-relaxed">
          Questions about pricing, features, or your account? We&apos;re here to help.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="max-w-4xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: '💬',
            label: 'General & Sales',
            email: 'hello@ziggydocs.com',
            desc: 'Pricing questions, demos, onboarding help',
          },
          {
            icon: '🛠️',
            label: 'Support',
            email: 'support@ziggydocs.com',
            desc: 'Technical issues, account help, signing problems',
          },
        ].map((c) => (
          <div key={c.label} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8">
            <div className="text-4xl mb-4">{c.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{c.label}</h3>
            <a href={`mailto:${c.email}`} className="text-[#a78bfa] hover:text-[#7c3aed] text-base font-semibold transition-colors">
              {c.email}
            </a>
            <p className="text-[#555] text-sm mt-2">{c.desc}</p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-8 text-center">Common questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How quickly do you respond?',
              a: 'We aim to reply within 4 hours during business hours (Mon–Fri, 9am–6pm PT).',
            },
            {
              q: 'Is there phone support?',
              a: 'Not currently &mdash; but our email support is fast and our team actually reads every message.',
            },
            {
              q: 'Can I get a live demo?',
              a: 'Yes! Email hello@ziggydocs.com and we\'ll set up a 20-minute walkthrough.',
            },
          ].map((item) => (
            <div key={item.q} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">{item.q}</h3>
              <p className="text-[#666] text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
