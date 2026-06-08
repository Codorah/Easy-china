import Image from "next/image";
import type { Dict, LangCode } from "@/lib/i18n";
import { HeroEntrance } from "@/components/client/HeroEntrance";

const WA_COMMERCIAL = "+22890000001";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

interface Props { t: Dict; lang: LangCode }

export function HeroSection({ t, lang }: Props) {
  const badge = (
    <div className="pill-accent">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
      {t.hero_badge}
    </div>
  );

  const ctas = (
    <div className="flex flex-wrap gap-4">
      <a
        href={`/${lang}/catalogue`}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-sm)] tracking-wide shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] transition-colors"
      >
        <svg className="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        {t.hero_cta1}
      </a>
      <a
        href={waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite obtenir des informations sur vos services.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-bold text-[var(--text-sm)] tracking-wide hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
      >
        <svg className="icon-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.543 4.073 1.497 5.783L.057 23.857l6.22-1.614A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.495-5.195-1.361l-.372-.22-3.851 1.009 1.031-3.751-.241-.385A9.947 9.947 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        {t.hero_cta2}
      </a>
    </div>
  );

  const stats = (
    <dl className="flex flex-wrap gap-x-10 gap-y-6 pt-8 border-t border-[var(--color-border)]">
      {([
        { value: "500+", label: t.hero_stat1 },
        { value: "10+",  label: t.hero_stat2 },
        { value: "15",   label: t.hero_stat3 },
        { value: "24/7", label: t.hero_stat4 },
      ] as const).map((s) => (
        <div key={s.label}>
          <dt className="font-display font-extrabold text-[var(--color-accent)] text-[var(--text-2xl)] leading-none">
            {s.value}
          </dt>
          <dd className="text-[var(--color-muted)] font-semibold uppercase mt-1 text-[var(--text-xs)] tracking-[0.12em]">
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );

  return (
    <section aria-label="Hero" className="grid md:grid-cols-2 min-h-screen overflow-hidden">
      <HeroEntrance
        badge={badge}
        title1={t.hero_title1}
        title2={t.hero_title2}
        desc={t.hero_desc}
        ctas={ctas}
        stats={stats}
      />

      <div className="relative min-h-[55vw] md:min-h-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1200&h=1400&q=80"
          alt="Shanghai skyline at dusk"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="hero-img-overlay" aria-hidden />
        <div className="absolute top-0 right-0 w-1.5 h-full bg-[var(--color-accent)]" aria-hidden />

        {/* Floating office card */}
        <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-[var(--color-surface)]/95 backdrop-blur-md rounded-[var(--radius-lg)] px-5 py-4 shadow-[var(--shadow-raise)]">
          <div className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 text-white bg-[var(--color-accent)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[var(--color-text)] text-[var(--text-sm)]">{t.hero_offices}</p>
            <p className="text-[var(--color-muted)] text-[var(--text-xs)]">{t.hero_cities}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
