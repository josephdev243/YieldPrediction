import { useState } from "react";

const contactInfo = [
  {
    icon: "📍",
    label: "Office Address",
    value: "123 Farm Innovation Hub, Westlands, Nairobi, Kenya",
  },
  { icon: "📞", label: "Phone", value: "+254 700 123 456" },
  { icon: "✉️", label: "Email", value: "hello@ypf-farming.com" },
  { icon: "🕐", label: "Support Hours", value: "Mon–Fri, 8:00am – 6:00pm EAT" },
];

const departments = [
  {
    icon: "🛠️",
    name: "Technical Support",
    email: "support@ypf-farming.com",
    response: "< 4 hours",
  },
  {
    icon: "💼",
    name: "Sales & Partnerships",
    email: "sales@ypf-farming.com",
    response: "< 24 hours",
  },
  {
    icon: "📰",
    name: "Press & Media",
    email: "press@ypf-farming.com",
    response: "< 48 hours",
  },
  {
    icon: "🤝",
    name: "NGO & Government",
    email: "partners@ypf-farming.com",
    response: "< 24 hours",
  },
];

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/254700123456", "_blank");
  };

  const handleDirections = () => {
    window.open("https://maps.google.com/?q=Westlands+Nairobi+Kenya", "_blank");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(74,222,128,0.2)",
    color: "white",
    fontSize: 14,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
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
              "radial-gradient(circle at 60% 40%, rgba(74,222,128,0.08) 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 640,
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
            <span>💬</span>
            <span style={{ color: "#4ADE80", fontSize: 13, fontWeight: 600 }}>
              Contact Us
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
            We're Here to
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#4ADE80,#22C55E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Help You Grow
            </span>
          </h1>
          <p style={{ color: "#D1D5DB", fontSize: 17, lineHeight: 1.75 }}>
            Whether you have a question about features, pricing, partnerships,
            or just want to share your farming story — we'd love to hear from
            you.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 50" fill="none" style={{ display: "block" }}>
            <path d="M0 50L1440 0V50H0Z" fill="#020617" />
          </svg>
        </div>
      </section>

      {/* Contact Cards */}
      <section
        style={{ padding: "60px 24px 0", maxWidth: 1280, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
            marginBottom: 60,
          }}
        >
          {contactInfo.map((c) => (
            <div
              key={c.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(74,222,128,0.12)",
                borderRadius: 14,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
              <div
                style={{
                  color: "#4ADE80",
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                {c.label}
              </div>
              <div style={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.6 }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            marginBottom: 80,
          }}
        >
          {/* Form */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(74,222,128,0.15)",
              borderRadius: 20,
              padding: 40,
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
                <h3
                  style={{
                    color: "#4ADE80",
                    fontWeight: 800,
                    fontSize: 24,
                    margin: "0 0 12px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Message Sent!
                </h3>
                <p style={{ color: "#D1D5DB", fontSize: 15, lineHeight: 1.7 }}>
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: 24,
                    background: "#22C55E",
                    border: "none",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2
                  style={{
                    fontWeight: 800,
                    fontSize: 24,
                    margin: "0 0 8px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Send Us a Message
                </h2>
                <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 28 }}>
                  Fill in the form and we'll respond within 24 hours.
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          color: "#D1D5DB",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Full Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Farmer"
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#22C55E")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "rgba(74,222,128,0.2)")
                        }
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          color: "#D1D5DB",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@farm.com"
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#22C55E")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "rgba(74,222,128,0.2)")
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          color: "#D1D5DB",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+254 700 000 000"
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#22C55E")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "rgba(74,222,128,0.2)")
                        }
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          color: "#D1D5DB",
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Category *
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        style={{ ...inputStyle, cursor: "pointer" }}
                      >
                        <option value="">Select category</option>
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Sales & Pricing</option>
                        <option>Partnership</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#D1D5DB",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Subject *
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#22C55E")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(74,222,128,0.2)")
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#D1D5DB",
                        fontSize: 13,
                        fontWeight: 600,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your farm and what you need..."
                      rows={5}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => (e.target.style.borderColor = "#22C55E")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(74,222,128,0.2)")
                      }
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    style={{
                      background: "#22C55E",
                      border: "none",
                      color: "white",
                      padding: "14px",
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                      marginTop: 4,
                    }}
                  >
                    Send Message →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Departments */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(74,222,128,0.12)",
                borderRadius: 20,
                padding: 32,
              }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  margin: "0 0 24px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Reach the Right Team
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {departments.map((d) => (
                  <div
                    key={d.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: 14,
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: "linear-gradient(135deg,#22C55E,#166534)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {d.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: "white",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {d.name}
                      </div>
                      <div style={{ color: "#4ADE80", fontSize: 12 }}>
                        {d.email}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(74,222,128,0.1)",
                        color: "#4ADE80",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.response}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div
              style={{
                background: "linear-gradient(135deg,#0B3D2E,#14532D)",
                borderRadius: 20,
                padding: 32,
                textAlign: "center",
                flex: 1,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  margin: "0 0 10px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Visit Our Office
              </h3>
              <p
                style={{
                  color: "#D1D5DB",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 0 16px",
                }}
              >
                Farm Innovation Hub, Westlands
                <br />
                Nairobi, Kenya
              </p>
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 12,
                  padding: 20,
                  border: "1px dashed rgba(74,222,128,0.3)",
                  marginBottom: 16,
                }}
              >
                <div style={{ color: "#9CA3AF", fontSize: 13 }}>
                  🗺️ Map integration available in production
                </div>
              </div>
              <button
                onClick={handleDirections}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Get Directions →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section
        style={{
          background: "linear-gradient(135deg,#0B3D2E,#14532D)",
          padding: "60px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: 28,
              margin: "0 0 12px",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Prefer WhatsApp?
          </h2>
          <p
            style={{
              color: "#D1D5DB",
              fontSize: 16,
              lineHeight: 1.75,
              marginBottom: 28,
            }}
          >
            Chat directly with our support team on WhatsApp for the fastest
            response — even in Swahili.
          </p>
          <button
            onClick={handleWhatsApp}
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
            📱 Chat on WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
}

export default Contact;
