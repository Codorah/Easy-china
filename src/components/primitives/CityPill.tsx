// @ts-nocheck
import { useState } from "react";

export function CityPill({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(201, 48, 44, 0.07)" : "var(--surface-alt)",
        border: `1px solid ${hov ? "var(--accent)" : "var(--border)"}`,
        padding: "0.45rem 1.25rem",
        borderRadius: 30,
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        color: hov ? "var(--accent)" : "var(--text)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 4px 15px rgba(201,48,44,0.1)" : "none",
        transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
        cursor: "default"
      }}
    >
      {children}
    </span>
  );
}
