import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setPage?: (page: string) => void;
}

const steps = [
  {
    number: "01",
    icon: "📝",
    title: "Create Your Account",
    desc: "Sign up in minutes with your phone number or email. No technical skills required — we guide you through every step of the setup process.",
    details: [
      "Fill in basic farm information",
      "Choose your primary crop types",
      "Set your farm location via GPS",
      "Select your subscription plan",
    ],
    image: "🏠",
  },
  {
    number: "02",
    icon: "🗺️",
    title: "Map Your Fields",
    desc: "Use our simple GPS mapping tool to draw your field boundaries. Identify different zones and assign crops to each field on your farm.",
    details: [
      "Draw field boundaries on map",
      "Assign crops per field",
      "Record soil type & conditions",
      "Set irrigation method per zone",
    ],
    image: "🗺️",
  },
  {
    number: "03",
    icon: "📥",
    title: "Input Your Farm Data",
    desc: "Record your planting dates, inputs used (fertilizers, water, pesticides) and any observations. The more data you enter, the smarter the system gets.",
    details: [
      "Log planting & harvest dates",
      "Record fertilizer quantities",
      "Track irrigation usage",
      "Note pest or disease incidents",
    ],
    image: "📊",
  },
  {
    number: "04",
    icon: "🤖",
    title: "Get AI-Powered Insights",
    desc: "Our machine learning engine analyzes your data alongside weather patterns and regional benchmarks to generate predictions and alerts.",
    details: [
      "Yield forecast for current season",
      "Risk alerts before they happen",
      "Weather-based action prompts",
      "Peer benchmarking reports",
    ],
    image: "🤖",
  },
  {
    number: "05",
    icon: "📋",
    title: "Follow Recommendations",
    desc: "Receive clear, actionable recommendations tailored to your specific crop, soil and climate conditions. No agricultural degree needed.",
    details: [
      "Step-by-step action plans",
      "Optimal fertilizer schedules",
      "Best harvest timing advice",
      "Cost-saving suggestions",
    ],
    image: "💡",
  },
  {
    number: "06",
    icon: "📈",
    title: "Track & Improve",
    desc: "Record your actual yields at harvest and compare against predictions. Each season your recommendations become more accurate and personalized.",
    details: [
      "Log actual harvest yields",
      "Compare prediction vs actual",
      "View improvement trends",
      "Share reports with advisors",
    ],
    image: "📈",
  },
];

const faqs = [
  {
    q: "Do I need internet access to use YPF?",
    a: "YPF works online and has a limited offline mode for basic data entry. Data syncs automatically when you reconnect.",
  },
  {
    q: "What crops does YPF support?",
    a: "YPF supports over 120 crop types including maize, beans, wheat, rice, vegetables, fruits and cash crops common in East Africa.",
  },
  {
    q: "Is my farm data private and secure?",
    a: "Yes. All data is encrypted and stored securely. We never sell your farm data to third parties. You own your data.",
  },
  {
    q: "How accurate are the yield predictions?",
    a: "Our predictions have an average accuracy of 87% within 2 weeks of harvest. Accuracy improves with each season of data.",
  },
  {
    q: "Can I use YPF on a basic smartphone?",
    a: "Yes. YPF is optimized to run on Android phones with at least 1GB RAM. iOS is also supported.",
  },
  {
    q: "What languages does the app support?",
    a: "Currently English and Swahili. We are adding more local languages including Kikuyu, Luo and Amharic.",
  },
];

export function HowItWorks({ setPage = () => {} }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    if (page === "Get Started") {
      navigate("/signup");
    } else if (page === "Contact") {
      navigate("/contact");
    }
    setPage(page);
  };

  const handleWatchDemo = () => {
    // You can replace this with a YouTube modal or actual video player
    window.open("https://www.youtube.com/watch?v=demo", "_blank");
  };

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
              "radial-gradient(circle at 30% 60%, rgba(74,222,128,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 720,
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
            <span>⚙️</span>
            <span style={{ color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>
              How It Works
            </span>
          </div>
          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px,5vw,58px)",
              lineHeight: 1.1,
              margin: "0 0 20px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            From Sign-Up to
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#4ADE80,#22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Better Harvests
            </span>
          </h1>
          <p
            style={{
              color: "#D1D5DB",
              fontSize: 18,
              lineHeight: 1.75,
              margin: "0 0 36px",
            }}
          >
            Getting started with YPF is simple. Follow these six steps and start
            making smarter farming decisions within minutes.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handleNavigation("Get Started")}
              style={{
                background: "#22C55E",
                border: "none",
                color: "white",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Get Started Free →
            </button>
            <button
              onClick={handleWatchDemo}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              ▶ Watch Video Demo
            </button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none" style={{ display: "block" }}>
            <path d="M0 50L1440 0V50H0Z" fill="#020617" />
          </svg>
        </div>
      </section>

      {/* Step Navigator */}
      <section
        style={{ padding: "64px 24px", maxWidth: 1280, margin: "0 auto" }}
      >
        {/* Step tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 56,
          }}
        >
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 50,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 13,
                fontWeight: 600,
                background:
                  activeStep === i ? "#22C55E" : "rgba(255,255,255,0.05)",
                border:
                  activeStep === i ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: activeStep === i ? "white" : "#9CA3AF",
              }}
            >
              <span
                style={{
                  background:
                    activeStep === i
                      ? "rgba(255,255,255,0.25)"
                      : "rgba(74,222,128,0.15)",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                }}
              >
                {s.number}
              </span>
              {s.title}
            </button>
          ))}
        </div>

        {/* Active Step Detail */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(74,222,128,0.12)",
            borderRadius: 20,
            padding: "48px",
            marginBottom: 80,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(135deg,#22C55E,#166534)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                {steps[activeStep].icon}
              </div>
              <div>
                <div
                  style={{
                    color: "#4ADE80",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Step {steps[activeStep].number}
                </div>
                <h2
                  style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: 28,
                    margin: 0,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {steps[activeStep].title}
                </h2>
              </div>
            </div>
            <p
              style={{
                color: "#D1D5DB",
                fontSize: 16,
                lineHeight: 1.8,
                marginBottom: 28,
              }}
            >
              {steps[activeStep].desc}
            </p>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {steps[activeStep].details.map((d) => (
                <li
                  key={d}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#D1D5DB",
                    fontSize: 15,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.2)",
                      border: "1px solid rgba(34,197,94,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#4ADE80",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {d}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                  }}
                >
                  ← Previous
                </button>
              )}
              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  style={{
                    background: "#22C55E",
                    border: "none",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("Get Started")}
                  style={{
                    background: "#22C55E",
                    border: "none",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Get Started Now →
                </button>
              )}
            </div>
          </div>
          {/* Visual */}
          <div
            style={{
              background: "linear-gradient(135deg,#0B3D2E,#14532D)",
              borderRadius: 16,
              padding: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 320,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at center, rgba(74,222,128,0.1) 0%, transparent 70%)",
              }}
            />
            <div style={{ fontSize: 120, zIndex: 1 }}>
              {steps[activeStep].image}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                right: 20,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 10,
                padding: "12px 16px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ color: "#4ADE80", fontWeight: 700, fontSize: 14 }}>
                Step {steps[activeStep].number} of 06
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  height: 4,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    background: "#22C55E",
                    borderRadius: 4,
                    height: "100%",
                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                    transition: "width 0.4s",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* All steps grid */}
        <h2
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "clamp(24px,3vw,34px)",
            marginBottom: 40,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          The Complete Journey
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                background:
                  activeStep === i
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(255,255,255,0.02)",
                border:
                  activeStep === i
                    ? "1px solid rgba(74,222,128,0.35)"
                    : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                gap: 16,
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "linear-gradient(135deg,#22C55E,#166534)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {s.icon}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#4ADE80",
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  STEP {s.number}
                </div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 6,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.6 }}
                >
                  {s.desc.slice(0, 80)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section
        style={{
          background: "linear-gradient(135deg,#0B3D2E,#14532D)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(26px,3.5vw,38px)",
              margin: "0 0 16px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            See YPF in Action
          </h2>
          <p
            style={{
              color: "#D1D5DB",
              fontSize: 16,
              lineHeight: 1.75,
              marginBottom: 36,
            }}
          >
            Watch how farmers like you are using YPF to transform their yields
            in just one growing season.
          </p>
          <div
            onClick={handleWatchDemo}
            style={{
              background: "rgba(0,0,0,0.4)",
              borderRadius: 20,
              border: "1px solid rgba(74,222,128,0.2)",
              overflow: "hidden",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at center, rgba(74,222,128,0.05) 0%, transparent 70%)",
              }}
            />
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                zIndex: 1,
              }}
            >
              ▶
            </div>
            <div
              style={{ position: "absolute", bottom: 24, left: 24, zIndex: 1 }}
            >
              <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                YPF Platform Demo — 3 min
              </div>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>
                Full walkthrough for new farmers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F0FDF4", padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              color: "#111827",
              fontWeight: 800,
              fontSize: "clamp(26px,3.5vw,36px)",
              margin: "0 0 48px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid rgba(34,197,94,0.15)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 22px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 15,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      color: "#22C55E",
                      fontSize: 20,
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 22px 18px",
                      color: "#6B7280",
                      fontSize: 14,
                      lineHeight: 1.75,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg,#0B3D2E,#14532D)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(26px,3.5vw,38px)",
              margin: "0 0 16px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Start Your Journey Today
          </h2>
          <p
            style={{
              color: "#D1D5DB",
              fontSize: 16,
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            It only takes 5 minutes to set up your farm profile and start
            getting insights.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handleNavigation("Get Started")}
              style={{
                background: "#22C55E",
                border: "none",
                color: "white",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Create Free Account →
            </button>
            <button
              onClick={() => handleNavigation("Contact")}
              style={{
                background: "none",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "white",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;
