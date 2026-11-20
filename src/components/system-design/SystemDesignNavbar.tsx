import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLayerGroup, FaFire, FaBookOpen } from "react-icons/fa";
import { FiLogOut, FiUser, FiHome, FiCpu, FiLayers, FiArrowLeft } from "react-icons/fi";
import type { UserProgressSummary } from "../../types/systemDesign";

interface SystemDesignNavbarProps {
  progressSummary?: UserProgressSummary | null;
  activeTrack?: "LLD" | "HLD" | null;
}

export default function SystemDesignNavbar({
  progressSummary,
  activeTrack,
}: SystemDesignNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = sessionStorage.getItem("name") || "Developer";
  const userEmail = sessionStorage.getItem("email") || "";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    navigate("/login");
  };

  const isHomeActive = location.pathname === "/system-design";
  const isLldActive =
    activeTrack === "LLD" || location.pathname === "/system-design/lld";
  const isHldActive =
    activeTrack === "HLD" || location.pathname === "/system-design/hld";

  return (
    <header
      style={{
        height: 68,
        backgroundColor: "rgba(6, 11, 19, 0.94)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(14px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 36px",
      }}
    >
      {/* LEFT: Brand Logo & Navigation Switchers */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Back Button to Landing Page */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "#9CA3AF",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9CA3AF";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <FiArrowLeft style={{ fontSize: 13 }} />
          <span>Back</span>
        </button>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 22,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />

        {/* JudgeX Logo */}
        <div
          onClick={() => navigate("/system-design")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #FF8A00 60%, #e07000 100%)",
              borderRadius: 8,
              transform: "rotate(8deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(255, 138, 0, 0.35)",
            }}
          >
            <FaLayerGroup
              style={{
                color: "#060B13",
                fontSize: 14,
                transform: "rotate(-8deg)",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.4px",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              Judge<span style={{ color: "#FF8A00" }}>X</span>
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#9CA3AF",
                textTransform: "uppercase",
              }}
            >
              System Design
            </span>
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 24,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          }}
        />

        {/* Track Navigation Pills */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => navigate("/system-design")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isHomeActive ? 600 : 500,
              backgroundColor: isHomeActive
                ? "rgba(255, 255, 255, 0.08)"
                : "transparent",
              color: isHomeActive ? "#fff" : "#9CA3AF",
              border: isHomeActive
                ? "1px solid rgba(255, 255, 255, 0.16)"
                : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isHomeActive) {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.04)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isHomeActive) {
                e.currentTarget.style.color = "#9CA3AF";
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <FiHome style={{ fontSize: 14 }} />
            All Tracks
          </button>

          {/* LLD Track Pill */}
          <button
            onClick={() => navigate("/system-design/lld")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isLldActive ? 600 : 500,
              backgroundColor: isLldActive
                ? "rgba(255, 138, 0, 0.12)"
                : "transparent",
              color: isLldActive ? "#FF8A00" : "#9CA3AF",
              border: isLldActive
                ? "1px solid rgba(255, 138, 0, 0.35)"
                : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isLldActive) {
                e.currentTarget.style.color = "#FFA133";
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 138, 0, 0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLldActive) {
                e.currentTarget.style.color = "#9CA3AF";
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <FiCpu
              style={{
                fontSize: 14,
                color: isLldActive ? "#FF8A00" : "inherit",
              }}
            />
            LLD Track
          </button>

          {/* HLD Track Pill */}
          <button
            onClick={() => navigate("/system-design/hld")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isHldActive ? 600 : 500,
              backgroundColor: isHldActive
                ? "rgba(56, 189, 248, 0.12)"
                : "transparent",
              color: isHldActive ? "#38BDF8" : "#9CA3AF",
              border: isHldActive
                ? "1px solid rgba(56, 189, 248, 0.35)"
                : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isHldActive) {
                e.currentTarget.style.color = "#7DD3FC";
                e.currentTarget.style.backgroundColor =
                  "rgba(56, 189, 248, 0.06)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isHldActive) {
                e.currentTarget.style.color = "#9CA3AF";
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <FiLayers
              style={{
                fontSize: 14,
                color: isHldActive ? "#38BDF8" : "inherit",
              }}
            />
            HLD Track
          </button>
        </nav>
      </div>

      {/* RIGHT: Live Progress Metric Badges & Profile Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* Streak & Completion Badges */}
        {progressSummary && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Streak Badge */}
            <div
              title={`${progressSummary.currentStreak} Day Learning Streak`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 138, 0, 0.08)",
                border: "1px solid rgba(255, 138, 0, 0.22)",
                fontSize: 12,
                fontWeight: 600,
                color: "#FF8A00",
              }}
            >
              <FaFire style={{ color: "#FF8A00", fontSize: 13 }} />
              <span>{progressSummary.currentStreak}d Streak</span>
            </div>

            {/* Completed Topics Badge */}
            <div
              title={`${progressSummary.totalTopicsCompleted} of ${progressSummary.totalTopics} topics completed`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                borderRadius: 20,
                backgroundColor: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.22)",
                fontSize: 12,
                fontWeight: 600,
                color: "#38BDF8",
              }}
            >
              <FaBookOpen style={{ color: "#38BDF8", fontSize: 12 }} />
              <span>
                {progressSummary.totalTopicsCompleted} /{" "}
                {progressSummary.totalTopics} Done
              </span>
            </div>
          </div>
        )}

        {/* Back to Platform Overview */}
        <button
          onClick={() => navigate("/overview")}
          style={{
            background: "none",
            border: "none",
            color: "#9CA3AF",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: 6,
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
        >
          My Overview
        </button>

        {/* User Profile Dropdown Button */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "5px 12px 5px 5px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 30,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 138, 0, 0.4)";
              e.currentTarget.style.backgroundColor =
                "rgba(255, 138, 0, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.04)";
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8A00, #e07000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#060B13",
              }}
            >
              {getInitials(userName)}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#fff",
                maxWidth: 100,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </span>
          </button>

          {/* Profile Dropdown Menu */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 230,
                backgroundColor: "#0B131F",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 12,
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
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
                    fontSize: 11,
                    color: "#9CA3AF",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userEmail}
                </p>
              </div>

              <div style={{ padding: "6px" }}>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/overview");
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "#E5E7EB",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiUser style={{ fontSize: 14 }} />
                  Overview Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/");
                  }}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "#E5E7EB",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiHome style={{ fontSize: 14 }} />
                  JudgeX Home
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: "#F87171",
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(239, 68, 68, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <FiLogOut style={{ fontSize: 14 }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
