// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useLang, changeLang, LANGS } from "@/i18n";
import { ChevronDown } from "lucide-react";

export function LangSwitcher() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find(l => l.code === lang) || LANGS[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: open ? "rgba(201,48,44,0.07)" : "transparent",
          border: `1px solid ${open ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, padding: "0.4rem 0.85rem",
          fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
          color: open ? "var(--accent)" : "var(--muted)", transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
          fontFamily: "var(--font-body)",
        }}
      >
        <span style={{ fontSize: "var(--text-base)" }}>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={13} style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "#fff", border: `1px solid var(--border)`,
          borderRadius: "var(--radius-md)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          zIndex: 2000, minWidth: 150, overflow: "hidden",
          animation: "pageEnter 0.2s ease",
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { changeLang(l.code); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", display: "flex",
                alignItems: "center", gap: 10, padding: "0.65rem 1rem",
                background: lang === l.code ? "rgba(201,48,44,0.06)" : "transparent",
                border: "none", cursor: "pointer",
                fontSize: "var(--text-sm)", fontWeight: lang === l.code ? 700 : 500,
                color: lang === l.code ? "var(--accent)" : "var(--text)",
                fontFamily: "var(--font-body)", transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "var(--text-md)" }}>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
