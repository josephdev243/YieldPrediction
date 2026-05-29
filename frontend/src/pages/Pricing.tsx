import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setPage?: (page: string) => void;
}

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    tag: null,
    color: "#9CA3AF",
    desc: "Perfect for getting started and exploring the platform with a single field.",
    features: [
      "1 field (up to 2 acres)",
      "Basic yield tracking",
      "3-day weather forecast",
      "Manual data entry",
      "Community forum access",
      "Mobile app (Android)",
    ],
    missing: [
      "Predictive analytics",
      "Smart recommendations",
      "Data export",
      "Team members",
      "API access",
    ],
    cta: "Get Started Free",
    route: "signup",
  },
  {
    name: "Pro",
    price: { monthly: 1200, yearly: 960 },
    tag: "Most Popular",
    color: "#22C55E",
    desc: "For serious farmers ready to use data to consistently improve their yields season after season.",
    features: [
      "Up to 20 fields (unlimited area)",
      "Advanced yield tracking & history",
      "14-day weather forecast",
      "AI yield predictions",
      "Smart recommendations",
      "Data export (CSV, PDF)",
      "Up to 5 team members",
      "Priority email support",
      "Offline mode",
    ],
    missing: ["API access", "Custom integrations", "Dedicated account manager"],
    cta: "Start Pro Trial",
    route: "signup",
  },
  {
    name: "Enterprise",
    price: { monthly: 4500, yearly: 3600 },
    tag: "Best Value",
    color: "#4ADE80",
    desc: "For cooperatives, agribusinesses and NGOs managing multiple farms and field officers.",
    features: [
      "Unlimited fields & farmers",
      "Everything in Pro",
      "Full API access",
      "Custom integrations (ERP, MIS)",
      "Unlimited team members",
      "Dedicated account manager",
      "Custom AI model training",
      "SLA guarantee (99.9% uptime)",
      "Quarterly agronomy reviews",
      "White-label option",
      "Bulk data import",
      "Advanced analytics dashboard",
    ],
    missing: [],
    cta: "Contact Sales",
    route: "contact",
  },
];

const testimonials = [
  {
    name: "Mary Wangari",
    location: "Nakuru, Kenya",
    plan: "Pro",
    text: "YPF helped me increase my maize yield by 32% in one season. The fertilizer recommendations alone saved me KES 8,000.",
    emoji: "👩🏾‍🌾",
  },
  {
    name: "Emmanuel Ssali",
    location: "Kampala, Uganda",
    plan: "Free",
    text: "I started on the free plan and could see the difference in how I record data. The weather alerts are incredibly useful.",
    emoji: "👨🏿‍🌾",
  },
  {
    name: "Fatuma Hassan",
    location: "Mwanza, Tanzania",
    plan: "Pro",
    text: "The yield prediction told me I was heading for a poor harvest 6 weeks before it happened. I had time to fix the irrigation problem.",
    emoji: "👩🏽‍🌾",
  },
];

const addons = [
  {
    name: "Soil Testing Kit",
    price: "KES 3,500",
    desc: "Professional soil analysis kit shipped to your location",
    icon: "🧪",
  },
  {
    name: "Agronomy Consultation",
    price: "KES 2,000/hr",
    desc: "One-on-one session with our certified agronomists",
    icon: "👨🏾‍🔬",
  },
  {
    name: "Drone Field Survey",
    price: "KES 8,000",
    desc: "Aerial field mapping for precise zone delineation",
    icon: "🚁",
  },
  {
    name: "Training Workshop",
    price: "KES 1,500",
    desc: "In-person 4-hour YPF platform training for your team",
    icon: "📖",
  },
];

export function Pricing({ setPage = () => {} }: Props) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    if (route === "signup") {
      navigate("/signup");
    } else if (route === "contact") {
      navigate("/contact");
    }
    // Also call setPage for backwards compatibility
    setPage(route === "signup" ? "Get Started" : "Contact");
  };

  const fmt = (n: number) => (n === 0 ? "Free" : `KES ${n.toLocaleString()}`);

  return (
    <div style={{ background: "#020617" }}>
      {/* Hero */}
      <section
        style={{
          background:
            "linear-gradient(135deg, rgba(11, 61, 46, 0.8), rgba(20, 83, 45, 0.8)), url('/images/farm.jpg') center/cover",
          padding: "80px 24px 100px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 70%, rgba(74,222,128,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 50,
              padding: "6px 18px",
              marginBottom: 24,
            }}
          >
            <span>💰</span>
            <span style={{ color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>
              Simple, Transparent Pricing
            </span>
          </div>
          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px,5vw,56px)",
              lineHeight: 1.1,
              margin: "0 0 20px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Invest in Your Farm's
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#4ADE80,#22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Future
            </span>
          </h1>
          <p
            style={{
              color: "#D1D5DB",
              fontSize: 17,
              lineHeight: 1.75,
              marginBottom: 36,
            }}
          >
            Start free. Upgrade only when YPF proves its value on your farm. No
            credit card required.
          </p>
          {/* Toggle */}
          <div
            style={{
              display: "inline-flex",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 50,
              padding: 4,
              gap: 4,
            }}
          >
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 50,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "all 0.2s",
                  background: billing === b ? "#22C55E" : "transparent",
                  color: billing === b ? "white" : "#9CA3AF",
                }}
              >
                {b === "monthly" ? "Monthly" : "Yearly"}{" "}
                {b === "yearly" && (
                  <span
                    style={{
                      background: "#4ADE80",
                      color: "#0B3D2E",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      marginLeft: 4,
                    }}
                  >
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none" style={{ display: "block" }}>
            <path d="M0 50L1440 0V50H0Z" fill="#020617" />
          </svg>
        </div>
      </section>

      {/* Plans */}
      <section
        style={{ padding: "60px 24px 80px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background:
                  plan.name === "Pro"
                    ? "linear-gradient(145deg,rgba(34,197,94,0.12),rgba(22,101,52,0.08))"
                    : "rgba(255,255,255,0.03)",
                border:
                  plan.name === "Pro"
                    ? "2px solid rgba(74,222,128,0.5)"
                    : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 32,
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {plan.tag && (
                <div
                  style={{
                    position: "absolute",
                    top: -14,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#22C55E",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 16px",
                    borderRadius: 50,
                    whiteSpace: "nowrap",
                  }}
                >
                  {plan.tag}
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    color: plan.color,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    margin: "0 0 10px",
                  }}
                >
                  {plan.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: 40,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {fmt(plan.price[billing])}
                  </span>
                  {plan.price[billing] > 0 && (
                    <span style={{ color: "#9CA3AF", fontSize: 14 }}>
                      /month
                    </span>
                  )}
                </div>
                {billing === "yearly" && plan.price.yearly > 0 && (
                  <div
                    style={{ color: "#4ADE80", fontSize: 12, marginBottom: 10 }}
                  >
                    Billed annually — save KES{" "}
                    {(
                      (plan.price.monthly - plan.price.yearly) *
                      12
                    ).toLocaleString()}
                    /yr
                  </div>
                )}
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: 14,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {plan.desc}
                </p>
              </div>
              <div style={{ flex: 1, marginBottom: 28 }}>
                <p
                  style={{
                    color: "#D1D5DB",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}
                >
                  What's included:
                </p>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        color: "#D1D5DB",
                        fontSize: 14,
                      }}
                    >
                      <span
                        style={{
                          color: "#22C55E",
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        color: "#4B5563",
                        fontSize: 14,
                      }}
                    >
                      <span style={{ flexShrink: 0, marginTop: 1 }}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleNavigation(plan.route)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "all 0.2s",
                  background:
                    plan.name === "Pro" ? "#22C55E" : "rgba(255,255,255,0.08)",
                  border:
                    plan.name === "Pro"
                      ? "none"
                      : "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              >
                {plan.cta} →
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div style={{ marginTop: 80 }}>
          <h2
            style={{
              textAlign: "center",
              fontWeight: 800,
              fontSize: "clamp(24px,3vw,34px)",
              margin: "0 0 12px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Add-On Services
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#9CA3AF",
              fontSize: 16,
              marginBottom: 40,
            }}
          >
            Enhance your YPF experience with expert services
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
            }}
          >
            {addons.map((a) => (
              <div
                key={a.name}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{a.icon}</div>
                <h4
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 16,
                    margin: "0 0 8px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {a.name}
                </h4>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    lineHeight: 1.6,
                    margin: "0 0 14px",
                  }}
                >
                  {a.desc}
                </p>
                <div
                  style={{ color: "#4ADE80", fontWeight: 700, fontSize: 15 }}
                >
                  {a.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: "#0B3D2E", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontWeight: 800,
              fontSize: "clamp(24px,3vw,34px)",
              margin: "0 0 48px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            What Farmers Are Saying
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(74,222,128,0.12)",
                  borderRadius: 16,
                  padding: 28,
                }}
              >
                <div
                  style={{ color: "#4ADE80", fontSize: 22, marginBottom: 14 }}
                >
                  ★★★★★
                </div>
                <p
                  style={{
                    color: "#D1D5DB",
                    fontSize: 15,
                    lineHeight: 1.75,
                    margin: "0 0 20px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#22C55E,#14532D)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {t.emoji}
                  </div>
                  <div>
                    <div
                      style={{ color: "white", fontWeight: 700, fontSize: 14 }}
                    >
                      {t.name}
                    </div>
                    <div style={{ color: "#9CA3AF", fontSize: 12 }}>
                      {t.location} · {t.plan} Plan
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Guarantee */}
      <section style={{ background: "#F0FDF4", padding: "80px 24px" }}>
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }}
        >
          <div>
            <h2
              style={{
                color: "#111827",
                fontWeight: 800,
                fontSize: 28,
                margin: "0 0 28px",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Pricing FAQs
            </h2>
            {[
              {
                q: "Can I upgrade or downgrade at any time?",
                a: "Yes. You can change your plan at any time. Upgrades take effect immediately; downgrades at next billing cycle.",
              },
              {
                q: "Do you offer discounts for NGOs?",
                a: "Yes. We offer 50% discounts for registered NGOs and government agricultural departments. Contact us to apply.",
              },
              {
                q: "Is payment available via M-PESA?",
                a: "Absolutely. We accept M-PESA, card payments, and bank transfers in KES, UGX, and TZS.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "You can export all your data before cancellation. We retain it for 90 days, then permanently delete it on request.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid rgba(34,197,94,0.15)",
                  paddingBottom: 18,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 8,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {faq.q}
                </div>
                <div
                  style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.7 }}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: "linear-gradient(135deg,#14532D,#166534)",
                borderRadius: 20,
                padding: 32,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
              <h3
                style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: 22,
                  margin: "0 0 12px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                30-Day Money-Back Guarantee
              </h3>
              <p
                style={{
                  color: "#86EFAC",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                }}
              >
                If YPF doesn't improve your farm management within 30 days,
                we'll refund 100% of your payment — no questions asked.
              </p>
              <button
                onClick={() => handleNavigation("signup")}
                style={{
                  background: "white",
                  border: "none",
                  color: "#14532D",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Claim Your Guarantee →
              </button>
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <h4
                style={{
                  color: "#111827",
                  fontWeight: 700,
                  fontSize: 17,
                  margin: "0 0 8px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Need a custom quote?
              </h4>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 0 16px",
                }}
              >
                Managing a cooperative with 100+ farmers? Let's build a plan
                that works for your scale.
              </p>
              <button
                onClick={() => handleNavigation("contact")}
                style={{
                  background: "#22C55E",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Contact Sales →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
