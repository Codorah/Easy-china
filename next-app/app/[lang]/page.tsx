import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, LANGS, type LangCode } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return getStaticLangParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[l.hreflang] = `https://easychina-services.com/${l.code}`;
  }

  return {
    title: "Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone",
    description: t.hero_desc,
    alternates: {
      canonical: `https://easychina-services.com/${lang}`,
      languages: alternates,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);

  return (
    <div className="container-base section-py">
      <div className="pill-accent mb-6">{t.hero_badge}</div>
      <h1 className="display mb-4">{t.hero_title1}</h1>
      <p className="text-[var(--text-lg)] text-[var(--color-muted)] max-w-2xl mb-8 leading-[var(--leading-body)]">
        {t.hero_desc}
      </p>
      <div className="flex gap-4 flex-wrap">
        <a
          href={`/${lang}/catalogue`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-semibold text-[var(--text-sm)] tracking-wide hover:bg-[var(--color-accent-strong)] transition-colors"
        >
          {t.hero_cta1}
        </a>
        <a
          href="https://wa.me/22891123456"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold text-[var(--text-sm)] tracking-wide hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
        >
          {t.hero_cta2}
        </a>
      </div>

      {/* Stat bar — Phase 2 will replace with real HeroSection component */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-10 border-t border-[var(--color-border)]">
        {[
          { value: "500+", label: t.hero_stat1 },
          { value: "10+",  label: t.hero_stat2 },
          { value: "15",   label: t.hero_stat3 },
          { value: "24/7", label: t.hero_stat4 },
        ].map((s) => (
          <div key={s.label}>
            <dt className="text-[var(--text-3xl)] font-bold font-display text-[var(--color-accent)] leading-none">
              {s.value}
            </dt>
            <dd className="text-[var(--text-sm)] text-[var(--color-muted)] mt-1">{s.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
