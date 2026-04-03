import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "E-Sign for Contractors — ZiggyDocs",
  description:
    "ZiggyDocs helps contractors get signed estimates, contracts, and change orders before work begins. $19/mo. Unlimited documents. No more disputes.",
  openGraph: {
    title: "E-Sign for Contractors — ZiggyDocs",
    description: "Get signed before you work. Estimates, contracts, change orders — all e-signed for $19/mo.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ContractorsPage() {
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
          🔨 ZiggyDocs for Contractors
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
          Never start a job without a{" "}
          <span style={{ color: "#7c3aed" }}>signed contract</span>
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem", maxWidth: "620px", margin: "0 auto 2rem" }}>
          Send estimates, contracts, and change orders for e-signature before you lift a tool. Protect yourself legally, get paid faster, and eliminate disputes. All for $19/mo.
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

      {/* Pain points */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>
            The problems every contractor knows
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "🤝", title: "Verbal agreements = disputes", desc: "Without a signed contract, everything is your word against theirs. Get it signed before day one." },
              { icon: "💸", title: "Scope creep without change orders", desc: "Clients add work and expect it free. Document every change with a signed change order." },
              { icon: "⏳", title: "Waiting for signatures slows you down", desc: "Chasing paperwork delays project starts. E-sign lets clients sign instantly from any device." },
              { icon: "📁", title: "Lost paper contracts", desc: "Paper contracts get lost, damaged, or disputed. ZiggyDocs stores every signed document securely in the cloud." },
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

      {/* Use cases */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Documents contractors send every week
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "📊", title: "Project Estimates", desc: "Send detailed estimates for client approval before any work begins. Get their signature, then schedule." },
              { icon: "📋", title: "Service Contracts", desc: "Full project contracts with scope, timeline, payment terms, and warranties — signed and stored." },
              { icon: "🔄", title: "Change Orders", desc: "Any scope change, approved in writing. Protect your margins and your reputation." },
              { icon: "💰", title: "Payment Schedules", desc: "Deposit requests, milestone payments, final invoices — get agreement in writing upfront." },
              { icon: "⚠️", title: "Lien Waivers", desc: "Send and collect lien waivers from subcontractors and suppliers as part of your close-out process." },
              { icon: "🏆", title: "Warranties & Guarantees", desc: "Document your workmanship warranty terms clearly and get client acknowledgment in writing." },
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

      {/* Features */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Built for contractors in the field
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              { icon: "📱", title: "Clients sign on their phone", desc: "Text or email a signing link. Clients sign right from their phone — no account, no download, no printer." },
              { icon: "◫", title: "Contract templates ready to go", desc: "Build your standard contract once and reuse it for every job. Customize the scope and send in 2 minutes." },
              { icon: "🔔", title: "Auto-reminders", desc: "If a client hasn't signed, ZiggyDocs nudges them automatically. You stay focused on the work." },
              { icon: "🛡", title: "Legally binding proof", desc: "Every signed document has a timestamp, IP address, and certificate. If there's ever a dispute, you're covered." },
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

      {/* Testimonial */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>"</div>
          <blockquote style={{ fontSize: "1.25rem", lineHeight: 1.7, color: "#d4d4d8", fontStyle: "italic", marginBottom: "1.5rem" }}>
            I used to print contracts, drive to clients, get them signed, and scan them. Now I send a link from my truck and have a signed contract before I get back to the shop. ZiggyDocs paid for itself on the first job.
          </blockquote>
          <div style={{ color: "#a1a1aa", fontSize: "0.9375rem" }}>— General contractor, Phoenix AZ</div>
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
          Protect your business. Get signed first.
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", marginBottom: "2rem" }}>
          14-day free trial. No credit card required.
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
