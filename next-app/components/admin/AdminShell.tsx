"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const NAV = [
  {
    href: "/admin/catalogue",
    label: "Catalogue",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    href: "/admin/realisations",
    label: "RÃ©alisations",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    href: "/admin/equipe",
    label: "Ã‰quipe",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

interface Props {
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
}

export function AdminShell({ children, logoutAction }: Props) {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);
  const menuOpen: "true" | "false" = open ? "true" : "false";

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* â”€â”€ Mobile overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navigation admin"
      >
        {/* Brand */}
        <div className="px-5 py-6 border-b border-[var(--color-border)]">
          <span className="font-display font-extrabold text-[var(--color-text)] text-[var(--text-md)]">
            Easy China
          </span>
          <p className="text-[var(--text-xs)] text-[var(--color-muted)] mt-0.5 uppercase tracking-widest font-semibold">
            Administration
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
                }`}
              >
                <span className={isActive ? "text-[var(--color-accent)]" : ""}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: logout + public link */}
        <div className="px-3 py-4 border-t border-[var(--color-border)] flex flex-col gap-2">
          <Link
            href="/fr"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
            </svg>
            Voir le site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] text-[var(--color-muted)] hover:bg-red-50 hover:text-red-600 transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              DÃ©connexion
            </button>
          </form>
        </div>
      </aside>

      {/* â”€â”€ Main content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-10 lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <span className="font-display font-bold text-[var(--color-text)] text-[var(--text-sm)]">Administration</span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu admin"
            aria-expanded={menuOpen}
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

