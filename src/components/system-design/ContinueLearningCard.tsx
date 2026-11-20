import { useNavigate } from "react-router-dom";
import { FiPlayCircle, FiClock, FiLayers, FiCpu, FiArrowRight, FiCompass } from "react-icons/fi";
import type { RecentlyVisitedTopic } from "../../types/systemDesign";

interface ContinueLearningCardProps {
  recentTopics: RecentlyVisitedTopic[];
}

export default function ContinueLearningCard({
  recentTopics,
}: ContinueLearningCardProps) {
  const navigate = useNavigate();

  if (!recentTopics || recentTopics.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#0B1322",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 18,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(255, 138, 0, 0.12)",
              border: "1px solid rgba(255, 138, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FiCompass style={{ fontSize: 22, color: "#FF8A00" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FF8A00",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Welcome to System Design
              </span>
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
              Start your architectural journey today
            </h4>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>
              Explore Low-Level Design (OOP & Design Patterns) or High-Level Design (Scalability & Distributed Systems).
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/system-design/lld")}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              backgroundColor: "rgba(255, 138, 0, 0.15)",
              border: "1px solid rgba(255, 138, 0, 0.4)",
              color: "#FF8A00",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 138, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 138, 0, 0.15)";
            }}
          >
            <span>Start LLD</span>
            <FiArrowRight style={{ fontSize: 14 }} />
          </button>

          <button
            onClick={() => navigate("/system-design/hld")}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              color: "#38BDF8",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.15)";
            }}
          >
            <span>Start HLD</span>
            <FiArrowRight style={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
    );
  }

  const latest = recentTopics[0];
  const isLld = latest.trackType === "LLD";
  const themeColor = isLld ? "#FF8A00" : "#38BDF8";
  const trackRoute = isLld ? "/system-design/lld" : "/system-design/hld";

  return (
    <div
      style={{
        backgroundColor: "#0B1322",
        border: `1px solid ${isLld ? "rgba(255, 138, 0, 0.3)" : "rgba(56, 189, 248, 0.3)"}`,
        borderRadius: 18,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: `0 8px 30px ${isLld ? "rgba(255,138,0,0.12)" : "rgba(56,189,248,0.12)"}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow highlight */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: 0,
          width: 140,
          height: 140,
          background: isLld
            ? "radial-gradient(circle, rgba(255,138,0,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: isLld ? "rgba(255, 138, 0, 0.14)" : "rgba(56, 189, 248, 0.14)",
            border: `1px solid ${isLld ? "rgba(255, 138, 0, 0.4)" : "rgba(56, 189, 248, 0.4)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 0 16px ${isLld ? "rgba(255,138,0,0.2)" : "rgba(56,189,248,0.2)"}`,
          }}
        >
          {isLld ? (
            <FiCpu style={{ fontSize: 24, color: "#FF8A00" }} />
          ) : (
            <FiLayers style={{ fontSize: 24, color: "#38BDF8" }} />
          )}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: themeColor,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                backgroundColor: isLld ? "rgba(255, 138, 0, 0.1)" : "rgba(56, 189, 248, 0.1)",
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              Resume Learning • {latest.trackType}
            </span>

            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {latest.phaseTitle}
            </span>
          </div>

          <h4 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
            {latest.topicTitle}
          </h4>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#9CA3AF" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FiClock style={{ fontSize: 12 }} />
              Last active: {latest.lastVisitedAt ? new Date(latest.lastVisitedAt).toLocaleDateString() : "Recently"}
            </span>
            <span style={{ color: "#4B5563" }}>•</span>
            <span style={{ color: latest.status === "COMPLETED" ? "#34D399" : "#FBBF24" }}>
              {latest.status === "COMPLETED" ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() =>
          navigate(
            `/system-design/${isLld ? "lld" : "hld"}/topic/${latest.topicId}`
          )
        }
        style={{
          padding: "12px 22px",
          borderRadius: 12,
          backgroundColor: themeColor,
          border: "none",
          color: "#060B13",
          fontSize: 14,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 9,
          cursor: "pointer",
          boxShadow: `0 4px 16px ${isLld ? "rgba(255,138,0,0.35)" : "rgba(56,189,248,0.35)"}`,
          transition: "transform 0.15s, box-shadow 0.15s",
          position: "relative",
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 6px 20px ${isLld ? "rgba(255,138,0,0.5)" : "rgba(56,189,248,0.5)"}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 4px 16px ${isLld ? "rgba(255,138,0,0.35)" : "rgba(56,189,248,0.35)"}`;
        }}
      >
        <FiPlayCircle style={{ fontSize: 18 }} />
        <span>Continue Topic</span>
      </button>
    </div>
  );
}
