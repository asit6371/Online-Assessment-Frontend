import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCpu,
  FiLayers,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
  FiBookOpen,
  FiCompass,
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import SystemDesignNavbar from "../../components/system-design/SystemDesignNavbar";
import TrackCard from "../../components/system-design/TrackCard";
import ContinueLearningCard from "../../components/system-design/ContinueLearningCard";
import Footer from "../../components/Footer";
import {
  getAllTracks,
  getUserProgressSummary,
  getRecentlyVisited,
} from "../../services/systemDesignService";
import type {
  SystemDesignTrack,
  UserProgressSummary,
  RecentlyVisitedTopic,
} from "../../types/systemDesign";

export default function SystemDesignHomePage() {
  const navigate = useNavigate();
  const userId = Number(sessionStorage.getItem("userId") || 0);

  const [tracks, setTracks] = useState<SystemDesignTrack[]>([]);
  const [progressSummary, setProgressSummary] = useState<UserProgressSummary | null>(null);
  const [recentlyVisited, setRecentlyVisited] = useState<RecentlyVisitedTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlatformData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tracksData, summaryData, recentData] = await Promise.all([
          getAllTracks(userId),
          getUserProgressSummary(userId).catch(() => null),
          getRecentlyVisited(userId).catch(() => []),
        ]);

        setTracks(tracksData);
        if (summaryData) setProgressSummary(summaryData);
        if (recentData) setRecentlyVisited(recentData);
      } catch (err: unknown) {
        console.error("Failed to fetch System Design tracks:", err);
        setError("Unable to load System Design tracks. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadPlatformData();
  }, [userId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#060B13",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Navbar */}
      <SystemDesignNavbar progressSummary={progressSummary} />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          maxWidth: 1240,
          width: "100%",
          margin: "0 auto",
          padding: "48px 32px 80px",
        }}
      >
        {/* HERO SECTION */}
        <section style={{ marginBottom: 44 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 20,
              backgroundColor: "rgba(255, 138, 0, 0.08)",
              border: "1px solid rgba(255, 138, 0, 0.25)",
              color: "#FF8A00",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <FiZap style={{ fontSize: 13 }} />
            <span>JudgeX Architecture Platform</span>
          </div>

          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Master <span style={{ color: "#FF8A00" }}>System Design</span> & Software Architecture
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#9CA3AF",
              lineHeight: 1.65,
              maxWidth: 780,
            }}
          >
            Structured, step-by-step curriculum for Low-Level Design (LLD) and High-Level
            Design (HLD). Master OOP, SOLID principles, design patterns, UML diagrams, distributed
            systems, databases, caching, and scalable real-world architectures.
          </p>
        </section>

        {/* METRICS / STATS OVERVIEW BAR */}
        {progressSummary && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 18,
              marginBottom: 44,
            }}
          >
            {/* Stat 1: Topics Completed */}
            <div
              style={{
                backgroundColor: "#0B1322",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FiCheckCircle style={{ color: "#10B981", fontSize: 20 }} />
              </div>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" }}>
                  Completed Topics
                </span>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2 }}>
                  {progressSummary.totalTopicsCompleted}{" "}
                  <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
                    / {progressSummary.totalTopics}
                  </span>
                </p>
              </div>
            </div>

            {/* Stat 2: Overall Progress */}
            <div
              style={{
                backgroundColor: "#0B1322",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FiTrendingUp style={{ color: "#38BDF8", fontSize: 20 }} />
              </div>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" }}>
                  Curriculum Mastery
                </span>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#38BDF8", marginTop: 2 }}>
                  {progressSummary.overallProgressPercent.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Stat 3: Learning Time */}
            <div
              style={{
                backgroundColor: "#0B1322",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "rgba(139, 92, 246, 0.12)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FiClock style={{ color: "#8B5CF6", fontSize: 20 }} />
              </div>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" }}>
                  Time Invested
                </span>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 2 }}>
                  {progressSummary.totalTimeSpentMinutes} <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>mins</span>
                </p>
              </div>
            </div>

            {/* Stat 4: Learning Streak */}
            <div
              style={{
                backgroundColor: "#0B1322",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 16,
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: "rgba(255, 138, 0, 0.12)",
                  border: "1px solid rgba(255, 138, 0, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FaFire style={{ color: "#FF8A00", fontSize: 20 }} />
              </div>
              <div>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" }}>
                  Current Streak
                </span>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#FF8A00", marginTop: 2 }}>
                  {progressSummary.currentStreak} <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Days</span>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* RESUME LEARNING / RECENT ACTIVITY */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Continue Learning
            </h2>
          </div>
          <ContinueLearningCard recentTopics={recentlyVisited} />
        </section>

        {/* CORE LEARNING TRACKS */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.4px" }}>
              Core Architecture Tracks
            </h2>
            <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>
              Choose a track to dive into structured phases, theory, real-world case studies, and interview preparation.
            </p>
          </div>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
              }}
            >
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 340,
                    backgroundColor: "#0B1322",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6B7280",
                    fontSize: 14,
                  }}
                >
                  Loading track curriculum...
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              style={{
                padding: "36px",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 16,
                textAlign: "center",
                color: "#F87171",
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 600 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: 14,
                  padding: "8px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 24,
              }}
            >
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </section>

        {/* ARCHITECTURE ROADMAP OVERVIEW */}
        <section
          style={{
            backgroundColor: "#080E1A",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            padding: "32px 36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: "rgba(255, 138, 0, 0.12)",
                border: "1px solid rgba(255, 138, 0, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiCompass style={{ color: "#FF8A00", fontSize: 18 }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                How JudgeX System Design Works
              </h3>
              <p style={{ fontSize: 13, color: "#9CA3AF" }}>
                Comprehensive mastery model built for senior engineering & tech lead interviews
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginTop: 20,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(11, 19, 34, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FF8A00",
                  backgroundColor: "rgba(255, 138, 0, 0.1)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                STEP 1
              </span>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 10, marginBottom: 6 }}>
                Core Principles & Patterns
              </h4>
              <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>
                Master OOP, SOLID, and 23 Gang of Four design patterns in Java with concrete code implementations.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "rgba(11, 19, 34, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#38BDF8",
                  backgroundColor: "rgba(56, 189, 248, 0.1)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                STEP 2
              </span>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 10, marginBottom: 6 }}>
                Scalability & Distributed Systems
              </h4>
              <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>
                Explore database sharding, CAP theorem, message brokers, caching strategies, and microservice meshes.
              </p>
            </div>

            <div
              style={{
                backgroundColor: "rgba(11, 19, 34, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: 14,
                padding: "20px",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                STEP 3
              </span>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 10, marginBottom: 6 }}>
                Real-World System Case Studies
              </h4>
              <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.5 }}>
                End-to-end design architectures for URL Shortener, Uber, Netflix, Rate Limiters, and WhatsApp.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
