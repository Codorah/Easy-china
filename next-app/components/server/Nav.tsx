import type { Dict, LangCode } from "@/lib/i18n";
import { LangSwitcher } from "@/components/client/LangSwitcher";
import { NavMobile } from "@/components/client/NavMobile";
import { NavScroll } from "@/components/client/NavScroll";
import Image from "next/image";

interface Props { t: Dict; lang: LangCode }

export function Nav({ t, lang }: Props) {
  const links = [
    { href: `/${lang}`,              label: t.nav_home },
    { href: `/${lang}/catalogue`,    label: t.nav_catalogue },
    { href: `/${lang}/realisations`, label: t.nav_portfolio },
    { href: `/${lang}/equipe`,       label: t.nav_team },
  ];

  return (
    <NavScroll>
      <nav
        aria-label="Main navigation"
        className="
          bg-[var(--color-bg)]/95 backdrop-blur-2xl
          border-b border-[var(--color-border)]/60
          h-[68px] px-6 flex items-center justify-between
          data-[scrolled]:bg-[var(--color-bg)]/97
        "
      >
        {/* Logo */}
        <a href={`/${lang}`} className="flex items-center gap-2 shrink-0" aria-label="Easy China — Accueil">
          <Image
            src="/logo.png"
            alt="Easy China"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="
                  relative px-4 py-2 rounded-[var(--radius-md)]
                  text-[var(--text-sm)] font-semibold text-[var(--color-muted)]
                  hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]
                  transition-colors
                "
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LangSwitcher current={lang} />
          <NavMobile links={links} t={t} lang={lang} />
        </div>
      </nav>
    </NavScroll>
  );
}
