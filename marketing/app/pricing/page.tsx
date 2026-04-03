import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing — ZiggyDocs $25/mo Flat",
  description:
    "ZiggyDocs is $25/mo. All features included. Unlimited documents. No per-user fees. 14-day free trial, no credit card required.",
  openGraph: {
    title: "Pricing — ZiggyDocs $25/mo Flat",
    description: "One plan. Everything included. $25/mo. Start free for 14 days.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const allFeatures = [
  "Unlimited documents",
  "Unlimited signers",
  "Unlimited templates",
  "Drag-and-drop field editor",
  "Mobile signing (no app needed)",
  "Auto-reminders",
  "Certificate of completion",
  "Full audit trail",
  "Secure cloud storage",
  "Multi-recipient sending",
  "Sequential signing order",
  "Document dashboard",
  "ESIGN & UETA compliant",
  "Email support",
];

const faqs = [
  {
    q: "How does the free trial work?",
    a: "Your 14-day free trial gives you full access to every ZiggyDocs feature — no restrictions. No credit card required to start. At the end of the trial, you can choose to subscribe or your account will automatically pause.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel your subscription any time from your account settings. No cancellation fees, no penalties, no awkward phone calls. Your data remains accessible for 30 days after cancellation.",
  },
  {
    q: "Are there really no envelope limits?",
    a: "None. Zero. Zip. $25/mo gives you truly unlimited documents — send as many contracts, agreements, and forms as you need. Unlike DocuSign's basic plan (10 envelopes/month), ZiggyDocs never caps you.",
  },
  {
    q: "How many team members can use ZiggyDocs?",
    a: "Currently ZiggyDocs is optimized for individual professionals and small teams. The $25/mo plan covers your account. Team/multi-seat plans are coming soon — join the waitlist from your dashboard.",
  },
  {
    q: "Are ZiggyDocs signatures legally valid?",
    a: "Yes. ZiggyDocs electronic signatures are legally binding under the US ESIGN Act, UETA, and EU eIDAS regulations. Every completed document includes a Certificate of Completion and tamper-evident audit trail.",
  },
  {
    q: "What happens to my documents if I cancel?",
    a: "Your documents remain accessible for 30 days after cancellation. We recommend downloading any important documents before that period ends. We never delete your data without notice.",
  },
  {
    q: "Do signers need a ZiggyDocs account?",
    a: "No. Recipients receive a link via email and can review and sign directly in their browser — no account, no download, no friction.",
  },
];

export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f0a0a" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "5rem 1.5rem 2rem", textAlign: "center", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
          Simple, honest pricing
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", lineHeight: 1.6 }}>
          One plan. Everything included. No surprises.
        </p>
      </section>

      {/* Pricing Card */}
      <section style={{ padding: "2rem 1.5rem 5rem", maxWidth: "560px", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            background: "#18181b",
            border: "1px solid rgba(124,58,237,0.5)",
            borderRadius: "1rem",
            padding: "3rem 2.5rem",
            boxShadow: "0 0 60px rgba(124,58,237,0.12)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "999px",
                padding: "0.25rem 0.875rem",
                fontSize: "0.8125rem",
                color: "#a78bfa",
                fontWeight: 600,
                marginBottom: "1.5rem",
              }}
            >
              ✦ Most popular (only option — because it&apos;s enough)
            </div>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>$25</span>
            <span style={{ color: "#a1a1aa", fontSize: "1.125rem" }}>/month</span>
          </div>
          <div style={{ color: "#a1a1aa", fontSize: "0.9375rem", marginBottom: "2rem" }}>
            Billed monthly · Cancel anytime
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {allFeatures.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", color: "#d4d4d8", fontSize: "0.9375rem", alignItems: "center" }}>
                <span style={{ color: "#7c3aed", fontSize: "1rem", flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="https://app.ziggydocs.com/signup"
            style={{
              display: "block",
              background: "#7c3aed",
              color: "#fff",
              padding: "1.125rem",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "1.0625rem",
              textDecoration: "none",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Start Free Trial →
          </a>
          <p style={{ color: "#71717a", fontSize: "0.8125rem", textAlign: "center" }}>
            14-day free trial · No credit card required
          </p>
        </div>

        {/* Bundle promo */}
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "0.75rem",
            padding: "1.5rem",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>🧰 Better together</div>
          <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", marginBottom: "0.75rem" }}>
            ZiggyDocs is part of the ZiggyTech Business Suite — a set of affordable tools built for small business owners.
          </p>
          <a href="https://ziggybusiness.com" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600, fontSize: "0.9375rem" }}>
            Explore the ZiggyTech suite → ziggybusiness.com
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid #27272a", background: "rgba(24,24,27,0.3)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>
            Frequently asked questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #27272a",
                  padding: "1.5rem 0",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem", color: "#fff" }}>
                  {faq.q}
                </div>
                <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
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
          Start your free trial today
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", marginBottom: "2rem" }}>
          14 days free. All features. No credit card needed.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://app.ziggydocs.com/signup"
            style={{ background: "#7c3aed", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 700, textDecoration: "none", display: "inline-block", fontSize: "1.0625rem" }}
          >
            Get Started Free →
          </a>
          <Link
            href="/features"
            style={{ border: "1px solid #27272a", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none", display: "inline-block", fontSize: "1.0625rem" }}
          >
            View All Features
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
