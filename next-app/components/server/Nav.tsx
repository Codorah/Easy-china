import type { Dict, LangCode } from "@/lib/i18n";
import { LangSwitcher } from "@/components/client/LangSwitcher";
import { NavMobile } from "@/components/client/NavMobile";
import { NavLinks } from "@/components/client/NavLinks";
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
        className="bg-[var(--color-bg)]/95 backdrop-blur-2xl border-b border-[var(--color-border)]/60 h-[68px] px-6 flex items-center justify-between"
      >
        <a href={`/${lang}`} className="flex items-center shrink-0" aria-label="Easy China — Accueil">
          <Image
            src="/logo.png"
            alt="Easy China"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </a>

        <NavLinks links={links} />

        <div className="flex items-center gap-2">
          <LangSwitcher current={lang} />
          <NavMobile links={links} t={t} lang={lang} />
        </div>
      </nav>
    </NavScroll>
  );
}
