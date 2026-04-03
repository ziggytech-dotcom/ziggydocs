import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — ZiggyDocs",
  description: "ZiggyDocs Terms of Service. Your rights and responsibilities when using the ZiggyDocs e-signature platform.",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0f0a0a" }}>
      <Navbar />
      <section style={{ padding: "5rem 1.5rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Terms of Service</h1>
        <p style={{ color: "#a1a1aa", marginBottom: "2rem", fontSize: "0.9375rem" }}>Last updated: March 28, 2026</p>
        <div style={{ color: "#d4d4d8", lineHeight: 1.8, fontSize: "1rem" }}>
          <p style={{ marginBottom: "1.5rem" }}>By using ZiggyDocs, you agree to these Terms of Service. Please read them carefully. ZiggyDocs is provided by ZiggyTech Ventures LLC.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Service Description</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>ZiggyDocs provides electronic signature and document management services. Your subscription gives you access to all platform features for the duration of your active subscription period.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Acceptable Use</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>You may use ZiggyDocs only for lawful purposes. You may not use the platform to send fraudulent documents, impersonate others, or violate any applicable laws or regulations.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Billing & Cancellation</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>Subscriptions are billed monthly. You may cancel at any time from your account settings. No refunds are provided for partial months. Upon cancellation, your account will remain active until the end of the current billing period.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Limitation of Liability</h2>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>ZiggyDocs is provided &quot;as is&quot;. ZiggyTech Ventures LLC is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
          <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "2rem", color: "#fff" }}>Contact</h2>
          <p style={{ color: "#a1a1aa" }}>Questions? Contact us at legal@ziggydocs.com.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
