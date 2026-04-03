import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy — ZiggyDocs",
  description: "ZiggyDocs Cookie Policy. Learn how we use cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f0a0a" }}>
      <Navbar />
      <section style={{ padding: "5rem 1.5rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Cookie Policy</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "2rem", fontSize: "0.9375rem" }}>Last updated: March 28, 2026</p>
        <div style={{ color: "#d4d4d8", lineHeight: 1.8, fontSize: "1rem" }}>
          <p style={{ marginBottom: "1.5rem" }}>ZiggyDocs uses cookies and similar technologies to provide, improve, and protect our service.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Essential Cookies</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>These cookies are required for the ZiggyDocs platform to function. They include session cookies for authentication and security cookies to protect your account.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Analytics Cookies</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>We use privacy-respecting analytics to understand how visitors use our website. This helps us improve the product. Analytics data is aggregated and not linked to individual users.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Your Choices</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>You can control cookies through your browser settings. Disabling essential cookies may affect platform functionality.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Contact</h2>
          <p style={{ color: "#a1a1aa" }}>Questions? Contact us at privacy@ziggydocs.com.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
