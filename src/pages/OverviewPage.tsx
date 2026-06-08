import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLayerGroup } from "react-icons/fa";
import { getOverview } from "../services/overviewService";
import type { OverviewResponse, TopicPerformance } from "../types/overview";
import type { OverviewResponse, TopicPerformance, RecentSession } from "../types/overview";

// Topic colors for donut chart and table
const TOPIC_COLORS = [
  "#8B5CF6", "#10B981", "#F59E0B", "#3B82F6", "#EF4444",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
];

function OverviewPage() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const userName = sessionStorage.getItem("name") || "User";
  const userEmail = sessionStorage.getItem("email") || "";
  const userId = Number(sessionStorage.getItem("userId"));

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOverview(userId);
        setOverview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        fontSize: 16,
      }}>
        Loading overview...
      </div>
    );
  }

  const stats = [
    {
      icon: "📅",
      iconBg: "#7C3AED",
      value: overview?.totalSessions ?? 0,
      label1: "Total Sessions",
      label2: "Taken",
    },
    {
      icon: "📖",
      iconBg: "#059669",
      value: overview?.totalQuestionsAttempted ?? 0,
      label1: "Total Questions",
      label2: "Attempted",
    },
    {
      icon: "🏆",
      iconBg: "#D97706",
      value: `${overview?.totalAccepted ?? 0} / ${overview?.totalSubmitted ?? 0}`,
      label1: "Accepted / Submitted",
      label2: overview ? `${overview.overallPassRate}%` : "0%",
      label2Color: "#FF8A00",
    },
    {
      icon: "🔥",
      iconBg: "#2563EB",
      value: overview?.bestStreak ?? 0,
      label1: "Best Streak",
      label2: "days",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ══════════ NAVBAR ══════════ */}
      <nav
        style={{
          height: 64,
          backgroundColor: "#0A0A0A",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
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
            }}
          >
            <FaLayerGroup style={{ color: "#0A0A0A", fontSize: 13, transform: "rotate(-8deg)" }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            Judge<span style={{ color: "#FF8A00" }}>X</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 32, fontSize: 14, fontWeight: 500 }}>
          {["Assessments", "Practice", "Interview", "Pricing", "About"].map((item) => (
            <span
              key={item}
              style={{ color: "#9CA3AF", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Empty right side — no profile icon as requested */}
        <div style={{ width: 120 }} />
      </nav>

      <div style={{ display: "flex", flex: 1 }}>
        {/* ══════════ LEFT SIDEBAR ══════════ */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            backgroundColor: "#0A0A0A",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 0",
          }}
        >
          {/* Overview active item */}
          <div style={{ padding: "0 16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                backgroundColor: "rgba(255,138,0,0.12)",
                border: "1px solid rgba(255,138,0,0.25)",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 16 }}>⊞</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#FF8A00" }}>
                Overview
              </span>
            </div>
          </div>

          {/* User info at bottom */}
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8A00, #e07000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#0A0A0A",
                flexShrink: 0,
              }}
            >
              {getInitials(userName)}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </p>
              <p style={{ fontSize: 11, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userEmail}
              </p>
            </div>
            <span style={{ color: "#6B7280", fontSize: 12, marginLeft: "auto" }}>∨</span>
          </div>
        </div>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 6 }}>
                Overview
              </h1>
              <p style={{ fontSize: 14, color: "#6B7280" }}>
                Your journey to become better, one assessment at a time.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                backgroundColor: "#FF8A00",
                border: "none",
                borderRadius: 10,
                color: "#0A0A0A",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e07000")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF8A00")}
            >
              Start New Assessment 🚀
            </button>
          </div>

          {/* ── At a Glance ── */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 3, height: 20, backgroundColor: "#FF8A00", borderRadius: 2 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>At a Glance</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#111111",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: stat.iconBg + "22",
                      border: `1px solid ${stat.iconBg}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 4 }}>
                      {stat.value}
                    </p>
                    <p style={{ fontSize: 13, color: "#9CA3AF" }}>{stat.label1}</p>
                    <p style={{ fontSize: 13, color: stat.label2Color || "#6B7280" }}>{stat.label2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Topic Performance + Recent Sessions ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

            {/* Topic Performance with Donut */}
            <div
              style={{
                backgroundColor: "#111111",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "24px",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
                Topic Performance
              </h3>

              {overview && overview.topicPerformance.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  {/* Donut Chart SVG */}
                  <DonutChart
                    topics={overview.topicPerformance}
                    overallPassRate={overview.overallPassRate}
                  />

                  {/* Legend */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    {overview.topicPerformance.slice(0, 5).map((t: TopicPerformance, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: TOPIC_COLORS[i % TOPIC_COLORS.length] }} />
                          <span style={{ fontSize: 13, color: "#C9D1D9" }}>
                            {t.topic.replace(/_/g, " ")}
                          </span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
                          {t.passRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#4B5563", fontSize: 13, padding: "40px 0" }}>
                  No data yet. Complete an assessment to see your performance.
                </div>
              )}

              <button
                style={{
                  marginTop: 20,
                  background: "none",
                  border: "none",
                  color: "#FF8A00",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View all topics →
              </button>
            </div>

            {/* Recent Sessions */}
            <div
              style={{
                backgroundColor: "#111111",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Recent Sessions</h3>
                <button style={{ background: "none", border: "none", color: "#FF8A00", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  View All
                </button>
              </div>

              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 80px 80px",
                  gap: 8,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  marginBottom: 10,
                }}
              >
                {["Date", "Questions", "Result", ""].map((h, i) => (
                  <span key={i} style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {overview && overview.recentSessions.length > 0 ? (
                overview.recentSessions.map((session, i) => {
                  const pct = session.total === 0 ? 0 : Math.round((session.accepted / session.total) * 100);
                  const color = pct === 100 ? "#4ADE80" : pct >= 50 ? "#FF8A00" : "#F87171";
                  const bg = pct === 100 ? "rgba(74,222,128,0.1)" : pct >= 50 ? "rgba(255,138,0,0.1)" : "rgba(248,113,113,0.1)";

                  return (
                    <div
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 80px 80px 80px",
                        gap: 8,
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: i < overview.recentSessions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#C9D1D9" }}>{session.date}</span>
                      <span style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>{session.questions}</span>
                      <span style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
                        {session.accepted} / {session.total}
                      </span>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color,
                            backgroundColor: bg,
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", color: "#4B5563", fontSize: 13, padding: "40px 0" }}>
                  No sessions yet.
                </div>
              )}
            </div>
          </div>

          {/* ── Topic Performance Details Table ── */}
          <div
            style={{
              backgroundColor: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "24px",
              marginBottom: 32,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
              Topic Performance Details
            </h3>

            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 3fr 80px",
                gap: 12,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                marginBottom: 8,
              }}
            >
              {["Topic", "Attempted", "Accepted", "", "Pass Rate"].map((h, i) => (
                <span key={i} style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{h}</span>
              ))}
            </div>

            {overview && overview.topicPerformance.length > 0 ? (
              overview.topicPerformance.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 3fr 80px",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: i < overview.topicPerformance.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#C9D1D9", fontWeight: 500 }}>
                    {t.topic.replace(/_/g, " ")}
                  </span>
                  <span style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>{t.attempted}</span>
                  <span style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>{t.accepted}</span>

                  {/* Progress bar */}
                  <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${t.passRate}%`,
                        backgroundColor: TOPIC_COLORS[i % TOPIC_COLORS.length],
                        borderRadius: 3,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>

                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 600, textAlign: "right" }}>
                    {t.passRate}%
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#4B5563", fontSize: 13, padding: "32px 0" }}>
                No topic data yet. Complete assessments to see performance breakdown.
              </div>
            )}

            {overview && overview.topicPerformance.length > 0 && (
              <button
                style={{
                  marginTop: 16,
                  background: "none",
                  border: "none",
                  color: "#FF8A00",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View all topics →
              </button>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#4B5563",
            }}
          >
            <span>© 2026 JudgeX. All rights reserved. Version 1.0.2</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
                <span key={item} style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Donut Chart ─── */
function DonutChart({ topics, overallPassRate }: { topics: TopicPerformance[]; overallPassRate: number }) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const total = topics.reduce((sum, t) => sum + t.attempted, 0);
  let offset = 0;

  const segments = topics.slice(0, 5).map((t, i) => {
    const pct = total === 0 ? 0 : t.attempted / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const segment = {
      color: TOPIC_COLORS[i % TOPIC_COLORS.length],
      dashArray: `${dash} ${gap}`,
      dashOffset: -offset,
    };
    offset += dash;
    return segment;
  });

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background circle */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 10, color: "#6B7280" }}>Overall</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
          {overallPassRate}%
        </span>
        <span style={{ fontSize: 10, color: "#6B7280" }}>Pass Rate</span>
      </div>
    </div>
  );
}

export default OverviewPage;