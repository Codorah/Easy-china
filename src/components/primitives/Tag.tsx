// @ts-nocheck
import { useState } from "react";

export function Tag({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(201, 48, 44, 0.1)" : "rgba(201, 48, 44, 0.05)",
        color: 'var(--accent)',
        border: `1px solid rgba(201, 48, 44, ${hov ? 0.35 : 0.18})`,
        padding: "0.45rem 1rem",
        borderRadius: 20,
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
        cursor: "default",
      }}
    >
      {children}
    </span>
  );
}
