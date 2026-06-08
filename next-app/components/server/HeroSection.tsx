import Image from "next/image";
import type { Dict, LangCode } from "@/lib/i18n";

const WA_COMMERCIAL = "+22890000001";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const STATS = (t: Dict) => [
  { value: "500+", label: t.hero_stat1 },
  { value: "10+",  label: t.hero_stat2 },
  { value: "15",   label: t.hero_stat3 },
  { value: "24/7", label: t.hero_stat4 },
];

interface Props { t: Dict; lang: LangCode }

export function HeroSection({ t }: Props) {
  return (
    <section
      aria-label="Hero"
      className="grid md:grid-cols-2 min-h-screen overflow-hidden"
    >
      {/* ── Left: text ────────────────────────────────────────────── */}
      <div
        className="flex flex-col justify-center px-[clamp(2rem,8%,6rem)] py-32 md:py-40"
        style={{
          background:
            "radial-gradient(ellipse at 90% 40%, rgba(201,48,44,0.055) 0%, transparent 60%), var(--color-bg)",
        }}
      >
        {/* Badge */}
        <div className="pill-accent mb-8 self-start">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
          </svg>
          {t.hero_badge}
        </div>

        {/* Headline — always in SSR HTML */}
        <h1
          className="font-display font-extrabold text-[var(--color-text)] mb-6"
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
          }}
        >
          {t.hero_title1}
          <br />
          <em
            className="not-italic text-[var(--color-accent)]"
            style={{ fontStyle: "italic", fontFamily: "'Syne', system-ui, sans-serif" }}
          >
            {t.hero_title2}
          </em>
        </h1>

        {/* Description */}
        <p
          className="text-[var(--color-muted)] max-w-[460px] mb-10"
          style={{ fontSize: "var(--text-md)", lineHeight: "var(--leading-body)" }}
        >
          {t.hero_desc}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-12">
          <a
            href="catalogue"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-sm)] tracking-wide shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] hover:shadow-[var(--shadow-accent)] transition-all duration-200"
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
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-bold text-[var(--text-sm)] tracking-wide hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-200"
          >
            <svg className="icon-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.543 4.073 1.497 5.783L.057 23.857l6.22-1.614A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.495-5.195-1.361l-.372-.22-3.851 1.009 1.031-3.751-.241-.385A9.947 9.947 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t.hero_cta2}
          </a>
        </div>

        {/* Stats */}
        <dl
          className="flex flex-wrap gap-x-10 gap-y-6 pt-8 border-t border-[var(--color-border)]"
        >
          {STATS(t).map((s) => (
            <div key={s.label}>
              <dt
                className="font-display font-extrabold text-[var(--color-accent)]"
                style={{ fontSize: "var(--text-2xl)", lineHeight: 1 }}
              >
                {s.value}
              </dt>
              <dd
                className="text-[var(--color-muted)] font-semibold uppercase tracking-widest mt-1"
                style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em" }}
              >
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ── Right: image ──────────────────────────────────────────── */}
      <div className="relative min-h-[55vw] md:min-h-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1200&h=1400&q=80"
          alt="Shanghai skyline at dusk"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.28) 100%)" }}
          aria-hidden
        />
        {/* Red accent ribbon */}
        <div
          className="absolute top-0 right-0 w-1.5 h-full bg-[var(--color-accent)]"
          aria-hidden
        />
        {/* Floating office card */}
        <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-[var(--color-surface)]/95 backdrop-blur-md rounded-[var(--radius-lg)] px-5 py-4 shadow-[var(--shadow-raise)]">
          <div
            className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 text-white"
            style={{ background: "var(--color-accent)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[var(--color-text)]" style={{ fontSize: "var(--text-sm)" }}>
              {t.hero_offices}
            </p>
            <p className="text-[var(--color-muted)]" style={{ fontSize: "var(--text-xs)" }}>
              {t.hero_cities}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
