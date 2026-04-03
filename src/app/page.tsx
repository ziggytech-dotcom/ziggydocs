import Link from 'next/link'
import { FileText, Send, PenLine, Download, CheckCircle, Zap, Shield, Users } from 'lucide-react'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ZiggyDocsLogo size="md" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-[#a78bfa] mb-8">
          <Zap size={13} />
          No credit card required · Free plan available
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-6">
          Sign documents<br />
          <span className="text-[#7c3aed]">online. Free.</span>
        </h1>
        <p className="text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a PDF, place signature fields, send to anyone — they sign in seconds, no account needed.
          Legally binding. Audit trail included.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Start for free →
          </Link>
          <a href="#how-it-works" className="border border-[#333] hover:border-[#555] text-[#888] hover:text-white px-8 py-4 rounded-xl font-medium text-lg transition-colors">
            See how it works
          </a>
        </div>
        <p className="text-[#555] text-sm mt-6">3 documents/month free · No signup required for signers</p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-[#888] text-lg">Four simple steps to get any document signed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: FileText, step: '01', title: 'Upload PDF', desc: 'Drag and drop your PDF document into ZiggyDocs' },
            { icon: Users, step: '02', title: 'Add recipients', desc: 'Enter names and emails of everyone who needs to sign' },
            { icon: PenLine, step: '03', title: 'Place fields', desc: 'Drag signature, date, and text fields onto the pages' },
            { icon: Send, step: '04', title: 'Send & sign', desc: 'Recipients get a link and sign in their browser instantly' },
          ].map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="relative bg-[#111] border border-[#222] rounded-2xl p-6">
              <div className="text-[#333] text-5xl font-black absolute top-4 right-5 leading-none select-none">{step}</div>
              <div className="w-10 h-10 bg-[#7c3aed]/15 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#7c3aed]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-[#888] text-lg">Professional document signing without the enterprise price tag</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Legally binding', desc: 'Electronic signatures comply with eSign Act and UETA. Full audit trail on every document.' },
            { icon: PenLine, title: 'Draw or type', desc: 'Signers can draw their signature with a mouse or finger, or type it in cursive.' },
            { icon: Download, title: 'Signed PDF download', desc: 'Get a completed PDF with signatures embedded and a completion certificate appended.' },
            { icon: FileText, title: 'Reusable templates', desc: 'Save frequently used documents as templates to send again in seconds.' },
            { icon: CheckCircle, title: 'Audit trail', desc: 'Every view, completion, and signature is timestamped and logged with IP address.' },
            { icon: Zap, title: 'No account for signers', desc: 'Recipients open a link from their email and sign — zero friction, no signup.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#7c3aed]/40 transition-colors">
              <div className="w-10 h-10 bg-[#7c3aed]/15 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#7c3aed]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple pricing</h2>
          <p className="text-[#888] text-lg">Start free, upgrade when you need more</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              name: 'Free',
              price: '$0',
              period: '/month',
              desc: 'Perfect for occasional signers',
              features: ['3 documents per month', 'Unlimited signers', 'PDF download', 'Audit trail', 'Email notifications'],
              cta: 'Start free',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '$12',
              period: '/month',
              desc: 'For individuals and freelancers',
              features: ['Unlimited documents', 'Reusable templates', 'Priority delivery', 'Custom branding', 'All Free features'],
              cta: 'Get Pro',
              highlight: true,
            },
            {
              name: 'Team',
              price: '$29',
              period: '/month',
              desc: 'For teams and agencies',
              features: ['Everything in Pro', 'Up to 10 team members', 'Shared templates', 'Team dashboard', 'Bulk send'],
              cta: 'Get Team',
              highlight: false,
            },
          ].map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border ${plan.highlight ? 'bg-[#7c3aed]/5 border-[#7c3aed]/50' : 'bg-[#111] border-[#222]'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#7c3aed] text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-[#888]">{plan.period}</span>
                </div>
                <p className="text-[#888] text-sm">{plan.desc}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#b3b3b3]">
                    <CheckCircle size={14} className="text-[#7c3aed] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-3 rounded-xl font-medium transition-colors text-sm ${
                  plan.highlight
                    ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white'
                    : 'border border-[#333] hover:border-[#555] text-[#888] hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to start signing?</h2>
          <p className="text-[#888] text-lg mb-8">Join thousands of professionals who sign documents with ZiggyDocs.</p>
          <Link href="/signup" className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
            Create free account →
          </Link>
        </div>
      </section>

    </div>
  )
}
