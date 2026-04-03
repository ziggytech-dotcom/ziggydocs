"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        background: "rgba(15, 10, 10, 0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #27272a",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <img src="/ziggydocs-wordmark-v3.png" alt="ZiggyDocs" style={{ height: 32, width: "auto" }} />
        </a>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
          className="desktop-nav"
        >
          <Link
            href="/features"
            style={{ color: "#a1a1aa", textDecoration: "none", fontWeight: 500, fontSize: "0.9375rem" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a1a1aa")}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            style={{ color: "#a1a1aa", textDecoration: "none", fontWeight: 500, fontSize: "0.9375rem" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a1a1aa")}
          >
            Pricing
          </Link>
          <Link
            href="/vs/docusign"
            style={{ color: "#a1a1aa", textDecoration: "none", fontWeight: 500, fontSize: "0.9375rem" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#a1a1aa")}
          >
            Compare
          </Link>
          <a
            href="https://app.ziggydocs.com/signup"
            style={{
              background: "#7c3aed",
              color: "#fff",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "0.9375rem",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#6d28d9")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#7c3aed")}
          >
            Start Free Trial
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid #27272a",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Link href="/features" style={{ color: "#a1a1aa", textDecoration: "none", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/pricing" style={{ color: "#a1a1aa", textDecoration: "none", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/vs/docusign" style={{ color: "#a1a1aa", textDecoration: "none", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>Compare</Link>
          <a
            href="https://app.ziggydocs.com/signup"
            style={{
              background: "#7c3aed",
              color: "#fff",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
            onClick={() => setMenuOpen(false)}
          >
            Start Free Trial
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
