import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog — ZiggyDocs",
  description: "What's new in ZiggyDocs. Feature updates, improvements, and release notes.",
}

const ACCENT = "#7c3aed"

export default function ChangelogPage() {
  return (
    <>
            <style>{`@media(max-width:768px){.nav-links{display:none!important}}`}</style>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1f1f1f", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ textDecoration: "none", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>Ziggy<span style={{ color: ACCENT }}>Docs</span></a>
          <div className="nav-links" style={{ display: "flex", gap: 28 }}>
            {[["Features", "/features"], ["Pricing", "/#pricing"], ["Contact", "/contact"], ["Blog", "/blog"], ["Sign In", "https://app.ziggydocs.com/login"]].map(([l, h]) => (
              <a key={l} href={h} style={{ color: "#888", fontSize: 15, textDecoration: "none", fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <a href="https://app.ziggydocs.com/signup" style={{ background: ACCENT, color: "#fff", textDecoration: "none", padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
            Start Free Trial
          </a>
        </div>
      </nav>

      <section style={{ padding: "80px 24px 40px", textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px,5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16 }}>What's New</h1>
        <p style={{ fontSize: 17, color: "#777", lineHeight: 1.6 }}>
          New features, improvements, and fixes — straight from the team.
        </p>
      </section>

      <section style={{ maxWidth: 740, margin: "0 auto", padding: "40px 24px 100px" }}>
        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 2, background: "#1f1f1f" }} />

          {/* v1.0.0 */}
          <div style={{ position: "relative", marginBottom: 64 }}>
            <div style={{ position: "absolute", left: -27, top: 6, width: 14, height: 14, borderRadius: "50%", background: ACCENT, border: "2px solid #0a0a0a" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ background: `rgba(124,58,237,0.15)`, color: ACCENT, border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" }}>v1.0.0</span>
              <span style={{ fontSize: 14, color: "#555", fontWeight: 600 }}>April 2026</span>
              <span style={{ fontSize: 12, color: "#333", background: "#111", border: "1px solid #1f1f1f", borderRadius: 99, padding: "3px 10px" }}>Initial Launch</span>
            </div>
            <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: "28px 28px 24px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>🚀 ZiggyDocs is live</h3>
              <p style={{ fontSize: 14, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
                We've been building ZiggyDocs for months. Today it's open for everyone. Here's everything you get on day one:
              </p>
              <ul style={{ listStyle: "disc", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Unlimited document sending with no envelope caps"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Drag-and-drop field editor for signatures, initials, dates, and text"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Reusable document templates library"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Multi-recipient signing with configurable signing order"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Mobile-optimized signing experience (no app required)"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Automated signature reminders via email"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Legally binding audit trail with timestamp and IP logging"}</li>
              <li style={{ fontSize: 15, color: "#ccc", lineHeight: 1.7, paddingLeft: 4 }}>{"Custom branding on all sent documents"}</li>
              </ul>
            </div>
          </div>

          {/* Coming Soon */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: -27, top: 6, width: 14, height: 14, borderRadius: "50%", background: "#1f1f1f", border: "2px solid #1f1f1f" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ background: "rgba(255,149,0,0.1)", color: "#ff9500", border: "1px solid rgba(255,149,0,0.25)", borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em" }}>v1.1.0</span>
              <span style={{ fontSize: 14, color: "#555", fontWeight: 600 }}>Coming May 2026</span>
            </div>
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "24px 28px" }}>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
                We ship fast. More updates coming soon — follow us on 
                <a href="https://x.com/ziggybusiness" style={{ color: ACCENT, textDecoration: "none" }}>X</a> 
                or subscribe to our 
                <a href="/blog" style={{ color: ACCENT, textDecoration: "none" }}>blog</a> 
                for release announcements.
              </p>
            </div>
          </div>
        </div>
      </section>

            <footer style={{ background: "#050505", borderTop: "1px solid #111", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            {[["Home", "/"], ["Features", "/features"], ["Pricing", "/#pricing"], ["Contact", "/contact"], ["Changelog", "/changelog"], ["Blog", "/blog"]].map(([l, h]) => (
              <a key={l} href={h} style={{ color: "#555", fontSize: 14, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#333", marginBottom: 8 }}>
            Part of {" "}
            <a href="https://ziggybusiness.com" style={{ color: "#555", textDecoration: "none" }}>ZiggyTech Business Suite</a>
          </p>
          <p style={{ fontSize: 13, color: "#2a2a2a" }}>© 2026 ZiggyDocs. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
