import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ZiggyDocs — E-Signatures & Document Management",
    template: "%s | ZiggyDocs",
  },
  description:
    "Send, sign, and manage documents in minutes. Unlimited e-signatures, templates, and client signing — at a fraction of DocuSign's price.",
  keywords: ["e-sign", "electronic signature", "document signing", "esignature", "docusign alternative"],
  authors: [{ name: "ZiggyTech Ventures" }],
  openGraph: {
    type: "website",
    siteName: "ZiggyDocs",
    title: "ZiggyDocs — E-Signatures & Document Management",
    description:
      "Send, sign, and manage documents in minutes. Unlimited e-signatures, templates, and client signing — at a fraction of DocuSign's price.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZiggyDocs &mdash; E-Sign Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZiggyDocs — E-Signatures & Document Management",
    description:
      "Send, sign, and manage documents in minutes. Unlimited e-signatures, templates, and client signing — at a fraction of DocuSign's price.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://ziggydocs.com"),

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
