import { useNavigate } from "react-router-dom";
import { FiCpu, FiLayers, FiArrowRight } from "react-icons/fi";
import type { SystemDesignTrack } from "../../types/systemDesign";

interface TrackCardProps {
  track: SystemDesignTrack;
}

export default function TrackCard({ track }: TrackCardProps) {
  const navigate = useNavigate();
  const isLld = track.trackType === "LLD";

  const theme = isLld
    ? {
        primary: "#FF8A00",
        secondary: "#FFA133",
        glow: "rgba(255, 138, 0, 0.22)",
        borderHover: "rgba(255, 138, 0, 0.45)",
        badgeBg: "rgba(255, 138, 0, 0.12)",
        badgeBorder: "rgba(255, 138, 0, 0.3)",
        gradient: "linear-gradient(135deg, rgba(255,138,0,0.15) 0%, rgba(11,19,34,0.6) 100%)",
        btnGradient: "linear-gradient(135deg, #FF8A00 0%, #E07000 100%)",
        textColor: "#FF8A00",
        icon: <FiCpu style={{ fontSize: 24, color: "#FF8A00" }} />,
        tag: "Low-Level Design",
        route: "/system-design/lld",
      }
    : {
        primary: "#38BDF8",
        secondary: "#60A5FA",
        glow: "rgba(56, 189, 248, 0.22)",
        borderHover: "rgba(56, 189, 248, 0.45)",
        badgeBg: "rgba(56, 189, 248, 0.12)",
        badgeBorder: "rgba(56, 189, 248, 0.3)",
        gradient: "linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(11,19,34,0.6) 100%)",
        btnGradient: "linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)",
        textColor: "#38BDF8",
        icon: <FiLayers style={{ fontSize: 24, color: "#38BDF8" }} />,
        tag: "High-Level Design",
        route: "/system-design/hld",
      };

  const progressPercent = Math.min(100, Math.max(0, track.progressPercent || 0));

  return (
    <div
      style={{
        backgroundColor: "#0B1322",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 20,
        padding: "32px 30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.borderHover;
        e.currentTarget.style.boxShadow = `0 16px 40px ${theme.glow}`;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Background ambient gradient glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 260,
          height: 260,
          background: theme.gradient,
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* CARD CONTENT */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Top Header Badge & Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: theme.badgeBg,
              border: `1px solid ${theme.badgeBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${theme.glow}`,
            }}
          >
            {theme.icon}
          </div>

          <div
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              backgroundColor: theme.badgeBg,
              border: `1px solid ${theme.badgeBorder}`,
              color: theme.textColor,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {theme.tag}
          </div>
        </div>

        {/* Track Title */}
        <h3
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 10,
            letterSpacing: "-0.4px",
            lineHeight: 1.25,
          }}
        >
          {track.name}
        </h3>

        {/* Track Description */}
        <p
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            lineHeight: 1.6,
            marginBottom: 24,
            minHeight: 44,
          }}
        >
          {track.description}
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            padding: "14px 16px",
            backgroundColor: "rgba(6, 11, 19, 0.6)",
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.06)",
            marginBottom: 24,
          }}
        >
          <div>
            <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
              Phases
            </span>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 2 }}>
              {track.totalPhases}
            </p>
          </div>

          <div>
            <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
              Topics
            </span>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 2 }}>
              {track.totalTopics}
            </p>
          </div>

          <div>
            <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", fontWeight: 600 }}>
              Duration
            </span>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4, whiteSpace: "nowrap" }}>
              {track.estimatedWeeks || "6-8 Weeks"}
            </p>
          </div>
        </div>
      </div>

      {/* PROGRESS & ACTION */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Progress Bar Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ color: "#9CA3AF", fontWeight: 500 }}>Track Completion</span>
          <span style={{ color: theme.textColor, fontWeight: 700 }}>
            {progressPercent.toFixed(0)}% ({track.completedTopics || 0}/{track.totalTopics})
          </span>
        </div>

        {/* Progress Bar Track */}
        <div
          style={{
            width: "100%",
            height: 6,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: isLld
                ? "linear-gradient(90deg, #FF8A00, #FFA133)"
                : "linear-gradient(90deg, #38BDF8, #60A5FA)",
              borderRadius: 6,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate(theme.route)}
          style={{
            width: "100%",
            padding: "13px 20px",
            borderRadius: 12,
            border: `1px solid ${theme.textColor}`,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            color: theme.textColor,
            fontSize: 14,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isLld
              ? "rgba(255, 138, 0, 0.15)"
              : "rgba(56, 189, 248, 0.15)";
            e.currentTarget.style.boxShadow = `0 0 16px ${theme.glow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span>Explore {isLld ? "LLD" : "HLD"} Track</span>
          <FiArrowRight style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}
