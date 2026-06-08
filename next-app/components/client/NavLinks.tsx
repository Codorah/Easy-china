"use client";
import { usePathname } from "next/navigation";

interface NavLink { href: string; label: string }

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="hidden md:flex items-center gap-1" role="list">
      {links.map((l) => {
        // Active if exact match OR if the link is a sub-path (catalogue, equipeâ€¦)
        const isActive = pathname === l.href || (l.href.split("/").length > 2 && pathname.startsWith(l.href));

        return (
          <li key={l.href}>
            <a
              href={l.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative px-4 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] font-semibold transition-colors ${
                isActive
                  ? "text-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
              }`}
            >
              {l.label}
              {isActive && (
                <span
                  className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[var(--color-accent)]"
                  aria-hidden
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

