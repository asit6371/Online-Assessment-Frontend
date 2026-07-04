import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLaptopCode,
  FaMobileAlt,
  FaBuilding,
  FaUsers,
  FaRegClock,
  FaLayerGroup
} from "react-icons/fa";
import StartAssessmentModal from "../components/StartAssessmentModal";

function LandingPage() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check auth state on mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");

    if (token && name && email) {
      setIsLoggedIn(true);
      setUserName(name);
      setUserEmail(email);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setShowDropdown(false);
  };

  const handleStart = (cardTitle: string) => {
    if (cardTitle !== "DSA Assessment") return;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setShowModal(true);
  };

  const assessments = [
    {
      title: "DSA Assessment",
      category: "ONLINE ASSESSMENT",
      questions: 2,
      duration: 60,
      icon: <FaLaptopCode className="text-xl text-[#FF8A00]" />,
      active: true,
    },
    {
      title: "Java Core Assessment",
      category: "PHONE INTERVIEW",
      questions: "--",
      duration: "--",
      icon: <FaMobileAlt className="text-xl text-[#FF8A00]" />,
      active: false,
    },
    {
      title: "Spring Boot Assessment",
      category: "ONSITE INTERVIEW",
      questions: "--",
      duration: "--",
      icon: <FaBuilding className="text-xl text-[#FF8A00]" />,
      active: false,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden flex flex-col"
      style={{ backgroundColor: "#060B13", fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Dot-grid + orange glow in top-right ── */}
      <div
        className="pointer-events-none absolute top-0 right-0 z-0"
        style={{ width: 640, height: 520, opacity: 0.45 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 10%, rgba(255,138,0,0.15) 0%, transparent 65%)",
          }}
        />
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,138,0,0.55) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "right top",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 80% 20%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 80% 20%, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* ════════════════════ NAVBAR ════════════════════ */}
      <nav
        className="h-[72px] flex items-center justify-between sticky top-0 z-50"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "rgba(6,11,19,0.92)",
          backdropFilter: "blur(10px)",
          padding: "0 48px",
        }}
      >
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-10">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { stopStream(); navigate("/"); }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 34,
                height: 34,
                background: "linear-gradient(135deg, #FF8A00 60%, #e07000 100%)",
                borderRadius: 8,
                transform: "rotate(8deg)",
              }}
            >
              <FaLayerGroup
                style={{ color: "#060B13", fontSize: 14, transform: "rotate(-8deg)" }}
              />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
              Judge<span style={{ color: "#FF8A00" }}>X</span>
            </span>
          </div>

          <div className="hidden md:flex gap-8" style={{ fontSize: 14, fontWeight: 500 }}>
            {["Assessments", "Practice", "Interview", "Pricing", "About"].map((item) => (
              <span
                key={item}
                className="cursor-pointer transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right: auth buttons OR profile */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          {!isLoggedIn ? (
            /* ── Not logged in: Login + Register ── */
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 transition-colors"
                style={{
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  background: "transparent",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
                }
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="4.5" r="2.5" stroke="#9CA3AF" strokeWidth="1.4" />
                  <path
                    d="M2 12c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5"
                    stroke="#9CA3AF"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 transition-colors"
                style={{
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 500,
                  border: "1px solid #FF8A00",
                  borderRadius: 8,
                  background: "transparent",
                  color: "#FF8A00",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,138,0,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="6.5" cy="4.5" r="2.5" stroke="#FF8A00" strokeWidth="1.4" />
                  <path
                    d="M1.5 12.5c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5"
                    stroke="#FF8A00"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 7v4M10 9h4"
                    stroke="#FF8A00"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                Register
              </button>
            </div>
          ) : (
            /* ── Logged in: Profile avatar button ── */
            <div>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 14px 6px 6px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 40,
                  background: "rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,138,0,0.4)";
                  e.currentTarget.style.background = "rgba(255,138,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {/* Avatar circle with initials */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF8A00, #e07000)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#060B13",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(userName)}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#fff",
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userName}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* ── Dropdown ── */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 240,
                    backgroundColor: "#0B131F",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    overflow: "hidden",
                    zIndex: 100,
                  }}
                >
                  {/* User info */}
                  <div
                    style={{
                      padding: "16px 18px",
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #FF8A00, #e07000)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#060B13",
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(userName)}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {userName}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div style={{ padding: "8px" }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "transparent",
                        border: "none",
                        borderRadius: 8,
                        color: "#F87171",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path
                          d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3"
                          stroke="#F87171"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10 10l3-2.5L10 5"
                          stroke="#F87171"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 7.5H6"
                          stroke="#F87171"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ════════════════════ MAIN ════════════════════ */}
      <main
        className="relative z-10 flex-1"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 80px 80px" }}
      >
        {/* ── HERO ── */}
        <section style={{ marginBottom: 72, maxWidth: 680 }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              marginBottom: 24,
              color: "#fff",
            }}
          >
            Mock Assessment
          </h1>

          <p
            style={{
              fontSize: 20,
              color: "#9CA3AF",
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 540,
            }}
          >
            Prepare yourself. Start a practice assessment
            <br />
            from a collection of real company questions.
          </p>

          {/* Always visible — placeholder links for future pages */}
          <div className="flex items-center gap-5" style={{ fontSize: 15 }}>
            <button
              onClick={() => navigate("/overview")}
              style={{
                background: "none",
                border: "none",
                color: "#3B82F6",
                cursor: "pointer",
                fontSize: 15,
                padding: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Go to My Overview
            </button>
            <span style={{ color: "#374151" }}>|</span>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "none",
                border: "none",
                color: "#3B82F6",
                cursor: "pointer",
                fontSize: 15,
                padding: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Go to My Assessment History
            </button>
          </div>
        </section>

        {/* ── ASSESSMENT CARDS ── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {assessments.map((card, index) => (
            <AssessmentCard
              key={index}
              card={card}
              onStart={() => handleStart(card.title)}
            />
          ))}
        </section>
      </main>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer
        className="relative z-10"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "#060B13",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 48px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#6B7280",
          }}
        >
          <span>© 2026 JudgeX. All rights reserved. Version 1.0.2</span>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
              <span
                key={item}
                className="cursor-pointer transition-colors"
                onClick={() => {
                  if (item === "Privacy Policy") navigate("/privacy-policy");
                  if (item === "Terms of Service") navigate("/terms");
                  if (item === "Contact Us") navigate("/contact");
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Modal ── */}
      {showModal && (
        <StartAssessmentModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

/* ─── Assessment Card ─── */
function AssessmentCard({
  card,
  onStart,
}: {
  card: {
    title: string;
    category: string;
    questions: number | string;
    duration: number | string;
    icon: React.ReactNode;
    active: boolean;
  };
  onStart: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: "#0B131F",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: "32px 28px",
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "border-color 0.2s",
        opacity: card.active ? 1 : 0.5,
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        if (card.active)
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {/* TOP */}
      <div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 20, color: "#FF8A00" }}>{card.icon}</span>
          </div>
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                color: "#9CA3AF",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {card.category}
            </p>
            <h3
              style={{ fontSize: 20, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}
            >
              {card.title}
            </h3>
          </div>
        </div>

        <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.65 }}>
          {card.active
            ? "Random question set from real company."
            : "Coming soon."}
        </p>
      </div>

      {/* BOTTOM */}
      <div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 18,
            marginBottom: 22,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#9CA3AF",
              fontSize: 14,
            }}
          >
            <FaUsers style={{ fontSize: 14 }} />
            <span>{card.questions} Questions</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#9CA3AF",
              fontSize: 14,
            }}
          >
            <FaRegClock style={{ fontSize: 14 }} />
            <span>{card.duration} Minutes</span>
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={!card.active}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 12,
            border: card.active
              ? "1px solid #FF8A00"
              : "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: card.active ? "#FF8A00" : "#4B5563",
            fontSize: 15,
            fontWeight: 600,
            cursor: card.active ? "pointer" : "not-allowed",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (card.active)
              e.currentTarget.style.background = "rgba(255,138,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {card.active ? "Start" : "Coming Soon"}
        </button>
      </div>
    </div>
  );
}

export default LandingPage;