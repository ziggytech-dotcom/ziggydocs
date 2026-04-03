import Script from "next/script"

const accent = "#7c3aed"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "ZiggyDocs",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://ziggydocs.com",
      "description": "Document management and e-signature platform. Send contracts, get them signed, store them securely. No envelope limits.",
      "offers": [
        {
          "@type": "Offer",
          "name": "Starter",
          "price": "15.00",
          "priceCurrency": "USD",
          "description": "5 templates, 30 docs/mo, basic fields, e-sign, client view"
        },
        {
          "@type": "Offer",
          "name": "Pro",
          "price": "25.00",
          "priceCurrency": "USD",
          "description": "Unlimited templates, unlimited docs, bulk send, audit trail, custom branding, folder organization"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does ZiggyDocs cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ZiggyDocs starts at $15/mo for the Starter plan (5 templates, 30 docs/mo). The Pro plan is $25/mo with unlimited templates, unlimited documents, bulk send, custom branding, and audit trail."
          }
        },
        {
          "@type": "Question",
          "name": "Do my clients need a ZiggyDocs account to sign?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Your clients receive a link and sign directly in their browser — no account, no app download, no friction."
          }
        }
      ]
    }
  ]
}

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @media (max-width: 768px) { .nav-links { display: none !important; } }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1f1f1f",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1120,
          margin: "0 auto",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 700, color: "#fff", textDecoration: "none", letterSpacing: "-0.5px" }}>
            Ziggy<span style={{ color: accent }}>Docs</span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div className="nav-links" style={{ display: "flex", gap: 28 }}>
              {[["Features", "#features"], ["Compare", "/vs/docusign"], ["Pricing", "#pricing"], ["Blog", "/blog"], ["Sign In", "https://app.ziggydocs.com/login"]].map(([label, href]) => (
                <a key={label} href={href} style={{ color: "#888", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>
                  {label}
                </a>
              ))}
            </div>
            <a href="https://app.ziggydocs.com/signup" style={{
              background: accent,
              color: "#fff",
              textDecoration: "none",
              padding: "9px 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              Start Free Trial
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding: "100px 24px 80px",
        textAlign: "center",
        maxWidth: 820,
        margin: "0 auto",
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: 99,
          padding: "6px 16px",
          fontSize: 13,
          color: accent,
          fontWeight: 600,
          marginBottom: 28,
          letterSpacing: "0.02em",
        }}>
          DocuSign Alternative · 44% less per month
        </div>

        <h1 style={{
          fontSize: "clamp(42px, 6vw, 68px)",
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-1.5px",
          marginBottom: 24,
          color: "#fff",
        }}>
          Send it. Sign it. Done.<br />
          <span style={{
            background: `linear-gradient(135deg, #fff 0%, ${accent} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>No envelope limits. No per-user fees.</span>
        </h1>

        <p style={{ fontSize: 19, color: "#888", lineHeight: 1.6, marginBottom: 40, maxWidth: 580, margin: "0 auto 40px" }}>
          DocuSign charges $45/mo and counts every envelope. ZiggyDocs gives you unlimited documents, reusable templates, e-signatures with audit trail, and a client portal for <strong style={{ color: "#fff" }}>$25/mo</strong> — no gotchas.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://app.ziggydocs.com/signup" style={{
            background: accent,
            color: "#fff",
            textDecoration: "none",
            padding: "15px 30px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
          }}>
            Start Free Trial — 14 days free
          </a>
          <a href="#features" style={{
            background: "transparent",
            color: "#fff",
            textDecoration: "none",
            padding: "15px 30px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            border: "1px solid #333",
          }}>
            See Features
          </a>
        </div>

        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          {["✓ No credit card required", "✓ 14-day free trial", "✓ Cancel anytime"].map(badge => (
            <span key={badge} style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>{badge}</span>
          ))}
        </div>
      </section>

      {/* ── PROBLEM STRIP ── */}
      <section style={{
        background: "#0f0f0f",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "56px 24px",
      }}>
        <div style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 32,
          textAlign: "center",
        }}>
          {[
            {
              emoji: "📩",
              headline: "DocuSign charges you per envelope.",
              body: "Every document sent counts against your monthly limit. Go over and you pay overage fees. That's not a document platform — that's a meter running.",
            },
            {
              emoji: "🗂️",
              headline: "Signed docs scattered everywhere.",
              body: "PDFs in email, original drafts in Google Drive, signed copies downloaded to someone's desktop. Finding that contract from six months ago shouldn't be a hunt.",
            },
            {
              emoji: "😩",
              headline: "Clients hate the signing experience.",
              body: "Forcing clients to create a DocuSign account just to sign your NDA adds friction and delays. Your clients want to sign and move on — not set up another login.",
            },
          ].map(({ emoji, headline, body }) => (
            <div key={headline}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{headline}</h3>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "96px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 16, color: "#fff" }}>
            Everything you need to send, sign, and store.
          </h2>
          <p style={{ fontSize: 17, color: "#666", maxWidth: 500, margin: "0 auto" }}>
            Built for businesses that send contracts, agreements, and forms — without the enterprise complexity or enterprise pricing.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {[
            {
              icon: "🖱️",
              title: "Drag-and-Drop Document Builder",
              desc: "Build contracts and forms visually. Place signature fields, date fields, initials, text inputs — anywhere on the page. No code, no formatting headaches.",
            },
            {
              icon: "✍️",
              title: "E-Signature with Audit Trail",
              desc: "Legally binding e-signatures on every document. Every action — opened, viewed, signed — is timestamped and stored in an immutable audit log.",
            },
            {
              icon: "📄",
              title: "Reusable Templates",
              desc: "Build once, send forever. Create templates for your most-used docs — contracts, NDAs, SOWs, proposals — and send them in seconds without reformatting.",
            },
            {
              icon: "📨",
              title: "Bulk Send",
              desc: "One template, many recipients. Send the same document to 10, 50, or 500 people at once. Each signer gets their own unique copy.",
            },
            {
              icon: "🔗",
              title: "Client Signing Portal",
              desc: "Clients click a link and sign directly in their browser. No ZiggyDocs account required. No app download. Just click, review, and sign.",
            },
            {
              icon: "🔔",
              title: "Automatic Reminders",
              desc: "ZiggyDocs automatically follows up with signers who haven't opened or signed yet. You get notified when it's done. Zero chasing.",
            },
            {
              icon: "📁",
              title: "Folder Organization & Document Search",
              desc: "Organize documents by client, project, or type. Search by name, recipient, status, or date. Find any signed contract in seconds.",
            },
            {
              icon: "🎨",
              title: "Custom Branding on Signing Pages",
              desc: "Your logo, your colors on the signing experience. Clients see your brand — not DocuSign's. Looks professional. Builds trust.",
            },
            {
              icon: "⬇️",
              title: "Download Signed PDFs Instantly",
              desc: "As soon as everyone signs, download the completed PDF in one click. Share with clients, file it, or send it somewhere else — immediately.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: 14,
              padding: "28px 24px",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMING SOON STRIP ── */}
      <section style={{
        background: "#0d0d0d",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#fff" }}>What&apos;s coming next</h2>
            <p style={{ color: "#555", fontSize: 15 }}>We ship fast. Here&apos;s what&apos;s already in development.</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {[
              {
                icon: "🔗",
                title: "CRM Integration",
                badge: "In Development",
                badgeColor: "#ff9500",
                desc: "Connect ZiggyDocs to your CRM. Send documents directly from contact records, and auto-log signing activity back to the CRM.",
              },
              {
                icon: "🌿",
                title: "Conditional Fields",
                badge: "In Development",
                badgeColor: "#ff9500",
                desc: "Show or hide form fields based on signer answers. Build smarter documents that adapt — intake forms, contracts with optional clauses, custom agreements.",
              },
              {
                icon: "💳",
                title: "Payment Collection on Signing",
                badge: "Coming Soon",
                badgeColor: "#0066ff",
                desc: "Collect a deposit or full payment the moment someone signs. No extra invoicing step — get the signature and the money in one flow.",
              },
            ].map(({ icon, title, badge, badgeColor, desc }) => (
              <div key={title} style={{
                background: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: "24px 22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{icon}</span>
                  <span style={{
                    background: `${badgeColor}20`,
                    color: badgeColor,
                    border: `1px solid ${badgeColor}40`,
                    borderRadius: 99,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase" as const,
                  }}>{badge}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section style={{
        padding: "96px 24px",
        background: "#080808",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 14, color: "#fff" }}>
              Built for your industry
            </h2>
            <p style={{ fontSize: 17, color: "#666", maxWidth: 500, margin: "0 auto" }}>
              Any business that sends documents for signature — this is built for you.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}>
            {[
              { icon: "🏠", name: "Real Estate", desc: "Purchase agreements, lease agreements, disclosure forms, and buyer representation contracts — all digital." },
              { icon: "🏗️", name: "Contractors", desc: "Project contracts, change orders, lien waivers, and subcontractor agreements. Get them signed before work starts." },
              { icon: "🎨", name: "Creative Agencies", desc: "SOWs, client agreements, licensing contracts, and project proposals. Your agreements, branded and professional." },
              { icon: "💼", name: "Consulting & Professional Services", desc: "Engagement letters, NDAs, retainer agreements — send and sign in minutes, not days." },
              { icon: "🏥", name: "Healthcare", desc: "Patient intake forms, consent forms, and HIPAA acknowledgments. Collect signatures before the appointment." },
              { icon: "🎓", name: "Coaching & Education", desc: "Enrollment agreements, liability waivers, and program contracts. Onboard clients without the paperwork chase." },
              { icon: "🏢", name: "Property Management", desc: "Lease agreements, vendor contracts, and inspection reports. Tenants and vendors sign without visiting your office." },
              { icon: "💻", name: "Tech & SaaS", desc: "MSAs, DPAs, contractor agreements, and reseller contracts. Legally binding, properly tracked, instantly accessible." },
            ].map(({ icon, name, desc }) => (
              <div key={name} style={{
                background: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: 14,
                padding: "24px 22px",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}>
                <span style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{name}</h3>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(124,58,237,0.06)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 14,
            padding: "32px 36px",
            display: "flex",
            flexWrap: "wrap" as const,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Need custom templates for your workflow?</h3>
              <p style={{ fontSize: 15, color: "#888", maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
                Our team will help you set up the exact document templates your business uses every day — ready to send on day one.
              </p>
            </div>
            <a href="https://app.ziggydocs.com/signup" style={{
              background: accent,
              color: "#fff",
              textDecoration: "none",
              padding: "13px 26px",
              borderRadius: 9,
              fontSize: 15,
              fontWeight: 600,
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
            }}>
              Start Free Trial →
            </a>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: "96px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 12, color: "#fff" }}>
            ZiggyDocs vs DocuSign
          </h2>
          <p style={{ color: "#666", fontSize: 16 }}>
            Same legally binding e-signatures. No envelope counting. 44% cheaper.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f" }}>Feature</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: accent, fontWeight: 700, fontSize: 15, borderBottom: "1px solid #1f1f1f", background: "rgba(124,58,237,0.05)" }}>ZiggyDocs</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f" }}>DocuSign</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Starting price", "$15/mo", "$45/mo (Personal)"],
                ["Unlimited plan price", "$25/mo", "$65+/mo (Standard)"],
                ["Document limits", "30 docs/mo (Starter) · Unlimited (Pro)", "10 envelopes/mo (Personal)"],
                ["Template limits", "5 templates (Starter) · Unlimited (Pro)", "5 templates (Personal)"],
                ["Bulk send", "✅ Pro plan", "⚠️ Business plan only"],
                ["Audit trail", "✅ Pro plan", "✅ Yes"],
                ["Custom branding", "✅ Pro plan", "⚠️ Business plan only"],
                ["Client portal (no account)", "✅ Yes — signers click and sign", "⚠️ Signers often need account"],
                ["Automatic reminders", "✅ Yes", "✅ Yes"],
                ["Folder organization", "✅ Pro plan", "✅ Yes"],
                ["Free trial", "✅ 14 days, no credit card", "✅ 30 days"],
                ["Annual contract", "❌ No — cancel anytime", "⚠️ Annual required for best rates"],
                ["CRM integration", "🔧 Coming soon", "✅ Via Salesforce/HubSpot"],
                ["Payment on signing", "🔧 Coming soon", "⚠️ Payments add-on"],
              ].map(([feature, ziggydocs, docusign], i) => (
                <tr key={feature} style={{ background: i % 2 === 0 ? "transparent" : "#0d0d0d" }}>
                  <td style={{ padding: "14px 20px", color: "#888", borderBottom: "1px solid #161616" }}>{feature}</td>
                  <td style={{ padding: "14px 20px", color: "#fff", textAlign: "center", borderBottom: "1px solid #161616", background: "rgba(124,58,237,0.03)", fontWeight: 500 }}>{ziggydocs}</td>
                  <td style={{ padding: "14px 20px", color: "#555", textAlign: "center", borderBottom: "1px solid #161616" }}>{docusign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: 32,
          background: "#111111",
          border: "1px solid #1f1f1f",
          borderRadius: 14,
          padding: "24px 28px",
        }}>
          <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#fff" }}>Bottom line:</strong> DocuSign charges $45/mo and counts every envelope. We don&apos;t count envelopes. Pro plan at $25/mo — unlimited documents, unlimited templates, unlimited clients. 44% cheaper with no gotchas.{" "}
            <a href="/vs/docusign" style={{ color: accent, textDecoration: "underline" }}>See full comparison →</a>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#444" }}>
          Pricing data sourced from DocuSign.com · Updated March 2026
        </p>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{
        padding: "96px 24px",
        background: "#080808",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 12, color: "#fff" }}>
              Simple pricing. No envelope counting.
            </h2>
            <p style={{ color: "#666", fontSize: 16 }}>
              Two plans. Both dramatically cheaper than DocuSign.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            alignItems: "start",
          }}>
            {[
              {
                name: "Starter",
                price: "$15",
                period: "/mo",
                sub: "For businesses getting started",
                features: [
                  "5 document templates",
                  "30 documents per month",
                  "Basic signature & date fields",
                  "E-signature (legally binding)",
                  "Client signing portal",
                  "Download signed PDFs",
                  "14-day free trial",
                ],
                cta: "Start Free Trial",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$25",
                period: "/mo",
                sub: "For businesses that send regularly",
                features: [
                  "Unlimited templates",
                  "Unlimited documents per month",
                  "Bulk send (one template → many)",
                  "Full audit trail",
                  "Custom branding on signing pages",
                  "Folder organization & search",
                  "Automatic reminders",
                  "Priority support",
                ],
                cta: "Start Free Trial",
                highlighted: true,
              },
            ].map(({ name, price, period, sub, features, cta, highlighted }) => (
              <div key={name} style={{
                background: "#111111",
                border: highlighted ? `2px solid ${accent}` : "1px solid #1f1f1f",
                borderRadius: 14,
                padding: "36px 32px",
                position: "relative" as const,
              }}>
                {highlighted && (
                  <div style={{
                    position: "absolute" as const,
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: accent,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    padding: "4px 14px",
                    borderRadius: 99,
                    whiteSpace: "nowrap" as const,
                  }}>Best Value</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: highlighted ? accent : "#888", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>{name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
                  <span style={{ fontSize: 56, fontWeight: 700, color: "#fff", letterSpacing: "-1.5px" }}>{price}</span>
                  <span style={{ fontSize: 18, color: "#555" }}>{period}</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", marginBottom: 28 }}>{sub}</p>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
                  {features.map(f => (
                    <li key={f} style={{ padding: "7px 0", fontSize: 14, color: "#bbb", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #1a1a1a" }}>
                      <span style={{ color: accent, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="https://app.ziggydocs.com/signup" style={{
                  display: "block",
                  background: highlighted ? accent : "transparent",
                  color: "#fff",
                  textDecoration: "none",
                  padding: "14px",
                  borderRadius: 9,
                  fontSize: 15,
                  fontWeight: 600,
                  textAlign: "center" as const,
                  border: highlighted ? "none" : "1px solid #333",
                }}>
                  {cta}
                </a>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32,
            background: "#111111",
            border: "1px solid #1f1f1f",
            borderRadius: 14,
            padding: "22px 24px",
            textAlign: "center" as const,
          }}>
            <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>
              🏢 <strong style={{ color: "#fff" }}>Using multiple ZiggyTech apps?</strong> Bundle ZiggyDocs with the full suite at{" "}
              <a href="https://ziggybusiness.com" style={{ color: accent, textDecoration: "underline" }}>ZiggyTech Business Suite</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "96px 24px", maxWidth: 740, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.6px", marginBottom: 48, textAlign: "center", color: "#fff" }}>
          Questions? We&apos;ve got answers.
        </h2>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
          {[
            {
              q: "Do my clients need a ZiggyDocs account to sign?",
              a: "No. Your clients receive a link and sign directly in their browser — no account, no app download, no friction. That's how it should work.",
            },
            {
              q: "Are the signatures legally binding?",
              a: "Yes. ZiggyDocs e-signatures comply with ESIGN Act and UETA standards. Every signed document includes a certificate of completion with timestamps, IP addresses, and a full audit trail. Courts accept them.",
            },
            {
              q: "What's the difference between Starter and Pro?",
              a: "Starter is $15/mo and includes 5 templates and 30 documents per month — enough for most small businesses getting started. Pro is $25/mo and removes all limits: unlimited templates, unlimited documents, bulk send, custom branding, audit trail, and folder organization. Most businesses upgrade to Pro within their first month.",
            },
            {
              q: "How does bulk send work?",
              a: "Create one template (say, your NDA), add a list of recipients, and ZiggyDocs sends each person their own unique copy to sign. All tracked and collected in one place. Bulk send is available on the Pro plan.",
            },
            {
              q: "How does the free trial work?",
              a: "Sign up and get 14 days free — no credit card required. Full access to Pro features during the trial. If you decide not to continue, just don't. Nothing to cancel.",
            },
            {
              q: "Can I use my own branding on signing pages?",
              a: "Yes — on the Pro plan. Upload your logo and set your brand colors. Your clients see your brand throughout the signing experience, not ours.",
            },
          ].map(({ q, a }) => (
            <details key={q} style={{
              background: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <summary style={{
                padding: "20px 24px",
                fontSize: 16,
                fontWeight: 600,
                color: "#fff",
                cursor: "pointer",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {q}
                <span style={{ color: accent, fontSize: 20, fontWeight: 400, flexShrink: 0 }}>+</span>
              </summary>
              <div style={{ padding: "0 24px 20px", fontSize: 15, color: "#777", lineHeight: 1.7, borderTop: "1px solid #1a1a1a" }}>
                <p style={{ marginTop: 16 }}>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center" as const,
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0a14 100%)",
        borderTop: "1px solid #1f1f1f",
      }}>
        <h2 style={{
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 700,
          letterSpacing: "-1.5px",
          marginBottom: 20,
          lineHeight: 1.1,
          color: "#fff",
        }}>
          Stop counting envelopes.<br />
          <span style={{
            background: `linear-gradient(135deg, #fff 0%, ${accent} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Just send the document.</span>
        </h2>
        <p style={{ fontSize: 18, color: "#555", marginBottom: 40 }}>
          14 days free. No credit card. Cancel anytime.
        </p>
        <a href="https://app.ziggydocs.com/signup" style={{
          display: "inline-block",
          background: accent,
          color: "#fff",
          textDecoration: "none",
          padding: "18px 40px",
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.2px",
        }}>
          Start Free Trial →
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#050505",
        borderTop: "1px solid #111",
        padding: "40px 24px",
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: 20,
          textAlign: "center" as const,
        }}>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const, justifyContent: "center" }}>
            {[["Home", "/"], ["Features", "#features"], ["Pricing", "#pricing"], ["Compare", "/vs/docusign"], ["Blog", "/blog"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Sign In", "https://app.ziggydocs.com/login"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "#555", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
                {label}
              </a>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "#333" }}>
            Part of{" "}
            <a href="https://ziggybusiness.com" style={{ color: "#555", textDecoration: "none" }}>ZiggyTech Business Suite</a>
            {" · "}
            <a href="https://ziggybusiness.com" style={{ color: "#555", textDecoration: "none" }}>ziggybusiness.com</a>
          </p>

          <p style={{ fontSize: 13, color: "#2a2a2a" }}>
            © 2026 ZiggyDocs. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
