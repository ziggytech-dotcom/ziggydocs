import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZiggyDocs Blog — Tips, Guides & Insights",
  description: "Practical guides, how-to articles, and small business tips from the ZiggyDocs team. Learn how to documents & e-sign smarter.",
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "inherit" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1f1f1f", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto" }}>
        <a href="/" style={{ color: "#fff", fontWeight: 700, fontSize: "18px", textDecoration: "none" }}>ZiggyDocs</a>
        <a href="https://app.ziggydocs.com/signup" style={{ background: "#7c3aed", color: "#fff", padding: "8px 20px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>Start Free Trial</a>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#7c3aed22", border: "1px solid #7c3aed44", borderRadius: "100px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, color: "#7c3aed", marginBottom: "24px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Insights & Guides</div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
          The ZiggyDocs Blog
        </h1>
        <p style={{ fontSize: "18px", color: "#888", lineHeight: 1.6, margin: "0 0 40px" }}>
          Practical guides and how-to articles for small businesses. Topics covering documents & e-sign, team management, and building better workflows — coming soon.
        </p>

        {/* Coming Soon Card */}
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "48px 40px", display: "inline-block", maxWidth: "500px", width: "100%" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>✍️</div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>Articles coming soon</h2>
          <p style={{ fontSize: "15px", color: "#666", margin: "0 0 28px", lineHeight: 1.6 }}>
            We're building out our library of guides for small business owners. Check back soon — or start your free trial while you wait.
          </p>
          <a
            href="https://app.ziggydocs.com/signup"
            style={{ display: "inline-block", background: "#7c3aed", color: "#fff", padding: "12px 28px", borderRadius: "8px", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}
          >
            Start Free Trial — 14 days free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1f1f1f", padding: "32px 24px", textAlign: "center", color: "#444", fontSize: "13px" }}>
        <p>© 2026 ZiggyDocs · <a href="/" style={{ color: "#666", textDecoration: "none" }}>Home</a> · <a href="/pricing" style={{ color: "#666", textDecoration: "none" }}>Pricing</a> · <a href="/privacy" style={{ color: "#666", textDecoration: "none" }}>Privacy</a> · <a href="/terms" style={{ color: "#666", textDecoration: "none" }}>Terms</a></p>
        <p style={{ marginTop: "8px" }}>Part of <a href="https://ziggybusiness.com" style={{ color: "#7c3aed", textDecoration: "none" }}>ZiggyTech Business Suite</a></p>
      </footer>
    </main>
  );
}
