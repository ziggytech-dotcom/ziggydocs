import Link from 'next/link'

const accent = '#7c3aed'

const tiers = [
  {
    name: 'Starter',
    price: '$25',
    period: '/mo',
    description: 'Great for freelancers and solo users.',
    features: [
      '1 user seat',
      'Up to 25 documents/mo',
      'E-signature collection',
      'PDF generation',
      'Basic templates',
      'Document status tracking',
      'Email delivery',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'For teams that send documents daily.',
    features: [
      '5 user seats',
      'Unlimited documents',
      'Bulk send',
      'Zapier + API integrations',
      'Custom branding',
      'Template library',
      'Document archive',
      'Audit trail',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: '/mo',
    description: 'Advanced workflows for growing companies.',
    features: [
      '15 user seats',
      'Everything in Pro',
      'Priority support',
      'Custom domain',
      'Advanced access controls',
      'SSO login',
      'Document analytics',
      'Webhook events',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'High-volume, high-compliance document ops.',
    features: [
      'Unlimited users',
      'Everything in Business',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      'Compliance & data residency',
      'Onboarding & training',
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@ziggydocs.com',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: accent }}>Z</div>
          <span className="font-bold text-white">ZiggyDocs</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[#b3b3b3] hover:text-white transition-colors">Sign in</Link>
          <Link href="/signup" className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors" style={{ backgroundColor: accent, color: '#fff' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-20 pb-12 px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6" style={{ borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}10` }}>
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Documents that close deals.<br />
          <span style={{ color: accent }}>Pricing that makes sense.</span>
        </h1>
        <p className="text-[#b3b3b3] text-lg max-w-xl mx-auto">
          ZiggyDocs lets you create, send, and collect e-signatures on any document — fast and beautiful.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="relative rounded-2xl border p-6 flex flex-col"
              style={{
                backgroundColor: tier.highlighted ? `${accent}0d` : '#111111',
                borderColor: tier.highlighted ? accent : '#2d2d2d',
              }}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: accent, color: '#fff' }}>
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold" style={{ color: tier.highlighted ? accent : 'white' }}>{tier.price}</span>
                  {tier.period && <span className="text-[#b3b3b3] text-sm">{tier.period}</span>}
                </div>
                <p className="text-[#b3b3b3] text-sm">{tier.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#b3b3b3]">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accent }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className="block text-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-all"
                style={
                  tier.highlighted
                    ? { backgroundColor: accent, color: '#fff' }
                    : { border: `1px solid #2d2d2d`, color: 'white', backgroundColor: 'transparent' }
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#666] mt-10">
          All plans include a 14-day free trial. No credit card required.{' '}
          <Link href="/login" className="hover:text-white transition-colors" style={{ color: accent }}>Already have an account?</Link>
        </p>
      </section>
    </div>
  )
}
