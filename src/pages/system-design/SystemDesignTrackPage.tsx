import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiAlertCircle } from "react-icons/fi";
import SystemDesignNavbar from "../../components/system-design/SystemDesignNavbar";
import TrackHeader from "../../components/system-design/TrackHeader";
import PhaseAccordion from "../../components/system-design/PhaseAccordion";
import Footer from "../../components/Footer";
import {
  getAllTracks,
  getPhasesByTrack,
  getUserProgressSummary,
} from "../../services/systemDesignService";
import type {
  SystemDesignTrack,
  SystemDesignPhase,
  UserProgressSummary,
  TrackType,
} from "../../types/systemDesign";

export default function SystemDesignTrackPage() {
  const { trackId } = useParams<{ trackId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = Number(sessionStorage.getItem("userId") || 0);

  // Determine intended track type from URL path
  const isLldPath = location.pathname.includes("/lld");
  const isHldPath = location.pathname.includes("/hld");
  const targetTrackType: TrackType | null = isLldPath
    ? "LLD"
    : isHldPath
    ? "HLD"
    : null;

  const [tracks, setTracks] = useState<SystemDesignTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SystemDesignTrack | null>(null);
  const [phases, setPhases] = useState<SystemDesignPhase[]>([]);
  const [progressSummary, setProgressSummary] = useState<UserProgressSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED">("ALL");

  const [loading, setLoading] = useState(true);
  const [loadingPhases, setLoadingPhases] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch tracks and user progress summary
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tracksData, summary] = await Promise.all([
          getAllTracks(userId),
          getUserProgressSummary(userId).catch(() => null),
        ]);

        setTracks(tracksData);
        if (summary) setProgressSummary(summary);

        // Dynamically resolve target track
        let resolvedTrack: SystemDesignTrack | undefined;

        if (trackId) {
          resolvedTrack = tracksData.find((t) => t.id === Number(trackId));
        } else if (targetTrackType) {
          resolvedTrack = tracksData.find((t) => t.trackType === targetTrackType);
        }

        // Fallback to first track if not found
        if (!resolvedTrack && tracksData.length > 0) {
          resolvedTrack = tracksData[0];
        }

        if (resolvedTrack) {
          setCurrentTrack(resolvedTrack);
        } else {
          setError("No System Design track found.");
        }
      } catch (err: unknown) {
        console.error("Failed to load System Design track:", err);
        setError("Failed to load track information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [trackId, targetTrackType, userId]);

  // 2. Fetch phases when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;

    const fetchPhases = async () => {
      setLoadingPhases(true);
      try {
        const phaseData = await getPhasesByTrack(currentTrack.id, userId);
        setPhases(phaseData);
      } catch (err: unknown) {
        console.error("Failed to fetch phases:", err);
      } finally {
        setLoadingPhases(false);
      }
    };

    fetchPhases();
  }, [currentTrack, userId]);

  // Handle topic click -> navigate to topic learning workspace
  const handleSelectTopic = (topicId: number) => {
    const trackSlug = currentTrack?.trackType === "HLD" ? "hld" : "lld";
    navigate(`/system-design/${trackSlug}/topic/${topicId}`);
  };

  // Filter phases based on search query and status filter
  const filteredPhases = phases.filter((phase) => {
    const matchesSearch =
      phase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "COMPLETED") {
      return (
        phase.phaseStatus === "COMPLETED" ||
        (phase.completedTopics >= phase.totalTopics && phase.totalTopics > 0)
      );
    }
    if (statusFilter === "IN_PROGRESS") {
      return (
        phase.phaseStatus === "IN_PROGRESS" ||
        (phase.completedTopics > 0 && phase.completedTopics < phase.totalTopics)
      );
    }
    if (statusFilter === "NOT_STARTED") {
      return (
        phase.phaseStatus === "NOT_STARTED" || phase.completedTopics === 0
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#060B13",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <SystemDesignNavbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(255, 138, 0, 0.2)",
              borderTopColor: "#FF8A00",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#9CA3AF", fontSize: 15 }}>Loading Curriculum Track...</p>
        </div>
      </div>
    );
  }

  if (error || !currentTrack) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#060B13",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <SystemDesignNavbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: 32,
          }}
        >
          <FiAlertCircle style={{ fontSize: 48, color: "#F87171" }} />
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>
            {error || "Track not found"}
          </h2>
          <button
            onClick={() => navigate("/system-design")}
            style={{
              padding: "10px 22px",
              borderRadius: 10,
              backgroundColor: "#FF8A00",
              color: "#060B13",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to System Design
          </button>
        </div>
      </div>
    );
  }

  const isLld = currentTrack.trackType === "LLD";
  const themeColor = isLld ? "#FF8A00" : "#38BDF8";

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
      {/* Navbar */}
      <SystemDesignNavbar
        progressSummary={progressSummary}
        activeTrack={currentTrack.trackType}
      />

      {/* Dynamic Track Header */}
      <TrackHeader track={currentTrack} allTracks={tracks} />

      {/* Main Track Curriculum Body */}
      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "36px 32px 80px",
        }}
      >
        {/* Search & Filter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#0B1322",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 12,
              padding: "10px 16px",
              flex: "1 1 320px",
              maxWidth: 440,
            }}
          >
            <FiSearch style={{ color: "#6B7280", fontSize: 16 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phases or topics..."
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 14,
                width: "100%",
                outline: "none",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {(
              [
                { label: "All Phases", value: "ALL" },
                { label: "In Progress", value: "IN_PROGRESS" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Not Started", value: "NOT_STARTED" },
              ] as const
            ).map((filter) => {
              const active = statusFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    backgroundColor: active
                      ? isLld
                        ? "rgba(255, 138, 0, 0.15)"
                        : "rgba(56, 189, 248, 0.15)"
                      : "#0B1322",
                    color: active ? themeColor : "#9CA3AF",
                    border: active
                      ? `1px solid ${isLld ? "rgba(255, 138, 0, 0.35)" : "rgba(56, 189, 248, 0.35)"}`
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase List */}
        {loadingPhases ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
            <p>Loading curriculum phases...</p>
          </div>
        ) : filteredPhases.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              backgroundColor: "#0B1322",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <p style={{ color: "#9CA3AF", fontSize: 15 }}>
              No phases match the current filter or search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              style={{
                marginTop: 14,
                padding: "8px 18px",
                borderRadius: 8,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {filteredPhases.map((phase, idx) => (
              <PhaseAccordion
                key={phase.id}
                phase={phase}
                trackType={currentTrack.trackType}
                userId={userId}
                isInitiallyExpanded={idx === 0 || phase.completedTopics > 0}
                onSelectTopic={handleSelectTopic}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
