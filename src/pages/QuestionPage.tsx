import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { runCode } from "../services/judgeService";
import { getSession } from "../services/sessionService";
import { getQuestionById } from "../services/questionService";
import { submitCode } from "../services/submissionService";
import { FaLayerGroup } from "react-icons/fa";
import type { QuestionResponse } from "../types/question";
import type { JudgeResponse } from "../types/judge";
import type { SubmissionResponse } from "../types/submission";

function QuestionPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // Code starts empty — set to question.starterCode once question loads
  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<JudgeResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState("--:--:--");
  const [activeTab, setActiveTab] = useState<"run" | "submission">("run");
  const [leftTab, setLeftTab] = useState<"problem" | "submissions">("problem");
  const [showHint, setShowHint] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(
    "Welcome to JudgeX Online Judge.\nRun your code to see output here...\n>"
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tracks questionIds submitted with ACCEPTED verdict
  const [, setAcceptedQuestions] = useState<Set<number>>(new Set());

  // null = no modal, "congrats" = all done, "warning" = not complete
  const [modalType, setModalType] = useState<"congrats" | "warning" | null>(null);

  // true when timer fires the modal automatically — hides Cancel button
  const [timerExpired, setTimerExpired] = useState(false);

  const [questionStates, setQuestionStates] = useState<
    Record<
      number,
      {
        code: string;
        runResult: JudgeResponse | null;
        submissionResult: SubmissionResponse | null;
      }
    >
  >({});

  // Load session + first question
  useEffect(() => {
    const load = async () => {
      try {
        if (!sessionId) return;
        const session = await getSession(Number(sessionId));
        if (session.questionIds.length === 0) return;
        setQuestionIds(session.questionIds);
        const q = await getQuestionById(session.questionIds[0]);
        setQuestion(q);
        // Use starterCode from DB — never show the hardcoded Main template
        setCode(q.starterCode || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  // Timer — properly cleaned up
  useEffect(() => {
    const startTimer = async () => {
      if (!sessionId) return;
      try {
        const session = await getSession(Number(sessionId));
        if (!session.endTime) return;

        if (intervalRef.current) clearInterval(intervalRef.current);

        // Fix: append Z to tell browser endTime is UTC
        const endTimeStr = session.endTime.endsWith("Z")
          ? session.endTime
          : session.endTime + "Z";

        intervalRef.current = setInterval(() => {
          const now = new Date().getTime();
          const end = new Date(endTimeStr).getTime();
          const diff = end - now;

          if (diff <= 0) {
            setTimeLeft("00 : 00");
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimerExpired(true);
            setAcceptedQuestions((prev) => {
              setModalType(
                prev.size >= questionIds.length && questionIds.length > 0
                  ? "congrats"
                  : "warning"
              );
              return prev;
            });
            return;
          }

          const minutes = Math.floor(diff / 1000 / 60);
          const seconds = Math.floor((diff / 1000) % 60);

          setTimeLeft(
            `${minutes.toString().padStart(2, "0")} : ${seconds
              .toString()
              .padStart(2, "0")}`
          );
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    };
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionId]);

  const handleRunCode = async () => {
    if (!question) return;
    try {
      setRunning(true);
      setConsoleOutput("Running code...\n>");
      const result = await runCode({ questionId: question.id, code });
      setRunResult(result);
      setActiveTab("run");

      // Build console output
      const lines = [];
      for (let i = 0; i < result.totalTestCases; i++) {
        lines.push(
          `Test Case ${i + 1}: ${i < result.passedTestCases ? "Passed" : "Failed"}`
        );
      }
      if (result.passedTestCases === result.totalTestCases) {
        lines.push("\nAll test cases passed!");
      } else {
        lines.push(`\n${result.message || "Some test cases failed."}`);
      }
      setConsoleOutput(lines.join("\n") + "\n>");

      setQuestionStates((prev) => ({
        ...prev,
        [question.id]: {
          code,
          runResult: result,
          submissionResult: prev[question.id]?.submissionResult ?? null,
        },
      }));
    } catch (err) {
      console.error(err);
      setConsoleOutput("Error running code. Please try again.\n>");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!question || !sessionId) return;
    try {
      setSubmitting(true);
      const userId = Number(sessionStorage.getItem("userId"));
      const result = await submitCode({
        sessionId: Number(sessionId),
        questionId: question.id,
        userId,
        code,
      });
      setSubmissionResult(result);
      setActiveTab("submission");
      setConsoleOutput(
        `Submission result: ${result.verdict}\nPassed: ${result.passedTestCases}/${result.totalTestCases}\n>`
      );
      setQuestionStates((prev) => ({
        ...prev,
        [question.id]: {
          code,
          runResult: prev[question.id]?.runResult ?? null,
          submissionResult: result,
        },
      }));

      // Track accepted questions and check if all are done
      if (result.verdict === "ACCEPTED") {
        setAcceptedQuestions((prev) => {
          const updated = new Set(prev);
          updated.add(question.id);
          // All questions submitted correctly — show congrats
          if (updated.size >= questionIds.length && questionIds.length > 0) {
            setModalType("congrats");
          }
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const loadQuestion = async (questionId: number) => {
    try {
      const q = await getQuestionById(questionId);
      setQuestion(q);
      const saved = questionStates[questionId];
      if (saved) {
        setCode(saved.code);
        setRunResult(saved.runResult);
        setSubmissionResult(saved.submissionResult);
        if (saved.runResult) {
          const lines = [];
          for (let i = 0; i < saved.runResult.totalTestCases; i++) {
            lines.push(
              `Test Case ${i + 1}: ${
                i < saved.runResult.passedTestCases ? "Passed" : "Failed"
              }`
            );
          }
          setConsoleOutput(lines.join("\n") + "\n>");
        } else {
          setConsoleOutput(
            "Welcome to JudgeX Online Judge.\nRun your code to see output here...\n>"
          );
        }
      } else {
        // Fresh question — use starterCode from DB
        setCode(q.starterCode || "");
        setRunResult(null);
        setSubmissionResult(null);
        setConsoleOutput(
          "Welcome to JudgeX Online Judge.\nRun your code to see output here...\n>"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex >= questionIds.length - 1) return;
    const next = currentQuestionIndex + 1;
    setCurrentQuestionIndex(next);
    await loadQuestion(questionIds[next]);
  };

  const handlePrev = async () => {
    if (currentQuestionIndex <= 0) return;
    const prev = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prev);
    await loadQuestion(questionIds[prev]);
  };

  const userName = sessionStorage.getItem("name") || "U";
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0D1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
        }}
      >
        Loading assessment...
      </div>
    );
  }

  if (!question) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0D1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Question not found.
      </div>
    );
  }

  const difficultyColor =
    question.difficulty === "EASY"
      ? { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" }
      : question.difficulty === "MEDIUM"
      ? { color: "#FBBF24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)" }
      : { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#0D1117",
        color: "#E6EDF3",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ══════════════ TOP NAVBAR ══════════════ */}
      <div
        style={{
          height: 56,
          backgroundColor: "#161B22",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        {/* LEFT: Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                background: "linear-gradient(135deg, #FF8A00 60%, #e07000 100%)",
                borderRadius: 6,
                transform: "rotate(8deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaLayerGroup
                style={{ color: "#0D1117", fontSize: 11, transform: "rotate(-8deg)" }}
              />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              Assess<span style={{ color: "#FF8A00" }}>Mate</span>
            </span>
          </div>

          <div
            style={{
              width: 1,
              height: 20,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />

          <span style={{ fontSize: 13, color: "#8B949E", fontWeight: 500 }}>
            DSA Mock Assessment
          </span>
        </div>

        {/* CENTER: Timer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#0D1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "6px 20px",
            minWidth: 160,
          }}
        >
          <span style={{ fontSize: 10, color: "#8B949E", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
            Time Left
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: timeLeft === "00 : 00 : 00" ? "#F87171" : "#FF8A00",
              letterSpacing: "0.05em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {timeLeft}
          </span>
        </div>

        {/* RIGHT: Question nav + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Question navigator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#0D1117",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              style={{
                background: "none",
                border: "none",
                color: currentQuestionIndex === 0 ? "#4B5563" : "#E6EDF3",
                cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                fontSize: 14,
                padding: "0 4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              ‹ Previous
            </button>

            <div
              style={{
                width: 1,
                height: 16,
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            />

            <span style={{ fontSize: 13, color: "#8B949E", padding: "0 4px" }}>
              Question{" "}
              <span style={{ color: "#E6EDF3", fontWeight: 600 }}>
                {currentQuestionIndex + 1}
              </span>{" "}
              of{" "}
              <span style={{ color: "#E6EDF3", fontWeight: 600 }}>
                {questionIds.length}
              </span>
            </span>

            <div
              style={{
                width: 1,
                height: 16,
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            />

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questionIds.length - 1}
              style={{
                background: "none",
                border: "none",
                color:
                  currentQuestionIndex === questionIds.length - 1
                    ? "#4B5563"
                    : "#E6EDF3",
                cursor:
                  currentQuestionIndex === questionIds.length - 1
                    ? "not-allowed"
                    : "pointer",
                fontSize: 14,
                padding: "0 4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Next ›
            </button>
          </div>

          {/* Exit Assessment button */}
          <button
            onClick={() => {
              setTimerExpired(false);
              setAcceptedQuestions((prev) => {
                setModalType(prev.size >= questionIds.length && questionIds.length > 0 ? "congrats" : "warning");
                return prev;
              });
            }}
            style={{
              padding: "7px 16px",
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 8,
              color: "#F87171",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")
            }
          >
            Exit
          </button>

          {/* Profile avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF8A00, #e07000)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#0D1117",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {getInitials(userName)}
          </div>
        </div>
      </div>

      {/* ══════════════ MAIN 3-PANEL LAYOUT ══════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          gap: 0,
        }}
      >
        {/* ── LEFT PANEL: Problem ── */}
        <div
          style={{
            width: 320,
            flexShrink: 0,
            backgroundColor: "#0D1117",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}
          >
            {(["problem", "submissions"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "none",
                  border: "none",
                  borderBottom: leftTab === tab ? "2px solid #FF8A00" : "2px solid transparent",
                  color: leftTab === tab ? "#FF8A00" : "#8B949E",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "color 0.2s",
                }}
              >
                {tab === "problem" ? "Problem" : "Submissions"}
              </button>
            ))}
          </div>

          {/* Problem content */}
          {leftTab === "problem" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 32px" }}>
              {/* Question number + title */}
              <div style={{ marginBottom: 14 }}>
                <h1
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#E6EDF3",
                    lineHeight: 1.3,
                    marginBottom: 10,
                  }}
                >
                  {currentQuestionIndex + 1}. {question.title}
                </h1>

                {/* Badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: difficultyColor.color,
                      backgroundColor: difficultyColor.bg,
                      border: `1px solid ${difficultyColor.border}`,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {question.difficulty.charAt(0) + question.difficulty.slice(1).toLowerCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#8B949E",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {question.topic.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: "#C9D1D9",
                  lineHeight: 1.75,
                  marginBottom: 20,
                }}
              >
                {question.description}
              </p>

              {/* Example 1 */}
              {question.sampleInput && (
                <div style={{ marginBottom: 16 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#E6EDF3",
                      marginBottom: 8,
                    }}
                  >
                    Example 1:
                  </p>
                  <div
                    style={{
                      backgroundColor: "#161B22",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      padding: "12px 14px",
                    }}
                  >
                    <p style={{ fontSize: 12, color: "#8B949E", marginBottom: 4 }}>
                      <span style={{ color: "#C9D1D9", fontWeight: 600 }}>Input: </span>
                      <code style={{ color: "#79C0FF" }}>{question.sampleInput}</code>
                    </p>
                    <p style={{ fontSize: 12, color: "#8B949E" }}>
                      <span style={{ color: "#C9D1D9", fontWeight: 600 }}>Output: </span>
                      <code style={{ color: "#79C0FF" }}>{question.sampleOutput}</code>
                    </p>
                  </div>
                </div>
              )}

              {/* Constraints */}
              {question.constraints && (
                <div style={{ marginBottom: 20 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#E6EDF3",
                      marginBottom: 8,
                    }}
                  >
                    Constraints:
                  </p>
                  <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
                    {question.constraints.split("\n").map((line, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: 12,
                          color: "#8B949E",
                          lineHeight: 1.8,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <span style={{ color: "#FF8A00", marginTop: 2, flexShrink: 0 }}>•</span>
                        <code style={{ color: "#C9D1D9" }}>{line}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hint toggle */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  paddingTop: 16,
                }}
              >
                <button
                  onClick={() => setShowHint((p) => !p)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#8B949E",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>💡</span> Hint
                  </span>
                  <span style={{ fontSize: 16 }}>{showHint ? "∧" : "∨"}</span>
                </button>
                {showHint && (
                  <p
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: "#8B949E",
                      lineHeight: 1.7,
                      backgroundColor: "rgba(255,138,0,0.06)",
                      border: "1px solid rgba(255,138,0,0.15)",
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}
                  >
                    Think about what data structure would allow you to look up values in O(1) time.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submissions tab */}
          {leftTab === "submissions" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4B5563",
                fontSize: 13,
              }}
            >
              No submissions yet.
            </div>
          )}
        </div>

        {/* ── CENTER PANEL: Editor ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Editor toolbar */}
          <div
            style={{
              height: 44,
              backgroundColor: "#161B22",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              flexShrink: 0,
            }}
          >
            {/* Language selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#0D1117",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: 13,
                color: "#E6EDF3",
                cursor: "default",
              }}
            >
              <span style={{ fontSize: 11 }}>☕</span>
              Java (17)
              <span style={{ color: "#4B5563", fontSize: 10 }}>▼</span>
            </div>

            {/* Right icons */}
            <div style={{ display: "flex", gap: 8 }}>
              {["☀", "⛶"].map((icon, i) => (
                <button
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    color: "#8B949E",
                    cursor: "pointer",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "#E6EDF3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#8B949E";
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Editor
              height="100%"
              language="java"
              theme="vs-dark"
              value={code}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 12 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
              }}
              onChange={(value) => {
                const updated = value ?? "";
                setCode(updated);
                if (question) {
                  setQuestionStates((prev) => ({
                    ...prev,
                    [question.id]: {
                      code: updated,
                      runResult: prev[question.id]?.runResult ?? null,
                      submissionResult: prev[question.id]?.submissionResult ?? null,
                    },
                  }));
                }
              }}
            />
          </div>

          {/* Bottom action bar */}
          <div
            style={{
              height: 60,
              backgroundColor: "#161B22",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 16px",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <button
              onClick={handleRunCode}
              disabled={running}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 28px",
                backgroundColor: running ? "rgba(255,255,255,0.05)" : "#1F6FEB",
                border: "none",
                borderRadius: 8,
                color: running ? "#4B5563" : "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: running ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!running) e.currentTarget.style.backgroundColor = "#1a5fd4";
              }}
              onMouseLeave={(e) => {
                if (!running) e.currentTarget.style.backgroundColor = "#1F6FEB";
              }}
            >
              <span style={{ fontSize: 13 }}>▶</span>
              {running ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={handleSubmitCode}
              disabled={submitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 28px",
                backgroundColor: submitting ? "rgba(255,255,255,0.05)" : "#238636",
                border: "none",
                borderRadius: 8,
                color: submitting ? "#4B5563" : "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!submitting) e.currentTarget.style.backgroundColor = "#1e7a2f";
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.currentTarget.style.backgroundColor = "#238636";
              }}
            >
              <span style={{ fontSize: 13 }}>⬆</span>
              {submitting ? "Submitting..." : "Submit Code"}
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: Results ── */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            backgroundColor: "#0D1117",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}
          >
            {(["run", "submission"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === tab ? "2px solid #1F6FEB" : "2px solid transparent",
                  color: activeTab === tab ? "#1F6FEB" : "#8B949E",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                {tab === "run" ? "Run" : "Submission"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* RUN tab */}
            {activeTab === "run" && (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                {!runResult ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#4B5563",
                      fontSize: 13,
                      paddingTop: 40,
                    }}
                  >
                    Run your code to see test results
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#E6EDF3" }}>
                        Test Cases
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color:
                            runResult.passedTestCases === runResult.totalTestCases
                              ? "#4ADE80"
                              : "#F87171",
                        }}
                      >
                        {runResult.passedTestCases} / {runResult.totalTestCases} Passed
                      </span>
                    </div>

                    {/* Test case items */}
                    {Array.from({ length: runResult.totalTestCases }).map((_, i) => {
                      const passed = i < runResult.passedTestCases;
                      return (
                        <div
                          key={i}
                          style={{
                            backgroundColor: "#161B22",
                            border: `1px solid ${
                              passed
                                ? "rgba(74,222,128,0.2)"
                                : "rgba(248,113,113,0.2)"
                            }`,
                            borderRadius: 8,
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: passed
                                ? "rgba(74,222,128,0.15)"
                                : "rgba(248,113,113,0.15)",
                              border: `1px solid ${passed ? "#4ADE80" : "#F87171"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              color: passed ? "#4ADE80" : "#F87171",
                              flexShrink: 0,
                            }}
                          >
                            {passed ? "✓" : "✗"}
                          </span>
                          <span style={{ fontSize: 13, color: "#C9D1D9", fontWeight: 500 }}>
                            Test Case {i + 1}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: 12,
                              color: passed ? "#4ADE80" : "#F87171",
                              fontWeight: 600,
                            }}
                          >
                            {passed ? "Passed" : "Failed"}
                          </span>
                        </div>
                      );
                    })}

                    {/* Verdict badge */}
                    <div
                      style={{
                        backgroundColor: "#161B22",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#8B949E" }}>Verdict</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color:
                            runResult.verdict === "ACCEPTED" ? "#4ADE80" : "#F87171",
                        }}
                      >
                        {runResult.verdict}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* SUBMISSION tab */}
            {activeTab === "submission" && (
              <div style={{ padding: 16 }}>
                {!submissionResult ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#4B5563",
                      fontSize: 13,
                      paddingTop: 40,
                    }}
                  >
                    Submit your code to see results
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div
                      style={{
                        backgroundColor: "#161B22",
                        border: `1px solid ${
                          submissionResult.verdict === "ACCEPTED"
                            ? "rgba(74,222,128,0.2)"
                            : "rgba(248,113,113,0.2)"
                        }`,
                        borderRadius: 8,
                        padding: "14px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color:
                            submissionResult.verdict === "ACCEPTED"
                              ? "#4ADE80"
                              : "#F87171",
                          marginBottom: 8,
                        }}
                      >
                        {submissionResult.verdict}
                      </p>
                      <p style={{ fontSize: 12, color: "#8B949E" }}>
                        Passed:{" "}
                        <span style={{ color: "#C9D1D9" }}>
                          {submissionResult.passedTestCases}/
                          {submissionResult.totalTestCases}
                        </span>
                      </p>
                      <p style={{ fontSize: 12, color: "#8B949E", marginTop: 4 }}>
                        Submitted:{" "}
                        <span style={{ color: "#C9D1D9" }}>
                          {new Date(submissionResult.submittedAt).toLocaleTimeString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Console — always visible at bottom */}
            <div
              style={{
                marginTop: "auto",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={{ fontSize: 12, color: "#8B949E", fontWeight: 600 }}>
                  Console
                </span>
                <button
                  onClick={() =>
                    setConsoleOutput(
                      "Welcome to JudgeX Online Judge.\nRun your code to see output here...\n>"
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4B5563",
                    fontSize: 11,
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#8B949E")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
                >
                  Clear
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "12px 16px",
                  fontSize: 12,
                  color: "#4ADE80",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineHeight: 1.7,
                  minHeight: 100,
                  maxHeight: 160,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {consoleOutput}
              </pre>
            </div>
          </div>
        </div>
      </div>
      {/* ══════════════ MODALS ══════════════ */}
      {modalType && (
        <div
          onClick={() => {
            // Only close on backdrop click if it's a warning with Cancel available
            if (modalType === "warning" && !timerExpired) setModalType(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#161B22",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "40px 36px",
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              textAlign: "center",
            }}
          >
            {modalType === "congrats" ? (
              <>
                {/* Congrats modal */}
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#4ADE80",
                    letterSpacing: "-0.5px",
                    marginBottom: 12,
                  }}
                >
                  Assessment Complete!
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                    lineHeight: 1.7,
                    marginBottom: 32,
                  }}
                >
                  Congratulations! You have successfully completed your
                  assessment. Best of luck for your future!
                </p>
                <button
                  onClick={() => navigate("/")}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: 10,
                    border: "1px solid rgba(239,68,68,0.4)",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    color: "#F87171",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")
                  }
                >
                  Exit Assessment
                </button>
              </>
            ) : (
              <>
                {/* Warning modal */}
                <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#FBBF24",
                    letterSpacing: "-0.5px",
                    marginBottom: 12,
                  }}
                >
                  {timerExpired ? "Time's Up!" : "Assessment Not Complete"}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                    lineHeight: 1.7,
                    marginBottom: 32,
                  }}
                >
                  {timerExpired
                    ? "Your time has expired and you haven't submitted correct answers for all questions."
                    : "You haven't submitted correct answers for all questions yet. Are you sure you want to exit?"}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                  }}
                >
                  {/* Cancel only shown when user manually clicked Exit */}
                  {!timerExpired && (
                    <button
                      onClick={() => setModalType(null)}
                      style={{
                        flex: 1,
                        padding: "11px 0",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "transparent",
                        color: "#9CA3AF",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "border-color 0.2s, color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "#9CA3AF";
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    style={{
                      flex: timerExpired ? undefined : 1,
                      width: timerExpired ? "100%" : undefined,
                      padding: "11px 0",
                      borderRadius: 10,
                      border: "1px solid rgba(239,68,68,0.4)",
                      backgroundColor: "rgba(239,68,68,0.1)",
                      color: "#F87171",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")
                    }
                  >
                    {timerExpired ? "OK" : "Exit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;