import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setPage?: (page: string) => void;
}

const features = [
  {
    icon: "🌱",
    title: "Yield Tracking",
    tag: "Core Feature",
    category: "Core Features",
    desc: "Record and monitor your crop yields across different seasons and fields with comprehensive historical data.",
    points: [
      "Multi-field yield recording",
      "Season-over-season comparison",
      "Export data to CSV/PDF",
      "Visual yield heatmaps",
      "Custom yield targets",
    ],
  },
  {
    icon: "🌦️",
    title: "Weather Monitoring",
    tag: "Real-Time",
    category: "Core Features",
    desc: "Get real-time weather data, 7-day forecasts and historical patterns to plan your farming activities effectively.",
    points: [
      "Live temperature & humidity",
      "7-day weather forecast",
      "Rainfall alerts & tracking",
      "Wind speed monitoring",
      "Seasonal trend analysis",
    ],
  },
  {
    icon: "📊",
    title: "Predictive Analytics",
    tag: "AI-Powered",
    category: "AI & Analytics",
    desc: "Use machine learning models trained on agricultural data to predict yields before harvest season begins.",
    points: [
      "AI yield prediction engine",
      "Risk factor identification",
      "Market price forecasting",
      "Soil health scoring",
      "Crop disease early warning",
    ],
  },
  {
    icon: "📚",
    title: "Smart Recommendations",
    tag: "Personalized",
    category: "AI & Analytics",
    desc: "Receive tailored recommendations based on your farm's specific conditions, crop types, and historical performance.",
    points: [
      "Fertilizer dosage advice",
      "Irrigation scheduling",
      "Planting date optimization",
      "Pest control guidance",
      "Crop rotation plans",
    ],
  },
  {
    icon: "🗺️",
    title: "Field Mapping",
    tag: "Geospatial",
    category: "Operations",
    desc: "Map your fields using GPS technology to manage spatial data and optimize resource allocation per zone.",
    points: [
      "GPS field boundary mapping",
      "Zone-based management",
      "Satellite imagery overlay",
      "Area & perimeter calc",
      "Multi-field dashboards",
    ],
  },
  {
    icon: "💰",
    title: "Cost & Revenue Tracking",
    tag: "Financial",
    category: "Financial",
    desc: "Track all farm expenses, revenues and profit margins to make informed financial decisions each season.",
    points: [
      "Input cost logging",
      "Revenue per crop tracking",
      "Profit margin analysis",
      "Budget vs actuals view",
      "Financial report export",
    ],
  },
  {
    icon: "🚜",
    title: "Equipment Management",
    tag: "Operations",
    category: "Operations",
    desc: "Manage all your farm equipment, maintenance schedules and operational costs in one central place.",
    points: [
      "Equipment inventory list",
      "Maintenance scheduling",
      "Fuel usage tracking",
      "Repair cost logging",
      "Depreciation tracking",
    ],
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    tag: "Multi-User",
    category: "Operations",
    desc: "Add farm workers, agronomists and stakeholders with role-based access to your farm's data and activities.",
    points: [
      "Multi-user accounts",
      "Role-based permissions",
      "Task assignment system",
      "In-app messaging",
      "Activity audit log",
    ],
  },
];

const categories = [
  "All Features",
  "Core Features",
  "AI & Analytics",
  "Operations",
  "Financial",
];

export function Features({ setPage = () => {} }: Props) {
  const [activeCategory, setActiveCategory] = useState("All Features");
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    if (setPage) {
      setPage(page);
    }
    switch (page) {
      case "Get Started":
        navigate("/signup");
        break;
      case "Pricing":
        navigate("/pricing");
        break;
      case "Contact":
        navigate("/contact");
        break;
      default:
        navigate(`/${page.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  const visibleFeatures =
    activeCategory === "All Features"
      ? features
      : features.filter((feature) => feature.category === activeCategory);

  const tableData = [
    { feature: "Yield Tracking", free: "✓", pro: "✓", enterprise: "✓" },
    {
      feature: "Weather Monitoring",
      free: "3 days",
      pro: "14 days",
      enterprise: "Unlimited",
    },
    { feature: "Predictive Analytics", free: "—", pro: "✓", enterprise: "✓" },
    { feature: "Smart Recommendations", free: "—", pro: "✓", enterprise: "✓" },
    { feature: "Team Members", free: "1", pro: "5", enterprise: "Unlimited" },
    {
      feature: "Field Mapping",
      free: "2 fields",
      pro: "20 fields",
      enterprise: "Unlimited",
    },
    { feature: "Data Export", free: "—", pro: "✓", enterprise: "✓" },
    { feature: "API Access", free: "—", pro: "—", enterprise: "✓" },
  ];

  return (
    <div style={{ background: "#020617" }}>
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
              "radial-gradient(circle at 20% 50%, rgba(74,222,128,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.06) 0%, transparent 50%)",
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
            <span>🌿</span>
            <span style={{ color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>
              Platform Features
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
            Everything You Need to
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#4ADE80,#22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Farm Smarter
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
            A complete agricultural management platform built specifically for
            small-scale farmers in developing economies.
          </p>
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
            Start Free Trial →
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none" style={{ display: "block" }}>
            <path d="M0 50L1440 0V50H0Z" fill="#020617" />
          </svg>
        </div>
      </section>

      <section
        style={{ padding: "48px 24px 0", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 48,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveFeature(0);
              }}
              style={{
                padding: "10px 22px",
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Sans',sans-serif",
                background:
                  activeCategory === cat ? "#22C55E" : "rgba(255,255,255,0.05)",
                border:
                  activeCategory === cat
                    ? "none"
                    : "1px solid rgba(255,255,255,0.12)",
                color: activeCategory === cat ? "white" : "#9CA3AF",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section
        style={{ padding: "0 24px 80px", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          {visibleFeatures.map((f, i) => (
            <div
              key={f.title}
              onClick={() => setActiveFeature(i)}
              style={{
                background:
                  activeFeature === i
                    ? "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(22,101,52,0.1))"
                    : "rgba(255,255,255,0.03)",
                border:
                  activeFeature === i
                    ? "1px solid rgba(74,222,128,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 28,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (activeFeature !== i)
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(74,222,128,0.05)";
              }}
              onMouseOut={(e) => {
                if (activeFeature !== i)
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(255,255,255,0.03)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "linear-gradient(135deg,#22C55E,#166534)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {f.icon}
                </div>
                <span
                  style={{
                    background: "rgba(74,222,128,0.12)",
                    color: "#4ADE80",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 50,
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 20,
                  margin: "0 0 10px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 0 18px",
                }}
              >
                {f.desc}
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {f.points.map((p) => (
                  <li
                    key={p}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "#D1D5DB",
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "rgba(34,197,94,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#4ADE80",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#0B3D2E", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontWeight: 800,
              fontSize: "clamp(26px,3.5vw,38px)",
              margin: "0 0 48px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Compare Plans
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(74,222,128,0.2)" }}>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#9CA3AF",
                      fontWeight: 600,
                      padding: "12px 16px",
                      width: "40%",
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      color: "white",
                      fontWeight: 700,
                      padding: "12px 16px",
                      textAlign: "center",
                    }}
                  >
                    Free
                  </th>
                  <th
                    style={{
                      color: "#4ADE80",
                      fontWeight: 700,
                      padding: "12px 16px",
                      textAlign: "center",
                    }}
                  >
                    Pro
                  </th>
                  <th
                    style={{
                      color: "white",
                      fontWeight: 700,
                      padding: "12px 16px",
                      textAlign: "center",
                    }}
                  >
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td style={{ color: "#D1D5DB", padding: "14px 16px" }}>
                      {row.feature}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "14px 16px",
                        color:
                          row.free === "—"
                            ? "#4B5563"
                            : row.free === "✓"
                              ? "#4ADE80"
                              : "#D1D5DB",
                        fontWeight: row.free === "✓" ? 700 : 400,
                      }}
                    >
                      {row.free}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "14px 16px",
                        color:
                          row.pro === "—"
                            ? "#4B5563"
                            : row.pro === "✓"
                              ? "#4ADE80"
                              : "#D1D5DB",
                        fontWeight: row.pro === "✓" ? 700 : 400,
                      }}
                    >
                      {row.pro}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "14px 16px",
                        color:
                          row.enterprise === "—"
                            ? "#4B5563"
                            : row.enterprise === "✓"
                              ? "#4ADE80"
                              : "#D1D5DB",
                        fontWeight: row.enterprise === "✓" ? 700 : 400,
                      }}
                    >
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button
              onClick={() => handleNavigation("Pricing")}
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
              View Full Pricing →
            </button>
          </div>
        </div>
      </section>

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
              fontSize: "clamp(26px,3.5vw,38px)",
              margin: "0 0 16px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              color: "#6B7280",
              fontSize: 16,
              lineHeight: 1.75,
              marginBottom: 32,
            }}
          >
            Join thousands of farmers already using YPF to improve their yields
            and grow their livelihoods.
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
              Create Free Account
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
              Talk to Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
