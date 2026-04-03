import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "E-Sign for Real Estate Agents — ZiggyDocs",
  description:
    "ZiggyDocs is built for real estate agents. Send listing agreements, offers, and disclosures for $19/mo. Unlimited documents. Mobile signing. Legally binding.",
  openGraph: {
    title: "E-Sign for Real Estate Agents — ZiggyDocs",
    description: "Get listing agreements, offers, and disclosures signed fast. Unlimited documents for $19/mo.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RealEstatePage() {
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
          🏠 ZiggyDocs for Real Estate
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
          Close deals faster with{" "}
          <span style={{ color: "#7c3aed" }}>e-signatures built for real estate</span>
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem", maxWidth: "620px", margin: "0 auto 2rem" }}>
          Send listing agreements, purchase offers, and disclosure forms for digital signature in minutes. No envelope limits. No per-client fees. Just $19/mo.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://app.ziggydocs.com/signup"
            style={{ background: "#7c3aed", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 700, textDecoration: "none", display: "inline-block" }}
          >
            Start Free Trial →
          </a>
          <Link href="/pricing" style={{ border: "1px solid #27272a", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none", display: "inline-block" }}>
            View Pricing
          </Link>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Every document you need, signed in minutes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "📋", title: "Listing Agreements", desc: "Send listing agreements to sellers and get signatures before you leave their home. Works on any device." },
              { icon: "🏡", title: "Purchase Offers", desc: "Send and counter offers in real time. Don't miss a deal because you couldn't get a signature fast enough." },
              { icon: "📄", title: "Disclosure Forms", desc: "Send required disclosures — seller disclosures, lead paint, HOA docs — and track who's signed what." },
              { icon: "🤝", title: "Buyer Representation", desc: "Get buyer rep agreements signed before showing houses. Keep it legal and professional from day one." },
              { icon: "🔑", title: "Lease Agreements", desc: "For agents handling rentals, get leases signed by all parties quickly and securely." },
              { icon: "✏️", title: "Addendums & Amendments", desc: "Things change. Send amendments and addendums instantly and get them signed before it holds up a close." },
            ].map((uc, i) => (
              <div key={i} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{uc.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{uc.title}</div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for real estate */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Why real estate agents choose ZiggyDocs
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              {
                icon: "📱",
                title: "Mobile signing for buyers & sellers",
                desc: "Your clients can sign from their phone — sitting at an open house, in their car, or at the kitchen table. No app download, no account needed.",
              },
              {
                icon: "∞",
                title: "Unlimited documents per transaction",
                desc: "A real estate transaction can involve 20+ documents. With ZiggyDocs, send all of them without counting envelopes.",
              },
              {
                icon: "◫",
                title: "Templates for every form",
                desc: "Build templates for your listing agreements, buyer agreements, and standard disclosures. Send in seconds, not minutes.",
              },
              {
                icon: "🔔",
                title: "Auto-reminders",
                desc: "Stop chasing clients for signatures. ZiggyDocs sends automatic follow-ups so deals keep moving.",
              },
              {
                icon: "🛡",
                title: "Legally binding audit trail",
                desc: "Every signature includes a timestamp, IP address, and certificate of completion — protection for you and your clients.",
              },
              {
                icon: "💰",
                title: "Flat $19/mo — no per-transaction fees",
                desc: "DocuSign and others charge per envelope. ZiggyDocs charges a flat rate. Do 5 transactions or 50 — same price.",
              },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.75rem", flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.375rem" }}>{f.title}</div>
                  <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / story */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>"</div>
          <blockquote style={{ fontSize: "1.25rem", lineHeight: 1.7, color: "#d4d4d8", fontStyle: "italic", marginBottom: "1.5rem" }}>
            I was paying DocuSign $45/month and hitting the envelope limit every single month. With ZiggyDocs I switched to $19/mo and send as many documents as I need. The templates save me an hour a week.
          </blockquote>
          <div style={{ color: "#a1a1aa", fontSize: "0.9375rem" }}>— Real estate agent, Las Vegas NV</div>
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
          Close more deals. Pay less.
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", marginBottom: "2rem" }}>
          Start your free 14-day trial. No credit card required.
        </p>
        <a
          href="https://app.ziggydocs.com/signup"
          style={{ background: "#7c3aed", color: "#fff", padding: "1rem 2.5rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "1.0625rem", textDecoration: "none", display: "inline-block" }}
        >
          Start Free Trial →
        </a>
      </section>

      <Footer />
    </div>
  );
}
