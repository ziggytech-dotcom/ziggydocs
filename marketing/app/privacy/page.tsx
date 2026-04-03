import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — ZiggyDocs",
  description: "ZiggyDocs Privacy Policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f0a0a" }}>
      <Navbar />
      <section style={{ padding: "5rem 1.5rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Privacy Policy</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "2rem", fontSize: "0.9375rem" }}>Last updated: March 28, 2026</p>
        <div style={{ color: "#d4d4d8", lineHeight: 1.8, fontSize: "1rem" }}>
          <p style={{ marginBottom: "1.5rem" }}>ZiggyDocs (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our e-signature platform.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Information We Collect</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>We collect information you provide directly: name, email address, and billing information. We also collect usage data, document metadata, and audit trail information required to provide our e-signature service.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>How We Use Your Information</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>We use your information to provide the ZiggyDocs service, process payments, send transactional emails, and maintain audit trails for legal compliance. We do not sell your personal information.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Document Security</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>All documents are encrypted at rest and in transit. Document content is never used for training AI models or shared with third parties except as required to deliver the service.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Contact</h2>
          <p style={{ color: "#a1a1aa" }}>Questions? Contact us at privacy@ziggydocs.com.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
