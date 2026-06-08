"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LANGS, type LangCode } from "@/lib/i18n";

export function LangSwitcher({ current }: { current: LangCode }) {
  const router  = useRouter();
  const pathname = usePathname();
  const [open, setOpen]  = useState(false);

  const switchLang = (code: LangCode) => {
    setOpen(false);
    // Replace the first path segment (the lang) with the new one
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/") || "/");
  };

  const active = LANGS.find((l) => l.code === current) ?? LANGS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
        aria-label={active.label}
        aria-expanded={open}
      >
        <span className="text-base leading-none">{active.flag}</span>
        <span>{active.code.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <ul
            className="absolute right-0 top-full mt-1 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-raise)] z-50 py-1 overflow-hidden"
            role="menu"
          >
            {LANGS.map((l) => (
              <li key={l.code} role="none">
                <button
                  role="menuitem"
                  onClick={() => switchLang(l.code as LangCode)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[var(--text-sm)] transition-colors ${
                    l.code === current
                      ? "text-[var(--color-accent)] bg-[var(--color-accent-soft)] font-semibold"
                      : "text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                  {l.code === current && (
                    <svg className="ml-auto icon-sm" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
