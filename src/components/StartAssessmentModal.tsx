import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startSession } from "../services/sessionService";

interface Props {
  onClose: () => void;
}

function StartAssessmentModal({ onClose }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setError("");
    setLoading(true);

    try {
      const userId = Number(sessionStorage.getItem("userId"));

      const session = await startSession("DSA", userId);

      // Navigate to question page with the new session ID
      navigate(`/assessment/${session.id}`);

    } catch (err) {
      setError("Failed to start session. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "24px",
      }}
    >
      {/* Modal card — stop click propagation so clicking inside doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#0B131F",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Category badge */}
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#FF8A00",
              textTransform: "uppercase",
              fontWeight: 600,
              backgroundColor: "rgba(255,138,0,0.1)",
              border: "1px solid rgba(255,138,0,0.25)",
              padding: "4px 12px",
              borderRadius: 20,
            }}
          >
            Online Assessment
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.5px",
            marginBottom: 24,
          }}
        >
          Start Mock Assessment
        </h2>

        {/* Info list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 32,
          }}
        >
          {[
            "Each session will include 2 questions.",
            "You will have 1 hour to complete all questions.",
            "Once a mock assessment session begins, you cannot pause the timer.",
            "The session will end when you submit all questions, time expires, or you end it manually.",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              {/* Bullet dot */}
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#FF8A00",
                  marginTop: 7,
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.65 }}>
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Good luck */}
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 32,
            fontStyle: "italic",
          }}
        >
          Good luck!
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 13,
              color: "#F87171",
            }}
          >
            {error}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "#9CA3AF",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
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

          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              flex: 2,
              padding: "12px 0",
              borderRadius: 10,
              border: "none",
              backgroundColor: loading ? "rgba(255,138,0,0.5)" : "#FF8A00",
              color: "#060B13",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#e07000";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#FF8A00";
            }}
          >
            {loading ? "Starting..." : "Start Mock Assessment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartAssessmentModal;