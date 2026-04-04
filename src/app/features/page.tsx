import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import { FileText, PenLine, Send, Shield, Zap, Users, Clock, Download, CheckCircle, Lock, Globe, BarChart3 } from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'PDF Upload & Editor',
      description: 'Upload any PDF and place signature fields, text boxes, initials, and date fields with our drag-and-drop editor.',
    },
    {
      icon: <PenLine className="w-6 h-6" />,
      title: 'E-Signature Collection',
      description: 'Legally binding e-signatures compliant with ESIGN and UETA. Signers complete documents in seconds &mdash; no account needed.',
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: 'Instant Delivery',
      description: 'Send documents via email link. Recipients sign from any device &mdash; desktop, tablet, or phone &mdash; without installing anything.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multi-Recipient Signing',
      description: 'Send to multiple signers with sequential or parallel signing order. Everyone gets notified automatically.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Auto-Reminders',
      description: 'Never chase a signer again. Automatic reminders go out until the document is signed or expired.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Audit Trail',
      description: 'Every action &mdash; open, viewed, signed &mdash; is timestamped and logged. Certificate of completion included.',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'PDF Generation',
      description: 'Download signed documents as a clean PDF with signature stamps and the full audit trail embedded.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Secure Storage',
      description: 'All documents are encrypted at rest and in transit. Stored in secure cloud infrastructure with 99.9% uptime.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Template Library',
      description: 'Save your most-used documents as templates. Send the same contract in seconds &mdash; pre-filled with signer info.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Bulk Send',
      description: 'Send the same document to hundreds of signers at once. Perfect for NDAs, onboarding, and compliance forms.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Document Analytics',
      description: 'See when documents are opened, how long signers spend on each page, and where they drop off.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'ESIGN & UETA Compliant',
      description: 'ZiggyDocs signatures are legally valid in the US under federal ESIGN and state UETA laws.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <ZiggyDocsLogo size="md" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <Link href="/features" className="text-white font-medium transition-colors">Features</Link>
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
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-4 py-1.5 text-sm text-[#a78bfa] mb-8">
          <Zap size={13} />
          Everything you need to get documents signed
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-6">
          Powerful features.<br />
          <span className="text-[#7c3aed]">Simple experience.</span>
        </h1>
        <p className="text-xl text-[#888] max-w-2xl mx-auto leading-relaxed">
          ZiggyDocs gives you everything you need to send, sign, and manage documents &mdash; without the complexity of enterprise tools.
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#7c3aed]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center text-[#a78bfa] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-[#666] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-[#888] mb-8">14-day free trial. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Start for free →
          </Link>
        </div>
      </section>
    </div>
  )
}
