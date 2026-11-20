import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiBookOpen,
  FiCode,
  FiLayers,
  FiHelpCircle,
  FiTarget,
  FiCpu,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiChevronRight,
} from "react-icons/fi";
import SystemDesignNavbar from "../../components/system-design/SystemDesignNavbar";
import Footer from "../../components/Footer";
import {
  getTopicDetail,
  visitTopic,
  completeTopic,
} from "../../services/systemDesignService";
import type { SystemDesignTopicDetail} from "../../types/systemDesign";

type ContentTab =
  | "overview"
  | "theory"
  | "examples"
  | "diagrams"
  | "interviewQa"
  | "practice";

interface TabConfig {
  id: ContentTab;
  label: string;
  icon: React.ReactNode;
  field: keyof SystemDesignTopicDetail;
}

const TABS: TabConfig[] = [
  { id: "overview", label: "Overview", icon: <FiBookOpen />, field: "overviewContent" },
  { id: "theory", label: "Theory & Concepts", icon: <FiCpu />, field: "theoryContent" },
  { id: "examples", label: "Code Examples", icon: <FiCode />, field: "examplesContent" },
  { id: "diagrams", label: "Architecture Diagrams", icon: <FiLayers />, field: "diagramsContent" },
  { id: "interviewQa", label: "Interview Q&A", icon: <FiHelpCircle />, field: "interviewQaContent" },
  { id: "practice", label: "Practice Challenges", icon: <FiTarget />, field: "practiceContent" },
];

export default function TopicLearningPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = Number(sessionStorage.getItem("userId") || 0);

  const [topic, setTopic] = useState<SystemDesignTopicDetail | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Determine back URL based on route
  const isLldPath = location.pathname.includes("/lld");
  const isHldPath = location.pathname.includes("/hld");
  const fallbackBackUrl = isLldPath
    ? "/system-design/lld"
    : isHldPath
    ? "/system-design/hld"
    : topic?.trackType === "HLD"
    ? "/system-design/hld"
    : "/system-design/lld";

  useEffect(() => {
    if (!topicId) return;

    const numericTopicId = Number(topicId);
    if (isNaN(numericTopicId)) {
      setError("Invalid topic identifier");
      setLoading(false);
      return;
    }

    const loadTopic = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopicDetail(numericTopicId, userId);
        setTopic(data);
        setIsCompleted(data.status === "COMPLETED");

        // Record visit in background if userId is valid
        if (userId > 0) {
          visitTopic({ userId, topicId: numericTopicId }).catch((err) =>
            console.warn("Could not log topic visit:", err)
          );
        }
      } catch (err: unknown) {
        console.error("Failed to load topic details:", err);
        setError("Failed to load topic content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [topicId, userId]);

  const handleMarkComplete = async () => {
    if (!topic || isCompleting) return;

    setIsCompleting(true);
    try {
      if (userId > 0) {
        await completeTopic({
          userId,
          topicId: topic.id,
          durationMinutes: 15,
        });
      }
      setIsCompleted(true);
      setTopic((prev) => (prev ? { ...prev, status: "COMPLETED" } : null));
    } catch (err) {
      console.error("Failed to mark topic as completed:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCopyCode = (codeText: string, blockId: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(blockId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isLld = topic?.trackType === "LLD" || isLldPath;
  const theme = isLld
    ? {
        primary: "#FF8A00",
        secondary: "#FFA133",
        glow: "rgba(255, 138, 0, 0.2)",
        badgeBg: "rgba(255, 138, 0, 0.12)",
        badgeBorder: "rgba(255, 138, 0, 0.35)",
        tag: "LOW-LEVEL DESIGN",
      }
    : {
        primary: "#38BDF8",
        secondary: "#60A5FA",
        glow: "rgba(56, 189, 248, 0.2)",
        badgeBg: "rgba(56, 189, 248, 0.12)",
        badgeBorder: "rgba(56, 189, 248, 0.35)",
        tag: "HIGH-LEVEL DESIGN",
      };

  // Helper to render markdown-like content blocks cleanly
  const renderFormattedContent = (content: string | undefined) => {
    if (!content || !content.trim()) {
      return (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px dashed rgba(255, 255, 255, 0.1)",
            borderRadius: 14,
            color: "#9CA3AF",
          }}
        >
          <FiBookOpen style={{ fontSize: 32, color: "#6B7280", marginBottom: 12 }} />
          <h4 style={{ fontSize: 16, fontWeight: 600, color: "#E5E7EB", marginBottom: 6 }}>
            Content in Preparation
          </h4>
          <p style={{ fontSize: 13, color: "#6B7280", maxWidth: 440, margin: "0 auto" }}>
            The comprehensive guide for this tab is being curated by system design architects.
          </p>
        </div>
      );
    }

    // Split content into code blocks and text sections
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: Array<{ type: "code" | "text"; lang?: string; content: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.substring(lastIndex, match.index),
        });
      }
      parts.push({
        type: "code",
        lang: match[1] || "text",
        content: match[2],
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex),
      });
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {parts.map((part, index) => {
          if (part.type === "code") {
            const blockId = `code-block-${index}`;
            const isCopied = copiedCode === blockId;
            const isMermaid = (part.lang ?? "text").toLowerCase() === "mermaid";

            return (
              <div
                key={index}
                style={{
                  backgroundColor: "#060B13",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                }}
              >
                {/* Code Header Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10B981" }} />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: theme.primary,
                        marginLeft: 6,
                      }}
                    >
{isMermaid
  ? "Architecture Specification"
  : (part.lang ?? "CODE").toUpperCase()}                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(part.content, blockId)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: 6,
                      padding: "4px 10px",
                      color: isCopied ? "#10B981" : "#9CA3AF",
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isCopied ? <FiCheck style={{ fontSize: 13 }} /> : <FiCopy style={{ fontSize: 13 }} />}
                    <span>{isCopied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>

                {/* Code Content */}
                <pre
                  style={{
                    padding: "18px 20px",
                    margin: 0,
                    overflowX: "auto",
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: isMermaid ? "#38BDF8" : "#E2E8F0",
                    whiteSpace: "pre",
                  }}
                >
                  <code>{part.content.trim()}</code>
                </pre>
              </div>
            );
          }

          // Format Text Content (Markdown Headings, bullet lists, bold text)
          const lines = part.content.split("\n");
          return (
            <div key={index} style={{ color: "#D1D5DB", lineHeight: 1.75, fontSize: 15 }}>
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();

                if (trimmed.startsWith("# ")) {
                  return (
                    <h1
                      key={lIdx}
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#fff",
                        marginTop: lIdx === 0 ? 0 : 28,
                        marginBottom: 14,
                        letterSpacing: "-0.4px",
                      }}
                    >
                      {trimmed.replace("# ", "")}
                    </h1>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2
                      key={lIdx}
                      style={{
                        fontSize: 21,
                        fontWeight: 700,
                        color: "#fff",
                        marginTop: 24,
                        marginBottom: 12,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {trimmed.replace("## ", "")}
                    </h2>
                  );
                }
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3
                      key={lIdx}
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: theme.primary,
                        marginTop: 20,
                        marginBottom: 10,
                      }}
                    >
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const itemText = trimmed.substring(2);
                  return (
                    <div
                      key={lIdx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 8,
                        paddingLeft: 4,
                      }}
                    >
                      <span style={{ color: theme.primary, fontWeight: 800, lineHeight: 1.5 }}>•</span>
                      <span>{itemText}</span>
                    </div>
                  );
                }
                if (/^\d+\.\s/.test(trimmed)) {
                  const numberMatch = trimmed.match(/^(\d+\.)\s(.*)/);
                  return (
                    <div
                      key={lIdx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 8,
                        paddingLeft: 4,
                      }}
                    >
                      <span style={{ color: theme.primary, fontWeight: 700, minWidth: 20 }}>
                        {numberMatch?.[1]}
                      </span>
                      <span>{numberMatch?.[2]}</span>
                    </div>
                  );
                }
                if (trimmed === "") {
                  return <div key={lIdx} style={{ height: 10 }} />;
                }

                return (
                  <p key={lIdx} style={{ marginBottom: 12, color: "#9CA3AF" }}>
                    {line}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

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
            padding: 48,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.1)",
              borderTopColor: "#FF8A00",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ color: "#9CA3AF", fontSize: 14 }}>Loading topic workspace...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !topic) {
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
            padding: 48,
          }}
        >
          <FiAlertCircle style={{ fontSize: 52, color: "#F87171" }} />
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>{error || "Topic not found"}</h2>
          <p style={{ color: "#9CA3AF", fontSize: 14, maxWidth: 440, textAlign: "center" }}>
            The requested topic details could not be retrieved from the backend curriculum.
          </p>
          <button
            onClick={() => navigate(fallbackBackUrl)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 10,
              backgroundColor: "#FF8A00",
              color: "#060B13",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <FiArrowLeft style={{ fontSize: 14 }} />
            <span>Return to Track</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentTabContent = topic[TABS.find((t) => t.id === activeTab)?.field as keyof SystemDesignTopicDetail] as
    | string
    | undefined;

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
      {/* Top Main Navbar */}
      <SystemDesignNavbar activeTrack={topic.trackType} />

      {/* ── TOPIC HERO HEADER BAR ── */}
      <div
        style={{
          backgroundColor: "#080E1A",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "24px 48px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Breadcrumb Navigation & Back Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate(fallbackBackUrl)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 8,
                padding: "6px 14px",
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
              <span>Back to {topic.trackType === "HLD" ? "HLD" : "LLD"} Curriculum</span>
            </button>

            {/* Breadcrumb path */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              <span
                onClick={() => navigate("/system-design")}
                style={{ cursor: "pointer", color: "#9CA3AF" }}
              >
                System Design
              </span>
              <FiChevronRight style={{ fontSize: 11 }} />
              <span
                onClick={() => navigate(fallbackBackUrl)}
                style={{ cursor: "pointer", color: theme.primary, fontWeight: 600 }}
              >
                {topic.trackType} Track
              </span>
              <FiChevronRight style={{ fontSize: 11 }} />
              <span style={{ color: "#9CA3AF" }}>Phase {topic.phaseNumber}</span>
              <FiChevronRight style={{ fontSize: 11 }} />
              <span style={{ color: "#fff", fontWeight: 600 }}>{topic.title}</span>
            </div>
          </div>

          {/* Title, Subtitle & Action Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: theme.primary,
                    backgroundColor: theme.badgeBg,
                    border: `1px solid ${theme.badgeBorder}`,
                    padding: "3px 9px",
                    borderRadius: 6,
                    letterSpacing: "0.06em",
                  }}
                >
                  {theme.tag}
                </span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>
                  Phase {topic.phaseNumber}: {topic.phaseTitle}
                </span>
              </div>

              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.5px",
                  marginBottom: 6,
                }}
              >
                {topic.title}
              </h1>

              {topic.subtitle && (
                <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 820, lineHeight: 1.5 }}>
                  {topic.subtitle}
                </p>
              )}
            </div>

            {/* Mark as Complete Action */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleMarkComplete}
                disabled={isCompleting || isCompleted}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 10,
                  backgroundColor: isCompleted
                    ? "rgba(16, 185, 129, 0.15)"
                    : theme.primary,
                  border: isCompleted
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "none",
                  color: isCompleted ? "#10B981" : "#060B13",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isCompleted ? "default" : "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: isCompleted ? "none" : `0 0 16px ${theme.glow}`,
                }}
              >
                <FiCheckCircle style={{ fontSize: 15 }} />
                <span>{isCompleted ? "Topic Completed" : isCompleting ? "Saving..." : "Mark as Completed"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOPIC TABS NAVIGATION ── */}
      <div
        style={{
          backgroundColor: "#0B1322",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "sticky",
          top: 68,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "0 48px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            overflowX: "auto",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 18px",
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? theme.primary : "#9CA3AF",
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? `2px solid ${theme.primary}`
                    : "2px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#9CA3AF";
                }}
              >
                <span style={{ fontSize: 14 }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "36px 48px 64px",
          width: "100%",
          flex: 1,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "#0B1322",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 18,
            padding: "36px 40px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          {renderFormattedContent(currentTabContent)}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
