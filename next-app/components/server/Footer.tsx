import type { Dict, LangCode } from "@/lib/i18n";
import Image from "next/image";

interface Props { t: Dict; lang: LangCode }

export function Footer({ t, lang }: Props) {
  const links = [
    { href: `/${lang}`,              label: t.nav_home },
    { href: `/${lang}/catalogue`,    label: t.nav_catalogue },
    { href: `/${lang}/realisations`, label: t.nav_portfolio },
    { href: `/${lang}/equipe`,       label: t.nav_team },
  ];

  return (
    <footer className="bg-[var(--color-text)] text-[#94a3b8] border-t-[3px] border-[var(--color-accent)]">
      <div className="container-base py-16 flex flex-col gap-8 items-center text-center">
        {/* Logo */}
        <a href={`/${lang}`} aria-label="Easy China — Accueil">
          <Image
            src="/logo.png"
            alt="Easy China"
            width={120}
            height={40}
            className="h-12 w-auto object-contain brightness-0 invert"
          />
        </a>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-6" role="list">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[var(--text-sm)] font-medium text-[#94a3b8] hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <hr className="w-full border-[#334155]" />

        {/* Contact quick-links */}
        <div className="flex flex-wrap justify-center gap-6 text-[var(--text-sm)]">
          <a
            href="https://wa.me/22890000001"
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors"
            target="_blank" rel="noopener noreferrer"
          >
            <svg className="icon-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.543 4.073 1.497 5.783L.057 23.857l6.22-1.614A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.495-5.195-1.361l-.372-.22-3.851 1.009 1.031-3.751-.241-.385A9.947 9.947 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href="mailto:contact@easychina-services.com"
            className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors"
          >
            <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
            </svg>
            contact@easychina-services.com
          </a>
        </div>

        <p className="text-[var(--text-xs)] text-[#64748b] leading-relaxed max-w-lg">
          {t.footer_copy}
        </p>
      </div>
    </footer>
  );
}
