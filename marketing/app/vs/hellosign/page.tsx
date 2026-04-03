import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ZiggyDocs vs Dropbox Sign (HelloSign) — Better Value at $19/mo",
  description:
    "Compare ZiggyDocs vs Dropbox Sign (HelloSign). ZiggyDocs is $19/mo with unlimited documents — no 10-envelope limits. See the full comparison.",
  openGraph: {
    title: "ZiggyDocs vs Dropbox Sign (HelloSign) — Better Value at $19/mo",
    description: "ZiggyDocs gives you unlimited documents at $19/mo. Dropbox Sign limits you to 10 envelopes.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const comparison = [
  { feature: "Monthly price", ziggydocs: "$19/mo", competitor: "$25/mo (Essentials)" },
  { feature: "Documents per month", ziggydocs: "Unlimited", competitor: "10 envelopes/month" },
  { feature: "Per-user fees", ziggydocs: "None", competitor: "Yes" },
  { feature: "Templates", ziggydocs: "✓ Unlimited", competitor: "✓ 1 template (Essentials)" },
  { feature: "Mobile signing", ziggydocs: "✓ Included", competitor: "✓ Included" },
  { feature: "Auto-reminders", ziggydocs: "✓ Included", competitor: "✓ Included" },
  { feature: "Audit trail", ziggydocs: "✓ Included", competitor: "✓ Included" },
  { feature: "Certificate of completion", ziggydocs: "✓ Included", competitor: "✓ Included" },
  { feature: "Dropbox integration", ziggydocs: "—", competitor: "✓ Deep integration" },
  { feature: "API access", ziggydocs: "Coming soon", competitor: "✓ (Standard plan+)" },
  { feature: "Annual savings vs $19/mo", ziggydocs: "—", competitor: "Pay $72+ more/yr" },
];

export default function VsHelloSignPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f0a0a" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "5rem 1.5rem 3rem", textAlign: "center", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "999px",
            padding: "0.375rem 1rem",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            color: "#a78bfa",
            fontWeight: 500,
          }}
        >
          ZiggyDocs vs Dropbox Sign (HelloSign)
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
          Same limits. <span style={{ color: "#ff1744" }}>Higher price.</span> There&apos;s a better way.
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem", maxWidth: "620px", margin: "0 auto 2rem" }}>
          Dropbox Sign (formerly HelloSign) charges $25/mo with a 10-document limit on the Essentials plan. ZiggyDocs gives you truly unlimited documents for $19/mo.
        </p>
        <a
          href="https://app.ziggydocs.com/signup"
          style={{ background: "#7c3aed", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 700, textDecoration: "none", display: "inline-block" }}
        >
          Try ZiggyDocs Free →
        </a>
      </section>

      {/* Pain points */}
      <section style={{ padding: "4rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>
            Why people leave Dropbox Sign
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "📦", title: "10-document cap", desc: "The Essentials plan limits you to 10 envelopes per month — even at $25/mo. Need more? Pay more." },
              { icon: "◨", title: "Only 1 template", desc: "The Essentials plan includes just one reusable template. Every additional template costs extra." },
              { icon: "📦", title: "Dropbox dependency", desc: "Optimized for Dropbox users. If you don't use Dropbox, you're paying for integrations you'll never use." },
              { icon: "💸", title: "Price creep", desc: "As you grow, Dropbox Sign pricing escalates quickly. More users, more documents, more cost." },
            ].map((pain, i) => (
              <div key={i} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{pain.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{pain.title}</div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>{pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Feature-by-feature comparison
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9375rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "1rem", color: "#a1a1aa", fontWeight: 600, borderBottom: "1px solid #27272a" }}>Feature</th>
                  <th style={{ textAlign: "center", padding: "1rem", color: "#7c3aed", fontWeight: 700, borderBottom: "1px solid #27272a" }}>ZiggyDocs</th>
                  <th style={{ textAlign: "center", padding: "1rem", color: "#a1a1aa", fontWeight: 600, borderBottom: "1px solid #27272a" }}>Dropbox Sign Essentials</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #27272a", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "0.875rem 1rem", color: "#d4d4d8" }}>{row.feature}</td>
                    <td style={{ padding: "0.875rem 1rem", textAlign: "center", color: "#a78bfa", fontWeight: 600 }}>{row.ziggydocs}</td>
                    <td style={{ padding: "0.875rem 1rem", textAlign: "center", color: "#a1a1aa" }}>{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing visual */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            The numbers
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "2rem", textAlign: "center" }}>
              <div style={{ color: "#a1a1aa", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 600 }}>DROPBOX SIGN ESSENTIALS</div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "#ff1744" }}>$25</div>
              <div style={{ color: "#a1a1aa", marginBottom: "1rem" }}>/month · 10 envelopes</div>
              <div style={{ color: "#a1a1aa", fontSize: "0.875rem" }}>$300/year for 120 envelopes</div>
            </div>
            <div
              style={{
                background: "#18181b",
                border: "1px solid rgba(124,58,237,0.5)",
                borderRadius: "0.75rem",
                padding: "2rem",
                textAlign: "center",
                boxShadow: "0 0 30px rgba(124,58,237,0.12)",
              }}
            >
              <div style={{ color: "#7c3aed", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 600 }}>ZIGGYDOCS</div>
              <div style={{ fontSize: "3rem", fontWeight: 700, color: "#7c3aed" }}>$19</div>
              <div style={{ color: "#a1a1aa", marginBottom: "1rem" }}>/month · Unlimited documents</div>
              <div style={{ color: "#a1a1aa", fontSize: "0.875rem" }}>$228/year for unlimited</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#7c3aed" }}>Save $72/year — and get unlimited documents</div>
          </div>
        </div>
      </section>

      {/* How to switch */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            How to switch from Dropbox Sign
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { step: "1", title: "Export your documents", desc: "Download your completed documents from Dropbox Sign before cancelling." },
              { step: "2", title: "Sign up for ZiggyDocs", desc: "Free trial at app.ziggydocs.com — 14 days, no credit card." },
              { step: "3", title: "Upload your templates", desc: "Recreate your templates in ZiggyDocs. With unlimited templates included, there's no reason to hold back." },
              { step: "4", title: "Go live", desc: "Start sending documents. Recipients sign via email link — no account needed." },
              { step: "5", title: "Cancel Dropbox Sign", desc: "Cancel at the end of your billing cycle and enjoy the savings." },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ background: "#7c3aed", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, fontSize: "0.9375rem" }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.375rem" }}>{s.title}</div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "5rem 1.5rem",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(255,23,68,0.06) 100%)",
          borderTop: "1px solid #27272a",
        }}
      >
        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "1rem" }}>
          Ready to make the switch?
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", marginBottom: "2rem" }}>
          Unlimited documents. $19/mo. 14-day free trial.
        </p>
        <a
          href="https://app.ziggydocs.com/signup"
          style={{ background: "#7c3aed", color: "#fff", padding: "1rem 2.5rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "1.0625rem", textDecoration: "none", display: "inline-block" }}
        >
          Start Free Trial →
        </a>
        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/vs/docusign" style={{ color: "#7c3aed", textDecoration: "none", fontSize: "0.9375rem" }}>
            Compare with DocuSign instead →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
