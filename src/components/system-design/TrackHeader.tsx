import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCpu, FiLayers } from "react-icons/fi";
import type { SystemDesignTrack } from "../../types/systemDesign";

interface TrackHeaderProps {
  track: SystemDesignTrack;
  allTracks?: SystemDesignTrack[];
}

export default function TrackHeader({ track }: TrackHeaderProps) {  const navigate = useNavigate();
  const isLld = track.trackType === "LLD";

  const theme = isLld
    ? {
      primary: "#FF8A00",
      secondary: "#FFA133",
      glow: "rgba(255, 138, 0, 0.25)",
      badgeBg: "rgba(255, 138, 0, 0.12)",
      badgeBorder: "rgba(255, 138, 0, 0.35)",
      gradient: "radial-gradient(ellipse at 80% 0%, rgba(255,138,0,0.18) 0%, transparent 70%)",
      icon: <FiCpu style={{ fontSize: 26, color: "#FF8A00" }} />,
      tag: "LOW-LEVEL DESIGN (LLD)",
      subtitleTag: "OOP, SOLID Principles & Design Patterns",
    }
    : {
      primary: "#38BDF8",
      secondary: "#60A5FA",
      glow: "rgba(56, 189, 248, 0.25)",
      badgeBg: "rgba(56, 189, 248, 0.12)",
      badgeBorder: "rgba(56, 189, 248, 0.35)",
      gradient: "radial-gradient(ellipse at 80% 0%, rgba(56,189,248,0.18) 0%, transparent 70%)",
      icon: <FiLayers style={{ fontSize: 26, color: "#38BDF8" }} />,
      tag: "HIGH-LEVEL DESIGN (HLD)",
      subtitleTag: "Distributed Systems & Architecture Scalability",
    };

  const progressPercent = Math.min(100, Math.max(0, track.progressPercent || 0));

  return (
    <div
      style={{
        backgroundColor: "#080E1A",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
        overflow: "hidden",
        padding: "36px 48px 40px",
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: theme.gradient,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Top bar: Back Button & Track Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => navigate("/system-design")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 8,
              padding: "7px 14px",
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
            <FiArrowLeft style={{ fontSize: 14 }} />
            <span>All System Design Tracks</span>
          </button>

          {/* Quick Track Switcher Toggle */}
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(6, 11, 19, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 10,
              padding: 3,
              gap: 4,
            }}
          >
            <button
              onClick={() => navigate("/system-design/lld")}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: isLld ? "#FF8A00" : "transparent",
                color: isLld ? "#060B13" : "#9CA3AF",
                transition: "all 0.15s ease",
              }}
            >
              <FiCpu style={{ fontSize: 13 }} />
              LLD Curriculum
            </button>

            <button
              onClick={() => navigate("/system-design/hld")}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: !isLld ? "#38BDF8" : "transparent",
                color: !isLld ? "#060B13" : "#9CA3AF",
                transition: "all 0.15s ease",
              }}
            >
              <FiLayers style={{ fontSize: 13 }} />
              HLD Curriculum
            </button>
          </div>
        </div>

        {/* Track Title & Badges */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: theme.badgeBg,
              border: `1px solid ${theme.badgeBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 24px ${theme.glow}`,
            }}
          >
            {theme.icon}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: theme.primary,
                  backgroundColor: theme.badgeBg,
                  border: `1px solid ${theme.badgeBorder}`,
                  padding: "3px 10px",
                  borderRadius: 6,
                  letterSpacing: "0.08em",
                }}
              >
                {theme.tag}
              </span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                {theme.subtitleTag}
              </span>
            </div>

            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.6px",
                marginBottom: 8,
              }}
            >
              {track.name}
            </h1>

            <p style={{ fontSize: 15, color: "#9CA3AF", lineHeight: 1.6, maxWidth: 780 }}>
              {track.description}
            </p>
          </div>
        </div>

        {/* Stats Chips & Progress Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 32,
            alignItems: "center",
            paddingTop: 20,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Stats Chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: theme.primary, fontSize: 16 }}>📁</span>
              <div>
                <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
                  Curriculum Phases
                </span>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {track.totalPhases} Phases
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: theme.primary, fontSize: 16 }}>📖</span>
              <div>
                <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
                  Deep Dive Topics
                </span>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {track.totalTopics} Modules
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: theme.primary, fontSize: 16 }}>⚡</span>
              <div>
                <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
                  Practice Problems
                </span>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {track.totalProblems} Challenges
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: theme.primary, fontSize: 16 }}>⏳</span>
              <div>
                <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
                  Pace
                </span>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {track.estimatedWeeks || "6-8 Weeks"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Widget */}
          <div
            style={{
              backgroundColor: "rgba(6, 11, 19, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 14,
              padding: "12px 20px",
              minWidth: 260,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#9CA3AF", fontWeight: 500 }}>Track Progress</span>
              <span style={{ color: theme.primary, fontWeight: 700 }}>
                {progressPercent.toFixed(0)}% Complete
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: 6,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  backgroundColor: theme.primary,
                  borderRadius: 6,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 5, textAlign: "right" }}>
              {track.completedTopics || 0} of {track.totalTopics} topics mastered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
