import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "E-Sign for Agencies — ZiggyDocs",
  description:
    "ZiggyDocs helps agencies get client contracts, SOWs, and NDAs signed fast. $19/mo. Unlimited documents. Professional, branded signing experience.",
  openGraph: {
    title: "E-Sign for Agencies — ZiggyDocs",
    description: "Get client contracts, SOWs, and NDAs signed in minutes. ZiggyDocs for agencies — $19/mo.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function AgenciesPage() {
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
          🏢 ZiggyDocs for Agencies
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
          Get client contracts signed{" "}
          <span style={{ color: "#7c3aed" }}>before the kickoff call</span>
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem", maxWidth: "620px", margin: "0 auto 2rem" }}>
          Stop chasing clients for signatures on SOWs, NDAs, and retainer agreements. ZiggyDocs makes it fast, professional, and legally binding — at a price that doesn&apos;t hurt.
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
            Every document agencies send
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "📋", title: "Statements of Work (SOWs)", desc: "Send detailed project SOWs with scope, deliverables, timelines, and fees. Get signed before any work starts." },
              { icon: "🤐", title: "NDAs", desc: "Send mutual or one-way NDAs in seconds. Build a template once, customize per client, send instantly." },
              { icon: "🔄", title: "Retainer Agreements", desc: "Lock in monthly retainers with a signed agreement that clearly defines scope, hours, and terms." },
              { icon: "📝", title: "Proposals", desc: "Turn your winning proposals into signable documents. Get approval and agreement in one step." },
              { icon: "🔧", title: "Change Orders", desc: "Client wants to expand scope? Get written approval before you add a single hour to the project." },
              { icon: "✅", title: "Project Approvals", desc: "Get client sign-off on deliverables, designs, and content before you publish or hand off." },
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

      {/* Why ZiggyDocs */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Why agencies choose ZiggyDocs
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              {
                icon: "∞",
                title: "Unlimited documents",
                desc: "Run 10 clients? 50 clients? Send as many contracts, SOWs, and change orders as you need — no per-envelope charges.",
              },
              {
                icon: "◫",
                title: "Client-ready templates",
                desc: "Build your master SOW, NDA, and retainer templates once. Send them in seconds, personalized per client.",
              },
              {
                icon: "🔔",
                title: "Auto-reminders",
                desc: "Clients get busy. ZiggyDocs sends automatic follow-up reminders so you don't have to awkwardly chase them.",
              },
              {
                icon: "🛡",
                title: "Legally binding with audit trail",
                desc: "Every signature is timestamped with IP address and identity details. If a client disputes scope, you have proof.",
              },
              {
                icon: "💰",
                title: "$19/mo flat",
                desc: "No per-seat fees. No per-document fees. One flat monthly price covers your entire agency.",
              },
              {
                icon: "⚡",
                title: "Fast client experience",
                desc: "Clients receive an email, click the link, and sign in their browser. No account needed. No friction.",
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

      {/* The workflow */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, marginBottom: "2.5rem", textAlign: "center" }}>
            Your new client onboarding workflow
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { step: "1", title: "New client signs NDA", desc: "First call done? Send the NDA immediately. They sign on their phone while you're still thinking about what you discussed." },
              { step: "2", title: "Send the proposal + SOW", desc: "Win the deal? Send your proposal and SOW for signature in the same email. One document, one click." },
              { step: "3", title: "Collect the deposit", desc: "Combine your deposit invoice with the contract. Get the signature and payment commitment simultaneously." },
              { step: "4", title: "Kick off the project", desc: "You start work with a signed contract, a clear scope, and a paper trail. No surprises." },
              { step: "5", title: "Change orders as needed", desc: "Any scope addition? Send a change order before you do the work. Always covered." },
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

      {/* Testimonial */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>"</div>
          <blockquote style={{ fontSize: "1.25rem", lineHeight: 1.7, color: "#d4d4d8", fontStyle: "italic", marginBottom: "1.5rem" }}>
            We run 30+ active clients and were spending $120/mo on DocuSign to cover the envelopes. ZiggyDocs cut that to $19/mo with zero limits. The templates alone save us 2 hours every week.
          </blockquote>
          <div style={{ color: "#a1a1aa", fontSize: "0.9375rem" }}>— Digital marketing agency owner, Austin TX</div>
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
          Run your agency like a pro.
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", marginBottom: "2rem" }}>
          Start your 14-day free trial. No credit card required.
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
