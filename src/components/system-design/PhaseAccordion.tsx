import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiCircle,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import type {
  SystemDesignPhase,
  SystemDesignTopicSummary,
  TrackType,
} from "../../types/systemDesign";
import { getTopicsByPhase } from "../../services/systemDesignService";

interface PhaseAccordionProps {
  phase: SystemDesignPhase;
  trackType: TrackType;
  userId: number;
  isInitiallyExpanded?: boolean;
  onSelectTopic?: (topicId: number) => void;
}

export default function PhaseAccordion({
  phase,
  trackType,
  userId,
  isInitiallyExpanded = false,
  onSelectTopic,
}: PhaseAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [topics, setTopics] = useState<SystemDesignTopicSummary[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const isLld = trackType === "LLD";
  const themePrimary = isLld ? "#FF8A00" : "#38BDF8";
  const themeBadgeBg = isLld ? "rgba(255, 138, 0, 0.1)" : "rgba(56, 189, 248, 0.1)";

  // Load topics dynamically when expanded
  useEffect(() => {
    if (isExpanded && !loadedOnce) {
      const fetchTopics = async () => {
        setLoadingTopics(true);
        try {
          const data = await getTopicsByPhase(phase.id, userId);
          setTopics(data);
          setLoadedOnce(true);
        } catch (err) {
          console.error("Failed to load topics for phase", phase.id, err);
        } finally {
          setLoadingTopics(false);
        }
      };
      fetchTopics();
    }
  }, [isExpanded, phase.id, userId, loadedOnce]);

  const getStatusBadge = () => {
    if (phase.phaseStatus === "COMPLETED" || phase.completedTopics >= phase.totalTopics && phase.totalTopics > 0) {
      return (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "3px 9px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <FiCheckCircle style={{ fontSize: 12 }} />
          Completed
        </span>
      );
    }
    if (phase.phaseStatus === "IN_PROGRESS" || phase.completedTopics > 0) {
      return (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: themePrimary,
            backgroundColor: themeBadgeBg,
            border: `1px solid ${isLld ? "rgba(255, 138, 0, 0.3)" : "rgba(56, 189, 248, 0.3)"}`,
            padding: "3px 9px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <FiClock style={{ fontSize: 12 }} />
          In Progress
        </span>
      );
    }
    return (
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#9CA3AF",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "3px 9px",
          borderRadius: 6,
        }}
      >
        Not Started
      </span>
    );
  };

  const formattedPhaseNumber =
    phase.phaseNumber < 10 ? `0${phase.phaseNumber}` : `${phase.phaseNumber}`;

  return (
    <div
      style={{
        backgroundColor: "#0B1322",
        border: isExpanded
          ? `1px solid ${isLld ? "rgba(255, 138, 0, 0.35)" : "rgba(56, 189, 248, 0.35)"}`
          : "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        boxShadow: isExpanded
          ? `0 8px 28px ${isLld ? "rgba(255,138,0,0.08)" : "rgba(56,189,248,0.08)"}`
          : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* PHASE HEADER / ACCORDION TRIGGER */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{
          padding: "20px 24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: isExpanded ? "rgba(255, 255, 255, 0.02)" : "transparent",
          userSelect: "none",
        }}
      >
        {/* Left: Phase Number Badge & Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: themeBadgeBg,
              border: `1px solid ${isLld ? "rgba(255, 138, 0, 0.28)" : "rgba(56, 189, 248, 0.28)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              color: themePrimary,
              flexShrink: 0,
            }}
          >
            {formattedPhaseNumber}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
                {phase.title}
              </h3>
              {getStatusBadge()}
            </div>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>{phase.subtitle}</p>
          </div>
        </div>

        {/* Right: Topic Count, Progress Pill & Chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#E5E7EB" }}>
              {phase.completedTopics} / {phase.totalTopics} Topics
            </span>
            <div
              style={{
                width: 100,
                height: 4,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 4,
                overflow: "hidden",
                marginTop: 5,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${phase.totalTopics > 0 ? (phase.completedTopics / phase.totalTopics) * 100 : 0}%`,
                  backgroundColor: themePrimary,
                }}
              />
            </div>
          </div>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9CA3AF",
            }}
          >
            {isExpanded ? (
              <FiChevronUp style={{ fontSize: 16 }} />
            ) : (
              <FiChevronDown style={{ fontSize: 16 }} />
            )}
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT: TOPIC LIST */}
      {isExpanded && (
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "16px 24px 20px",
            backgroundColor: "rgba(6, 11, 19, 0.4)",
          }}
        >
          {loadingTopics ? (
            <div
              style={{
                padding: "24px 0",
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: 13,
              }}
            >
              Loading topics...
            </div>
          ) : topics.length === 0 ? (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                color: "#6B7280",
                fontSize: 13,
              }}
            >
              Topics for this phase will be available shortly.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topics.map((topic, index) => {
                const isCompleted = topic.status === "COMPLETED";
                const isInProgress = topic.status === "IN_PROGRESS";

                return (
                  <div
                    key={topic.id}
                    onClick={() => onSelectTopic && onSelectTopic(topic.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      backgroundColor: "rgba(11, 19, 34, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 12,
                      cursor: onSelectTopic ? "pointer" : "default",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = isLld
                        ? "rgba(255, 138, 0, 0.4)"
                        : "rgba(56, 189, 248, 0.4)";
                      e.currentTarget.style.backgroundColor = isLld
                        ? "rgba(255, 138, 0, 0.04)"
                        : "rgba(56, 189, 248, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                      e.currentTarget.style.backgroundColor = "rgba(11, 19, 34, 0.6)";
                    }}
                  >
                    {/* Left: Index, Status icon & Topic Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#6B7280",
                          width: 20,
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </span>

                      {/* Status Icon */}
                      {isCompleted ? (
                        <FiCheckCircle style={{ color: "#10B981", fontSize: 16 }} />
                      ) : isInProgress ? (
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            border: `2px solid ${themePrimary}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: themePrimary,
                            }}
                          />
                        </div>
                      ) : (
                        <FiCircle style={{ color: "#4B5563", fontSize: 15 }} />
                      )}

                      <div>
                        <h4
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          {topic.title}
                        </h4>
                        {topic.subtitle && (
                          <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                            {topic.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Tag / Action */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {isCompleted && (
                        <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>
                          Completed
                        </span>
                      )}
                      {isInProgress && (
                        <span style={{ fontSize: 12, color: themePrimary, fontWeight: 600 }}>
                          In Progress
                        </span>
                      )}
                      {!isCompleted && !isInProgress && (
                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                          Not Started
                        </span>
                      )}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: themePrimary,
                        }}
                      >
                        <span>Learn</span>
                        <FiArrowRight style={{ fontSize: 13 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
