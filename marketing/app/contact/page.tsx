import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — ZiggyDocs",
  description: "Get in touch with the ZiggyDocs team. Sales, support, billing — we're here to help.",
}

const ACCENT = "#7c3aed"

export default function ContactPage() {
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

      <section style={{ padding: "80px 24px 40px", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(36px,5vw,52px)", fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16 }}>Get in touch</h1>
        <p style={{ fontSize: 18, color: "#777", lineHeight: 1.6 }}>
          We're a small team that actually reads every message. Average reply time: under 4 hours.
        </p>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
        {/* Contact Cards */}
        {[
          { icon: "💬", label: "General", email: "hello@ziggybusiness.com", desc: "Sales questions, demos, partnerships" },
          { icon: "🛠️", label: "Support", email: "support@ziggybusiness.com", desc: "Technical issues, account help, billing" },
        ].map((c) => (
          <div key={c.label} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 16, padding: "28px 24px" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{c.label}</h3>
            <a href={`mailto:${c.email}`} style={{ color: ACCENT, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>{c.email}</a>
            <p style={{ fontSize: 13, color: "#555", marginTop: 6 }}>{c.desc}</p>
          </div>
        ))}
      </section>

      <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 100px" }}>
        <div style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 20, padding: "40px 36px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Send us a message</h2>
          <form action="/api/contact" method="POST" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: "#777", fontWeight: 600, display: "block", marginBottom: 6 }}>Name</label>
                <input name="name" required placeholder="Your name"
                  style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 15, outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#777", fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
                <input name="email" type="email" required placeholder="your@email.com"
                  style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 15, outline: "none" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#777", fontWeight: 600, display: "block", marginBottom: 6 }}>Subject</label>
              <select name="subject" style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 15, outline: "none" }}>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="Billing">Billing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#777", fontWeight: 600, display: "block", marginBottom: 6 }}>Message</label>
              <textarea name="message" required rows={5} placeholder="Tell us how we can help..."
                style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 15, outline: "none", resize: "vertical" }} />
            </div>
            <button type="submit" style={{
              background: ACCENT, color: "#fff", border: "none", borderRadius: 10,
              padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>
              Send Message →
            </button>
          </form>
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
