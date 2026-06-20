// @ts-nocheck
import { useState } from "react";

export function GoldenBtn({ children, variant = "solid", onClick, style = {}, disabled = false, ariaLabel }) {
  const [isHovered, setIsHovered] = useState(false);

  const base = {
    border: "none",
    borderRadius: "var(--radius-full)",
    padding: "0.75rem 2rem",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    fontFamily: "var(--font-body)",
    letterSpacing: "0.02em",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "background 0.15s, box-shadow 0.15s, transform 0.15s",
    transform: isHovered && !disabled ? "translateY(-1px)" : "translateY(0)",
    opacity: disabled ? 0.55 : 1,
    outline: "none",
    userSelect: "none",
  };

  let variantStyle = {};
  if (variant === "solid" || variant === "glow") {
    variantStyle = {
      background: isHovered && !disabled ? "var(--accent-strong)" : "var(--accent)",
      color: "#fff",
      boxShadow: isHovered && !disabled ? "var(--shadow-accent)" : "var(--shadow-sm)",
    };
  } else if (variant === "outline") {
    variantStyle = {
      background: "transparent",
      color: "var(--accent)",
      border: "2px solid var(--accent)",
    };
  } else if (variant === "ghost") {
    variantStyle = {
      background: "transparent",
      color: "var(--text)",
    };
  } else if (variant === "white") {
    variantStyle = {
      background: "#ffffff",
      color: "var(--accent)",
      boxShadow: "var(--shadow-sm)",
    };
  }

  return (
    <button
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variantStyle, ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
