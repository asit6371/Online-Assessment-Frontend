import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="relative z-10"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "#060B13",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 48px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#6B7280",
        }}
      >
        <span>© 2026 JudgeX. All rights reserved. Version 1.0.2</span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
            <span
              key={item}
              className="cursor-pointer transition-colors"
              onClick={() => {
                if (item === "Privacy Policy") navigate("/privacy-policy");
                if (item === "Terms of Service") navigate("/terms");
                if (item === "Contact Us") navigate("/contact");
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
