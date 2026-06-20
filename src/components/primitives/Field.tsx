// @ts-nocheck
import { useState } from "react";

export function Field({ label, type = "text", value, onChange, placeholder, options, rows }) {
  const [foc, setFoc] = useState(false);

  const baseStyle = {
    width: "100%",
    padding: "0.85rem 1.1rem",
    border: `1.5px solid ${foc ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 10,
    fontSize: "var(--text-sm)",
    background: foc ? "#fff" : "var(--surface-alt)",
    color: 'var(--text)',
    fontFamily: "var(--font-body)",
    outline: "none",
    boxShadow: foc ? `0 0 0 3px rgba(201, 48, 44, 0.1)` : "none",
    transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ marginBottom: "1.4rem", textAlign: "left" }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "var(--text-sm)",
          color: 'var(--accent)',
          marginBottom: 6,
          fontWeight: 600,
          letterSpacing: "0.03em"
        }}>
          {label}
        </label>
      )}
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={{ ...baseStyle, cursor: "pointer" }}
        >
          {options.map((o) => (
            <option key={o} value={o} style={{ background: "#fff", color: 'var(--text)' }}>
              {o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={{ ...baseStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
}
