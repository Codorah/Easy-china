import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, type LangCode } from "@/lib/i18n";
import { getRealisations } from "@/lib/data";
import { SectionHeader } from "@/components/server/SectionHeader";

export const revalidate = 300;

const WA_COMMERCIAL = "+22890000001";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const FALLBACK_IMAGES: Record<string, string> = {
  Import:    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80",
  Études:    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80",
  Visa:      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&h=400&q=80",
  Formation: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&h=400&q=80",
  Tourisme:  "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=600&h=400&q=80",
};
const DEFAULT_IMG = "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80";

interface Props { params: Promise<{ lang: string }> }

export function generateStaticParams() { return getStaticLangParams(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    title: t.real_title,
    description: t.real_subtitle,
    alternates: { canonical: `https://easychina-services.com/${lang}/realisations` },
  };
}

export default async function RealisationsPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);
  const items = await getRealisations();

  return (
    <div className="section-py">
      <div className="container-base">
        <SectionHeader
          eyebrow={t.real_eyebrow}
          title={t.real_title}
          subtitle={t.real_subtitle}
        />

        {items.length === 0 ? (
          <p className="text-center text-[var(--color-muted)] py-20" style={{ fontSize: "var(--text-md)" }}>
            Réalisations en cours de mise à jour.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6" role="list">
            {items.map((item) => {
              const img = item.image || FALLBACK_IMAGES[item.category] || DEFAULT_IMG;
              return (
                <li key={item.id} className="card overflow-hidden flex flex-col group">
                  {/* Image */}
                  <div className="h-60 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(26,20,16,0.6))" }}
                      aria-hidden
                    />
                    {/* Category + date overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span
                        className="pill-accent"
                        style={{ backdropFilter: "blur(8px)" }}
                      >
                        {item.category}
                      </span>
                      {item.date && (
                        <span
                          className="text-white font-semibold"
                          style={{ fontSize: "var(--text-xs)" }}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h2
                      className="font-display font-bold text-[var(--color-text)]"
                      style={{ fontSize: "var(--text-lg)" }}
                    >
                      {item.title}
                    </h2>
                    {item.description && (
                      <p
                        className="text-[var(--color-muted)] flex-1"
                        style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}
                      >
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--color-surface-alt)] text-[var(--color-muted)] font-medium border border-[var(--color-border)]"
                            style={{ fontSize: "var(--text-xs)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="eyebrow mb-4">{t.real_cta}</p>
          <p
            className="text-[var(--color-muted)] max-w-xl mx-auto mb-8"
            style={{ fontSize: "var(--text-md)", lineHeight: "var(--leading-body)" }}
          >
            {t.real_cta_sub}
          </p>
          <a
            href={waLink(WA_COMMERCIAL, "Bonjour Easy China, je voudrais démarrer un nouveau projet.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            {t.real_cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
