import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #27272a",
        background: "#0f0a0a",
        padding: "3rem 1.5rem",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "0.75rem" }}>
              <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                <img src="/ziggydocs-wordmark-v3.png" alt="ZiggyDocs" style={{ height: 32, width: "auto" }} />
              </a>
            </div>
            <p style={{ color: "#a1a1aa", fontSize: "0.875rem", lineHeight: "1.6", maxWidth: "220px" }}>
              Get documents signed in minutes. No envelope limits. No per-user fees.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem", fontSize: "0.875rem" }}>Product</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link href="/features" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Features</Link>
              <Link href="/pricing" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Pricing</Link>
              <a href="https://app.ziggydocs.com/signup" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Start Free Trial</a>
            </div>
          </div>

          {/* Compare */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem", fontSize: "0.875rem" }}>Compare</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link href="/vs/docusign" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>vs DocuSign</Link>
              <Link href="/vs/hellosign" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>vs Dropbox Sign</Link>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem", fontSize: "0.875rem" }}>Industries</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link href="/real-estate" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Real Estate</Link>
              <Link href="/contractors" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Contractors</Link>
              <Link href="/agencies" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Agencies</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem", fontSize: "0.875rem" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link href="/privacy" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Terms of Service</Link>
              <Link href="/cookies" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "0.875rem" }}>Cookie Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #27272a",
            paddingTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#a1a1aa", fontSize: "0.8125rem" }}>
            © {new Date().getFullYear()} ZiggyDocs. All rights reserved.
          </p>
          <p style={{ color: "#71717a", fontSize: "0.8125rem" }}>
            Part of the{" "}
            <a
              href="https://ziggybusiness.com"
              style={{ color: "#7c3aed", textDecoration: "none" }}
            >
              ZiggyTech Business Suite →
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
