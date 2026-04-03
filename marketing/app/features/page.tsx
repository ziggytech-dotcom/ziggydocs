import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Features — ZiggyDocs E-Sign Platform",
  description:
    "Explore all ZiggyDocs features: unlimited documents, drag-and-drop fields, mobile signing, auto-reminders, templates, audit trails, and more. All for $19/mo.",
  openGraph: {
    title: "Features — ZiggyDocs E-Sign Platform",
    description: "Everything you need to get documents signed fast. All features included at $19/mo.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const categories = [
  {
    name: "Document Creation",
    icon: "📄",
    features: [
      {
        icon: "◫",
        title: "Drag-and-Drop Field Editor",
        desc: "Place signature blocks, initials, dates, checkboxes, and text fields anywhere on your document with a simple drag-and-drop interface. No technical skills required.",
        bullets: ["Signature fields", "Initial fields", "Date fields", "Text input fields", "Checkbox fields"],
      },
      {
        icon: "◨",
        title: "Reusable Templates",
        desc: "Save any document as a template and reuse it instantly. Build your library of service agreements, NDAs, proposals, and onboarding forms.",
        bullets: ["Unlimited templates", "Pre-fill common fields", "Share templates with team", "Track which template sent"],
      },
      {
        icon: "✦",
        title: "Multi-Recipient Sending",
        desc: "Send to multiple signers in a specific order or all at once. Set signing order so each party signs in sequence.",
        bullets: ["Sequential signing order", "Parallel signing", "CC recipients", "Custom signer roles"],
      },
    ],
  },
  {
    name: "Signing Experience",
    icon: "✍️",
    features: [
      {
        icon: "📱",
        title: "Mobile Signing",
        desc: "Signers can review and sign on any device — smartphone, tablet, or desktop. No app download required. Just click the link.",
        bullets: ["Works on iOS & Android", "No app download", "Touch-optimized signing", "Email link delivery"],
      },
      {
        icon: "🔔",
        title: "Auto-Reminders",
        desc: "Never chase a signer again. ZiggyDocs automatically sends follow-up reminders on your schedule until the document is signed.",
        bullets: ["Configurable reminder schedule", "Custom reminder messages", "Stop reminders on signing", "Manual reminder option"],
      },
      {
        icon: "⚡",
        title: "Instant Notifications",
        desc: "Get notified the moment a signer opens the document, completes a field, or signs. Stay on top of every deal in real time.",
        bullets: ["Email notifications", "Opened alerts", "Signed alerts", "Completed alerts"],
      },
    ],
  },
  {
    name: "Management & Storage",
    icon: "🗂",
    features: [
      {
        icon: "∞",
        title: "Unlimited Documents",
        desc: "Send and receive as many documents as you need — no caps, no overage fees, no envelope limits. Just unlimited.",
        bullets: ["No envelope limits", "No monthly caps", "No overage charges", "Unlimited signers"],
      },
      {
        icon: "☁",
        title: "Secure Cloud Storage",
        desc: "Every signed document is stored securely in the cloud. Access them anytime, search by name or recipient, and download originals.",
        bullets: ["Permanent storage", "Full-text search", "Folder organization", "Bulk download"],
      },
      {
        icon: "📊",
        title: "Document Dashboard",
        desc: "See all your documents in one place — draft, sent, pending, and completed. Filter by status, date, or recipient.",
        bullets: ["Status at a glance", "Filter and search", "Recipient tracking", "Completion rate stats"],
      },
    ],
  },
  {
    name: "Security & Compliance",
    icon: "🛡",
    features: [
      {
        icon: "📋",
        title: "Certificate of Completion",
        desc: "Every completed document generates a Certificate of Completion with full signing details — legally binding proof of the transaction.",
        bullets: ["Signer identity verification", "Timestamp on every action", "IP address logging", "Downloadable PDF certificate"],
      },
      {
        icon: "🔍",
        title: "Full Audit Trail",
        desc: "ZiggyDocs captures every action taken on every document — when it was sent, opened, and signed — creating an unbreakable chain of custody.",
        bullets: ["Sent timestamp", "Opened timestamp", "Signed timestamp", "IP address capture"],
      },
      {
        icon: "⚖",
        title: "Legal Compliance",
        desc: "ZiggyDocs signatures are legally binding in the US and internationally, compliant with major electronic signature laws.",
        bullets: ["ESIGN Act compliant", "UETA compliant", "eIDAS compliant (EU)", "Tamper-evident seal"],
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f0a0a" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          padding: "5rem 1.5rem 3rem",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem", lineHeight: 1.1 }}>
          Every feature you need.{" "}
          <span style={{ color: "#7c3aed" }}>One flat price.</span>
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          ZiggyDocs includes every feature at $19/mo — no upsells, no add-ons, no hidden paywalls.
        </p>
        <a
          href="https://app.ziggydocs.com/signup"
          style={{
            background: "#7c3aed",
            color: "#fff",
            padding: "0.875rem 2rem",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Start Free Trial →
        </a>
      </section>

      {/* Feature Categories */}
      {categories.map((cat, ci) => (
        <section
          key={ci}
          style={{
            padding: "5rem 1.5rem",
            background: ci % 2 === 0 ? "#0f0a0a" : "rgba(24,24,27,0.5)",
            borderTop: "1px solid #27272a",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{cat.icon}</div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700 }}>{cat.name}</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {cat.features.map((f, fi) => (
                <div
                  key={fi}
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "0.75rem",
                    padding: "2rem",
                  }}
                >
                  {/* Screenshot placeholder */}
                  <div
                    style={{
                      background: "#0f0a0a",
                      border: "1px solid #27272a",
                      borderRadius: "0.5rem",
                      height: "120px",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}
                  >
                    {f.icon}
                  </div>

                  <h3 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.75rem" }}>{f.title}</h3>
                  <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>{f.desc}</p>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {f.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: "flex", gap: "0.5rem", color: "#a1a1aa", fontSize: "0.875rem" }}>
                        <span style={{ color: "#7c3aed" }}>✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

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
          Ready to get started?
        </h2>
        <p style={{ color: "#a1a1aa", fontSize: "1.125rem", marginBottom: "2rem" }}>
          All features. One price. 14-day free trial.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://app.ziggydocs.com/signup"
            style={{ background: "#7c3aed", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 700, textDecoration: "none", display: "inline-block" }}
          >
            Start Free Trial →
          </a>
          <Link
            href="/pricing"
            style={{ border: "1px solid #27272a", color: "#fff", padding: "0.875rem 2rem", borderRadius: "0.5rem", fontWeight: 600, textDecoration: "none", display: "inline-block" }}
          >
            View Pricing
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
