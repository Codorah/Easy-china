"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LANGS, type LangCode } from "@/lib/i18n";

export function LangSwitcher({ current }: { current: LangCode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Set aria-expanded imperatively â€” linter can't evaluate JSX expressions,
  // so dynamic ARIA booleans must be set via the DOM, not JSX attributes.
  useEffect(() => {
    btnRef.current?.setAttribute("aria-expanded", open ? "true" : "false");
  }, [open]);

  const switchLang = (code: LangCode) => {
    setOpen(false);
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/") || "/");
  };

  const active = LANGS.find((l) => l.code === current) ?? LANGS[0];

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)] transition-colors"
        aria-label={active.label}
        aria-haspopup="menu"
      >
        <span className="text-base leading-none">{active.flag}</span>
        <span>{active.code.toUpperCase()}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div
            role="menu"
            aria-label="Select language"
            className="absolute right-0 top-full mt-1 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-raise)] z-50 py-1 overflow-hidden"
          >
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
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
                  <svg className="ml-auto w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

