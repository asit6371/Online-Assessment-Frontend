import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { FaLayerGroup } from "react-icons/fa";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register({ name, email, password });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Email may already be in use.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#060B13",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── dot-grid top-right ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 520,
          height: 420,
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 80% 10%, rgba(255,138,0,0.13) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(rgba(255,138,0,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "right top",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 80% 20%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 80% 20%, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* ── dot-grid bottom-left ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 360,
          height: 300,
          opacity: 0.2,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(rgba(255,138,0,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 20% 80%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 20% 80%, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(6,11,19,0.9)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #FF8A00 60%, #e07000 100%)",
              borderRadius: 7,
              transform: "rotate(8deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaLayerGroup
              style={{ color: "#060B13", fontSize: 13, transform: "rotate(-8deg)" }}
            />
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
            Judge<span style={{ color: "#FF8A00" }}>X</span>
          </span>
        </div>
      </nav>

      {/* ── Centered card ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#0B131F",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,138,0,0.04)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.8px",
                marginBottom: 8,
              }}
            >
              Create account
            </h1>
            <p style={{ fontSize: 14, color: "#6B7280" }}>
              Join JudgeX and start practicing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>

            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#9CA3AF",
                  marginBottom: 7,
                }}
              >
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  backgroundColor: "#060B13",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#FF8A00")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#9CA3AF",
                  marginBottom: 7,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  backgroundColor: "#060B13",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#FF8A00")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#9CA3AF",
                  marginBottom: 7,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  backgroundColor: "#060B13",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#FF8A00")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

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

            {/* Success */}
            {success && (
              <div
                style={{
                  backgroundColor: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 20,
                  fontSize: 13,
                  color: "#4ADE80",
                }}
              >
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 0",
                backgroundColor: loading ? "rgba(255,138,0,0.5)" : "#FF8A00",
                border: "none",
                borderRadius: 10,
                color: "#060B13",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
                letterSpacing: "-0.2px",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#e07000";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#FF8A00";
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "24px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 12, color: "#4B5563" }}>or</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Login link */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#6B7280" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#FF8A00",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;