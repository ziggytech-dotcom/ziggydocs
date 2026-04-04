import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'

export const metadata = {
  title: 'Cookie Policy &mdash; ZiggyDocs',
  description: 'How ZiggyDocs uses cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ZiggyDocsLogo size="md" />
          </Link>
          <Link href="/" className="text-sm text-[#888] hover:text-white transition-colors">
            ← Back
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-3 py-1 text-xs text-[#a78bfa] mb-6">
            Legal Document
          </div>
          <h1 className="text-4xl font-black mb-4">Cookie Policy</h1>
          <p className="text-[#888]">
            ZiggyTech Ventures LLC &mdash; Effective Date: 2026 &mdash;{' '}
            <span className="text-[#555]">Draft &mdash; Attorney review pending</span>
          </p>
        </div>

        <div className="space-y-10 text-[#b3b3b3] leading-relaxed">

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device by websites you visit. They help websites function correctly,
              remember your preferences, and provide analytics about usage patterns. We also use similar technologies such as
              local storage and session storage.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Cookies We Use</h2>

            <div className="space-y-4">
              {/* Strictly Necessary */}
              <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
                  <h3 className="text-white font-semibold">Strictly Necessary</h3>
                  <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-0.5 rounded-full">Cannot be disabled</span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3">
                  <p className="text-[#888]">Essential for the service to function. Required for login sessions, security, and CSRF protection.</p>
                  {[
                    { name: 'session_id / auth_token', purpose: 'Maintains your login session', duration: 'Session / 30 days' },
                    { name: 'csrf_token', purpose: 'Protects against cross-site request forgery', duration: 'Session' },
                    { name: 'user_prefs', purpose: 'Essential UI preferences', duration: '1 year' },
                  ].map(c => (
                    <div key={c.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-t border-[#1a1a1a]">
                      <div>
                        <span className="font-mono text-xs text-[#a78bfa]">{c.name}</span>
                        <span className="text-[#888] text-xs ml-2">&mdash; {c.purpose}</span>
                      </div>
                      <span className="text-[#555] text-xs shrink-0">{c.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functional */}
              <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
                  <h3 className="text-white font-semibold">Functional</h3>
                  <span className="text-xs text-[#7c3aed] bg-[#7c3aed]/10 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <div className="px-5 py-4 text-sm space-y-3">
                  <p className="text-[#888]">Remember your preferences and enhance usability. Disabling these may affect features.</p>
                  {[
                    { name: 'ui_theme', purpose: 'Remembers light/dark theme preference', duration: '1 year' },
                    { name: 'sidebar_state', purpose: 'Sidebar collapsed/expanded state', duration: '6 months' },
                    { name: 'onboarding_progress', purpose: 'Tracks onboarding completion', duration: '90 days' },
                    { name: 'ziggydocs_cookie_consent', purpose: 'Stores your cookie consent preference', duration: 'Persistent (localStorage)' },
                  ].map(c => (
                    <div key={c.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-t border-[#1a1a1a]">
                      <div>
                        <span className="font-mono text-xs text-[#a78bfa]">{c.name}</span>
                        <span className="text-[#888] text-xs ml-2">&mdash; {c.purpose}</span>
                      </div>
                      <span className="text-[#555] text-xs shrink-0">{c.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
                  <h3 className="text-white font-semibold">Analytics</h3>
                  <span className="text-xs text-[#7c3aed] bg-[#7c3aed]/10 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <div className="px-5 py-4 text-sm">
                  <p className="text-[#888] mb-3">Help us understand how you use the service. Data is aggregated and generally not personally identifiable.</p>
                  <p>Providers: Google Analytics, Vercel Speed Insights, internal aggregate usage metrics.</p>
                  <p className="mt-2 text-xs text-[#555]">Retention: up to 2 years depending on provider. See provider policies for details.</p>
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
                  <h3 className="text-white font-semibold">Security</h3>
                  <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-0.5 rounded-full">Cannot be disabled</span>
                </div>
                <div className="px-5 py-4 text-sm">
                  <p className="text-[#888]">Used for device recognition, bot detection, and rate limiting to protect our services and your account.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Your Choices</h2>
            <div className="space-y-4 text-sm">
              <div className="bg-[#111] border border-[#222] rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">Browser Controls</h3>
                <p className="text-[#888] mb-3">Most browsers let you control or delete cookies through their settings:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                    { name: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences' },
                    { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
                    { name: 'Edge', url: 'https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d' },
                  ].map(b => (
                    <a
                      key={b.name}
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#7c3aed] hover:underline text-xs bg-[#7c3aed]/10 px-3 py-1.5 rounded-lg"
                    >
                      {b.name} →
                    </a>
                  ))}
                </div>
                <p className="text-[#555] text-xs mt-3">
                  Note: Disabling strictly necessary cookies will prevent you from logging in and using core features.
                </p>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">Google Analytics Opt-Out</h3>
                <p className="text-[#888]">
                  Install the{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:underline">
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  {' '}to opt out across all websites.
                </p>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-xl p-5">
                <h3 className="text-white font-semibold mb-2">California Residents (CCPA/CPRA)</h3>
                <p className="text-[#888]">
                  To opt out of any sharing of personal information through marketing cookies, email{' '}
                  <a href="mailto:legal@ziggytechventures.com?subject=CCPA Opt-Out &mdash; Cookies" className="text-[#7c3aed] hover:underline">
                    legal@ziggytechventures.com
                  </a>
                  {' '}with subject &ldquo;CCPA Opt-Out &mdash; Cookies.&rdquo; We do not sell personal information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Providers</h2>
            <p className="text-sm mb-4">
              Some cookies are set by third-party providers. We do not control third-party cookies.
              Review their privacy policies for details:
            </p>
            <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden text-sm">
              {[
                { name: 'Supabase', url: 'https://supabase.com/privacy' },
                { name: 'Vercel', url: 'https://vercel.com/legal/privacy-policy' },
                { name: 'Stripe', url: 'https://stripe.com/privacy' },
                { name: 'Google Analytics', url: 'https://policies.google.com/privacy' },
              ].map((p, i) => (
                <div key={p.name} className={`flex items-center justify-between px-5 py-3 ${i < 3 ? 'border-b border-[#1a1a1a]' : ''}`}>
                  <span className="text-[#b3b3b3]">{p.name}</span>
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:underline text-xs">
                    Privacy Policy →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Contact</h2>
            <div className="bg-[#111] border border-[#222] rounded-xl p-5 text-sm">
              <p className="text-white font-semibold mb-2">ZiggyTech Ventures LLC &mdash; Privacy &amp; Legal Affairs</p>
              <p>
                Email:{' '}
                <a href="mailto:legal@ziggytechventures.com" className="text-[#7c3aed] hover:underline">
                  legal@ziggytechventures.com
                </a>
              </p>
              <p className="mt-1">Las Vegas, Nevada</p>
            </div>
          </section>

          <div className="border-t border-[#1a1a1a] pt-8 text-xs text-[#555]">
            <p>
              This Cookie Policy is a draft template requiring review by qualified legal counsel before publication or enforcement.
              ZiggyTech Ventures LLC, EIN 41-4738365.
            </p>
            <div className="flex gap-6 mt-4">
              <Link href="/privacy" className="text-[#7c3aed] hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="text-[#7c3aed] hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
