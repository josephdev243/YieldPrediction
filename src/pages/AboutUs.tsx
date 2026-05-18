import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setPage?: (page: string) => void;
}

const team = [
  {
    name: "Dr. Amina Wanjiku",
    role: "Co-Founder & CEO",
    bio: "Agricultural economist with 15 years experience in smallholder farming systems across East Africa.",
    emoji: "👩🏾‍💼",
  },
  {
    name: "James Otieno",
    role: "Co-Founder & CTO",
    bio: "Software engineer and data scientist who built satellite crop monitoring systems for the Kenyan government.",
    emoji: "👨🏿‍💻",
  },
  {
    name: "Sarah Muthoni",
    role: "Head of Agronomy",
    bio: "PhD in Crop Science from University of Nairobi. Leads our AI recommendations and soil science research.",
    emoji: "👩🏽‍🔬",
  },
  {
    name: "David Kipchoge",
    role: "Head of Product",
    bio: "Previously led product at M-KOPA Solar. Passionate about building tech that actually works in rural Africa.",
    emoji: "👨🏾‍🎨",
  },
  {
    name: "Grace Achieng",
    role: "Head of Partnerships",
    bio: "Former senior officer at FAO Kenya, connecting YPF with NGOs, governments and agricultural co-ops.",
    emoji: "👩🏿‍🤝‍👨🏽",
  },
  {
    name: "Peter Kamau",
    role: "Head of Engineering",
    bio: "Full-stack engineer with expertise in offline-first mobile apps built for low-bandwidth environments.",
    emoji: "👨🏽‍💻",
  },
];

const values = [
  {
    icon: "🌾",
    title: "Farmer First",
    desc: "Every decision we make starts by asking: does this make a farmer's life better? Real farmers shape our roadmap.",
  },
  {
    icon: "🤝",
    title: "Radical Transparency",
    desc: "We share our data methodologies, prediction errors and business model openly. No black boxes.",
  },
  {
    icon: "🌍",
    title: "Local Relevance",
    desc: "Built specifically for East African farming conditions, not adapted from solutions designed for other markets.",
  },
  {
    icon: "📡",
    title: "Works Everywhere",
    desc: "Offline-first design ensures YPF works in areas with poor connectivity — because that's where most farmers are.",
  },
  {
    icon: "🔒",
    title: "Data Sovereignty",
    desc: "Farmers own their data. We never sell it. They can export or delete everything at any time.",
  },
  {
    icon: "♻️",
    title: "Climate Resilience",
    desc: "We actively research and promote farming practices that are sustainable and resilient to climate change.",
  },
];

const milestones = [
  {
    year: "2020",
    event: "YPF founded in Nairobi, Kenya",
    detail: "Started as a research project at University of Nairobi",
  },
  {
    year: "2021",
    event: "First 100 pilot farmers onboarded",
    detail: "Piloted in Nakuru and Machakos counties",
  },
  {
    year: "2022",
    event: "Raised $1.2M seed funding",
    detail: "Backed by Acumen Fund and Safaricom Spark",
  },
  {
    year: "2023",
    event: "Launched mobile app for Android",
    detail: "Available in English and Swahili",
  },
  {
    year: "2024",
    event: "Reached 2,000 active farmers",
    detail: "Expanded to Uganda and Tanzania",
  },
  {
    year: "2025",
    event: "5,000+ farmers, $500K in grants",
    detail: "Partnered with World Food Programme",
  },
  {
    year: "2026",
    event: "15,000 hectares monitored",
    detail: "Expanding to Ethiopia and Rwanda",
  },
];

const partners = [
  "🇺🇳 FAO Kenya",
  "🌍 Acumen Fund",
  "📱 Safaricom Spark",
  "🌱 GIZ AgriFinance",
  "🏦 Equity Bank",
  "🎓 Uni. of Nairobi",
];

export function AboutUs({ setPage = () => {} }: Props) {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    if (page === "Get Started") {
      navigate("/signup");
    } else if (page === "Contact") {
      navigate("/contact");
    }
    // Call setPage for backwards compatibility
    setPage(page);
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
              "radial-gradient(circle at 70% 40%, rgba(74,222,128,0.08) 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 760,
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
            <span>🌍</span>
            <span style={{ color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>
              Our Story
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
            Built by Africans,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#4ADE80,#22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              For African Farmers
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
            YPF was born from a simple observation: small-scale farmers in East
            Africa are the backbone of food security, yet they have access to
            almost none of the technology that large farms use to optimize their
            operations.
          </p>
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              ["5,000+", "Active Farmers"],
              ["15,000+", "Hectares Monitored"],
              ["25%", "Avg. Yield Increase"],
              ["6", "Countries"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#4ADE80",
                    fontWeight: 800,
                    fontSize: 32,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {val}
                </div>
                <div style={{ color: "#9CA3AF", fontSize: 13 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none" style={{ display: "block" }}>
            <path d="M0 50L1440 0V50H0Z" fill="#020617" />
          </svg>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginBottom: 64,
          }}
        >
          {[
            {
              icon: "🎯",
              label: "Our Mission",
              color: "#22C55E",
              text: "To empower every small-scale farmer in Africa with affordable, data-driven tools that help them predict yields, reduce losses, and improve their livelihoods — regardless of their education level or internet connectivity.",
            },
            {
              icon: "🔭",
              label: "Our Vision",
              color: "#4ADE80",
              text: "A future where no African farmer loses a harvest to preventable causes. Where agricultural intelligence is democratized — available to the farmer with 2 acres just as much as the commercial operator with 2,000.",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(74,222,128,0.15)",
                borderRadius: 20,
                padding: 36,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg,#22C55E,#166534)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  marginBottom: 20,
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  color: item.color,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}
              >
                {item.label}
              </h3>
              <p
                style={{
                  color: "#D1D5DB",
                  fontSize: 16,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(26px,3.5vw,36px)",
              margin: "0 0 12px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            What We Stand For
          </h2>
          <p style={{ color: "#9CA3AF", fontSize: 16 }}>
            Our values aren't just words — they're decisions we make every day.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
            marginBottom: 80,
          }}
        >
          {values.map((v) => (
            <div
              key={v.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{v.icon}</div>
              <h4
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 17,
                  margin: "0 0 10px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {v.title}
              </h4>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "#0B3D2E", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2
              style={{
                fontWeight: 800,
                fontSize: "clamp(26px,3.5vw,38px)",
                margin: "0 0 12px",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Meet the Team
            </h2>
            <p
              style={{
                color: "#D1D5DB",
                fontSize: 16,
                maxWidth: 540,
                margin: "0 auto",
              }}
            >
              A diverse group of agronomists, engineers, and product designers
              united by a common purpose.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            {team.map((member) => (
              <div
                key={member.name}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(74,222,128,0.12)",
                  borderRadius: 16,
                  padding: 28,
                  textAlign: "center",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-4px)")
                }
                onMouseOut={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "none")
                }
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#22C55E,#14532D)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    margin: "0 auto 16px",
                  }}
                >
                  {member.emoji}
                </div>
                <h3
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 18,
                    margin: "0 0 6px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    color: "#4ADE80",
                    fontWeight: 600,
                    fontSize: 13,
                    margin: "0 0 14px",
                  }}
                >
                  {member.role}
                </p>
                <p
                  style={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "clamp(26px,3.5vw,36px)",
            margin: "0 0 56px",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Our Journey
        </h2>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(to bottom,#22C55E,#14532D)",
              transform: "translateX(-50%)",
            }}
          />
          {milestones.map((m, i) => (
            <div
              key={m.year}
              style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: 32,
                position: "relative",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 16,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#22C55E",
                  border: "3px solid #020617",
                  transform: "translateX(-50%)",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  width: "44%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(74,222,128,0.15)",
                  borderRadius: 12,
                  padding: "18px 20px",
                  marginLeft: i % 2 === 0 ? 0 : 0,
                }}
              >
                <div
                  style={{
                    color: "#4ADE80",
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 6,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {m.year}
                </div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 6,
                  }}
                >
                  {m.event}
                </div>
                <div style={{ color: "#9CA3AF", fontSize: 13 }}>{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section
        style={{
          background: "#0B3D2E",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            Trusted Partners & Backers
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            {partners.map((p) => (
              <div
                key={p}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 50,
                  padding: "10px 24px",
                  color: "#D1D5DB",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#F0FDF4",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              color: "#111827",
              fontWeight: 800,
              fontSize: "clamp(26px,3.5vw,36px)",
              margin: "0 0 16px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Join Our Growing Community
          </h2>
          <p
            style={{
              color: "#6B7280",
              fontSize: 16,
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            Be part of the agricultural revolution. Start your free trial and
            see the difference data makes.
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
              onClick={() => handleNavigation("Contact")}
              style={{
                background: "none",
                border: "2px solid #22C55E",
                color: "#22C55E",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
