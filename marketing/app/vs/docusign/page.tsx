import Script from "next/script"

const accent = "#7c3aed"

export const metadata = {
  title: "ZiggyDocs vs DocuSign — $25/mo vs $45/mo. Unlimited Documents. No Envelope Limits.",
  description:
    "DocuSign counts every envelope and charges $45/mo. ZiggyDocs gives you unlimited documents, unlimited templates, and custom branding for $25/mo.",
}

export default function VsDocuSign() {
  return (
    <>
      <Script
        id="json-ld-vs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ZiggyDocs vs DocuSign",
            "description": "Feature and pricing comparison between ZiggyDocs and DocuSign for e-signature and document management."
          })
        }}
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
              {[["Features", "/#features"], ["Compare", "/vs/docusign"], ["Pricing", "/#pricing"], ["Blog", "/blog"], ["Sign In", "https://app.ziggydocs.com/login"]].map(([label, href]) => (
                <a key={label} href={href} style={{ color: "#888", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>{label}</a>
              ))}
            </div>
            <a href="https://app.ziggydocs.com/signup" style={{
              background: accent, color: "#fff", textDecoration: "none",
              padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
            }}>Start Free Trial</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "inline-block",
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: 99,
          padding: "6px 16px",
          fontSize: 13,
          color: accent,
          fontWeight: 600,
          marginBottom: 24,
          letterSpacing: "0.02em",
        }}>Detailed Comparison · Updated March 2026</div>

        <h1 style={{
          fontSize: "clamp(36px, 5vw, 58px)",
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: "-1.5px",
          marginBottom: 20,
          color: "#fff",
        }}>
          ZiggyDocs vs DocuSign
        </h1>

        <p style={{ fontSize: 18, color: "#888", lineHeight: 1.6, maxWidth: 620, margin: "0 auto 32px" }}>
          DocuSign charges $45/mo and counts every envelope. We don&apos;t count envelopes. Pro plan at $25/mo — unlimited documents, unlimited templates, unlimited clients. 44% cheaper with no gotchas.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://app.ziggydocs.com/signup" style={{
            background: accent, color: "#fff", textDecoration: "none",
            padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600,
          }}>Start Free Trial — No credit card</a>
          <a href="/#pricing" style={{
            background: "transparent", color: "#fff", textDecoration: "none",
            padding: "14px 28px", borderRadius: 10, fontSize: 15, fontWeight: 600,
            border: "1px solid #333",
          }}>See Pricing</a>
        </div>
      </section>

      {/* ── PRICE CALLOUT ── */}
      <section style={{
        background: "#0f0f0f",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "48px 24px",
      }}>
        <div style={{
          maxWidth: 860,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 24,
          textAlign: "center",
        }}>
          {[
            { label: "ZiggyDocs Pro — Unlimited Everything", price: "$25/mo", sub: "14-day free trial, no card required", highlight: true },
            { label: "DocuSign Personal — 10 envelopes/mo", price: "$45/mo", sub: "Annual contract for best rates", highlight: false },
            { label: "You save per month", price: "$20/mo", sub: "That's $240/year back in your pocket", highlight: true },
          ].map(({ label, price, sub, highlight }) => (
            <div key={label} style={{
              background: highlight ? "rgba(124,58,237,0.08)" : "#111111",
              border: highlight ? "1px solid rgba(124,58,237,0.3)" : "1px solid #1f1f1f",
              borderRadius: 14,
              padding: "28px 24px",
            }}>
              <p style={{ fontSize: 12, color: "#555", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 10 }}>{label}</p>
              <p style={{ fontSize: 44, fontWeight: 700, color: highlight ? accent : "#555", letterSpacing: "-1.5px", marginBottom: 6 }}>{price}</p>
              <p style={{ fontSize: 13, color: "#555" }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE BIG PROBLEM WITH DOCUSIGN ── */}
      <section style={{ padding: "64px 24px", maxWidth: 860, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 32, textAlign: "center", color: "#fff" }}>
          The problem with DocuSign for small business
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}>
          {[
            { icon: "📊", headline: "They count every envelope", body: "DocuSign Personal limits you to 10 envelopes per month. Send your 11th document and you either upgrade or wait until next month. That's not a feature — that's artificial scarcity." },
            { icon: "💰", headline: "Price jumps are brutal", body: "Personal is $45/mo for 10 envelopes. Standard is $65/mo. Business Pro is $99/mo. Every time you need one more thing, the price jumps significantly." },
            { icon: "🔐", headline: "Signers need accounts", body: "DocuSign sometimes requires signers to create an account just to view and sign a document. That creates friction, delays, and abandoned signings." },
          ].map(({ icon, headline, body }) => (
            <div key={headline} style={{
              background: "#111111",
              border: "1px solid #1f1f1f",
              borderRadius: 14,
              padding: "28px 24px",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{headline}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FULL COMPARISON TABLE ── */}
      <section style={{
        padding: "20px 24px 80px",
        maxWidth: 960,
        margin: "0 auto",
      }}>
        <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", marginBottom: 40, textAlign: "center", color: "#fff" }}>
          Feature-by-Feature Comparison
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f", minWidth: 200 }}>Feature</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: accent, fontWeight: 700, fontSize: 15, borderBottom: "1px solid #1f1f1f", background: "rgba(124,58,237,0.05)", minWidth: 200 }}>ZiggyDocs Pro</th>
                <th style={{ textAlign: "center", padding: "14px 20px", color: "#555", fontWeight: 600, fontSize: 13, borderBottom: "1px solid #1f1f1f", minWidth: 200 }}>DocuSign Personal</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly price", "$25/mo", "$45/mo"],
                ["Documents per month", "Unlimited", "10 envelopes/mo"],
                ["Templates", "Unlimited", "5 templates"],
                ["Annual contract required", "❌ No — monthly, cancel anytime", "⚠️ Annual for best rates"],
                ["Free trial", "✅ 14 days, no credit card", "✅ 30 days"],
                ["E-signature (legally binding)", "✅ Yes", "✅ Yes"],
                ["Audit trail", "✅ Yes", "✅ Yes"],
                ["Drag-and-drop builder", "✅ Yes", "✅ Yes"],
                ["Bulk send", "✅ Yes", "❌ Business Pro only"],
                ["Custom branding", "✅ Yes", "❌ Business Pro only"],
                ["Client signing (no account needed)", "✅ Yes — always", "⚠️ Sometimes requires account"],
                ["Automatic reminders", "✅ Yes", "✅ Yes"],
                ["Folder organization", "✅ Yes", "✅ Yes"],
                ["Download signed PDFs", "✅ Instant", "✅ Yes"],
                ["CRM integration", "🔧 Coming soon", "✅ Salesforce/HubSpot"],
                ["Conditional fields", "🔧 Coming soon", "⚠️ Limited"],
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
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#444" }}>
          Pricing data sourced from DocuSign.com · Updated March 2026
        </p>
      </section>

      {/* ── VERDICT ── */}
      <section style={{
        background: "#080808",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, marginBottom: 20, color: "#fff" }}>The verdict</h2>
          <p style={{ fontSize: 17, color: "#888", lineHeight: 1.8 }}>
            DocuSign is the market leader for a reason — it&apos;s powerful, established, and legally trusted. But it was built for enterprises that send hundreds of documents a month with complex compliance requirements. If you&apos;re a small business sending contracts, NDAs, and agreements, you&apos;re massively overpaying. ZiggyDocs gives you everything you actually need — unlimited documents, reusable templates, e-signatures with audit trail, and a professional signing experience — at 44% less per month.
          </p>
          <div style={{ marginTop: 36 }}>
            <a href="https://app.ziggydocs.com/signup" style={{
              display: "inline-block",
              background: accent,
              color: "#fff",
              textDecoration: "none",
              padding: "16px 36px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
            }}>Try ZiggyDocs Free for 14 Days →</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050505", borderTop: "1px solid #111", padding: "40px 24px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 20, textAlign: "center" as const,
        }}>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const, justifyContent: "center" }}>
            {[["Home", "/"], ["Features", "/#features"], ["Pricing", "/#pricing"], ["Compare", "/vs/docusign"], ["Blog", "/blog"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Sign In", "https://app.ziggydocs.com/login"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "#555", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>{label}</a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#333" }}>
            Part of{" "}
            <a href="https://ziggybusiness.com" style={{ color: "#555", textDecoration: "none" }}>ZiggyTech Business Suite</a>
            {" · "}
            <a href="https://ziggybusiness.com" style={{ color: "#555", textDecoration: "none" }}>ziggybusiness.com</a>
          </p>
          <p style={{ fontSize: 13, color: "#2a2a2a" }}>© 2026 ZiggyDocs. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
