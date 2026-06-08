"use client";
import { useState, useEffect } from "react";
import type { Dict, LangCode } from "@/lib/i18n";

interface NavLink { href: string; label: string }
interface Props { links: NavLink[]; t: Dict; lang: LangCode }

export function NavMobile({ links, t }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={t.nav_open}
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-alt)] transition-colors relative z-[1002]"
      >
        <span className={`block w-5 h-0.5 bg-[var(--color-text)] transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`block w-5 h-0.5 bg-[var(--color-text)] mt-1.5 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-[var(--color-text)] mt-1.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </button>

      {open && (
        <div className="mobile-nav-overlay fixed inset-0 z-[999] bg-[var(--color-surface)]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface-alt)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col items-center gap-6" role="list">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-[2rem] font-display font-bold text-[var(--color-text)] hover:text-[var(--color-accent)] tracking-tight transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

