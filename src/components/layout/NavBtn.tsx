// @ts-nocheck
import { useState } from "react";

export function NavBtn({ label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active ? "var(--accent-soft)" : hov ? "rgba(26,20,16,0.04)" : "none",
        border: "none",
        color: active ? "var(--accent)" : hov ? "var(--text)" : "var(--muted)",
        cursor: "pointer",
        padding: "0.5rem 1rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        fontFamily: "var(--font-body)",
        transition: "color 0.15s, background 0.15s",
        position: "relative",
        minHeight: 44,
        minWidth: 44,
      }}
    >
      {label}
      {/* Underline -- scaleX draw, GPU-composited */}
      <span style={{
        position: "absolute",
        bottom: 6,
        left: "10%",
        width: "80%",
        height: 2,
        background: "var(--accent)",
        borderRadius: 2,
        transform: active || hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 0.18s ease",
      }} />
    </button>
  );
}
