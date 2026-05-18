import React from "react";
import { useNavigate } from "react-router-dom";

interface FooterProps {
  setPage?: (page: string) => void;
}

export function Footer({ setPage = () => {} }: FooterProps): React.JSX.Element {
  const navigate = useNavigate();

  const linkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "left",
    padding: 0,
    fontFamily: "'DM Sans',sans-serif",
  };

  const goToPage = (page: string) => {
    setPage(page);
    const routeMap: Record<string, string> = {
      Home: "/",
      Features: "/features",
      "How It Works": "/how-it-works",
      "About Us": "/about",
      Pricing: "/pricing",
      Contact: "/contact",
      "Get Started": "/signup",
    };

    navigate(routeMap[page] ?? "/");
  };

  return (
    <footer
      style={{
        background: "linear-gradient(to bottom,#0B3D2E,#020617)",
        borderTop: "1px solid rgba(74,222,128,0.15)",
        padding: "60px 24px 30px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 40,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "#22C55E",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 18,
                    lineHeight: 1,
                  }}
                >
                  YPF
                </div>
                <div style={{ color: "#4ADE80", fontSize: 10, marginTop: 2 }}>
                  Yield Prediction & Farming
                </div>
              </div>
            </div>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 240,
              }}
            >
              Empowering small-scale farmers with data-driven insights for
              better yields and sustainable agriculture.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["T", "L", "F", "I"].map((s) => (
                <div
                  key={s}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{ color: "#4ADE80", fontSize: 12, fontWeight: 700 }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              Quick Links
            </p>
            {[
              "Home",
              "Features",
              "How It Works",
              "About Us",
              "Pricing",
              "Contact",
            ].map((l) => (
              <button
                key={l}
                type="button"
                style={linkStyle}
                onClick={() => goToPage(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              Features
            </p>
            {[
              "Yield Tracking",
              "Weather Monitoring",
              "Predictive Analytics",
              "Smart Recommendations",
              "Crop Management",
              "Field Mapping",
            ].map((l) => (
              <button
                key={l}
                type="button"
                style={linkStyle}
                onClick={() => goToPage("Features")}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              Contact
            </p>
            {[
              ["📍", "123 Farm Road, Nairobi, Kenya"],
              ["📞", "+254 700 123 456"],
              ["✉️", "hello@ypf-farming.com"],
              ["🕐", "Mon–Fri, 8am–6pm EAT"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span
                  style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.5 }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div>
            <p
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 8,
              }}
            >
              Newsletter
            </p>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Get weekly farming tips and platform updates.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(74,222,128,0.2)",
                color: "white",
                fontSize: 13,
                outline: "none",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 10,
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              style={{
                width: "100%",
                padding: "10px",
                background: "#22C55E",
                border: "none",
                borderRadius: 8,
                color: "white",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Subscribe →
            </button>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p style={{ color: "#6B7280", fontSize: 13, margin: 0 }}>
            © 2026 YPF – Yield Prediction & Farming. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (l) => (
                <button
                  key={l}
                  type="button"
                  style={{ ...linkStyle, fontSize: 13 }}
                >
                  {l}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
