import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, type LangCode } from "@/lib/i18n";
import { getCatalogue } from "@/lib/data";
import { SectionHeader } from "@/components/server/SectionHeader";

export const revalidate = 300;

const WA_TRANSITAIRE = "+22890000002";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const FALLBACK_IMAGES: Record<string, string> = {
  Machines:       "https://images.unsplash.com/photo-1565715101539-8cca2c24bf0f?auto=format&fit=crop&w=600&h=400&q=80",
  Électronique:   "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=400&q=80",
  Textile:        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=400&q=80",
  Alimentaire:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=400&q=80",
  "Import général":"https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80",
  Autre:          "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&h=400&q=80",
};
const DEFAULT_IMG = "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80";

interface Props { params: Promise<{ lang: string }> }

export function generateStaticParams() { return getStaticLangParams(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    title: t.cat_title,
    description: t.cat_subtitle,
    alternates: { canonical: `https://easychina-services.com/${lang}/catalogue` },
  };
}

export default async function CataloguePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);
  const items = await getCatalogue();

  // Collect unique categories for the filter label display
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="section-py">
      <div className="container-base">
        <SectionHeader
          eyebrow={t.cat_eyebrow}
          title={t.cat_title}
          subtitle={t.cat_subtitle}
        />

        {/* Category pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <span
                key={cat}
                className="pill-accent"
                style={{ cursor: "default" }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-center text-[var(--color-muted)] py-20" style={{ fontSize: "var(--text-md)" }}>
            Catalogue en cours de mise à jour.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {items.map((item) => {
              const img = item.image || FALLBACK_IMAGES[item.category] || DEFAULT_IMG;
              const msg = `Bonjour Easy China, je suis intéressé par le produit : "${item.name}". Pouvez-vous me donner plus d'informations sur le prix et les délais ?`;

              return (
                <li key={item.id} className="card overflow-hidden flex flex-col group">
                  {/* Image */}
                  <div className="h-52 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--color-text)]/80 text-white backdrop-blur-sm font-semibold uppercase"
                        style={{ fontSize: "var(--text-xs)", letterSpacing: "0.08em" }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h2
                      className="font-display font-bold text-[var(--color-text)] mb-2"
                      style={{ fontSize: "var(--text-md)" }}
                    >
                      {item.name}
                    </h2>

                    {item.description && (
                      <p
                        className="text-[var(--color-muted)] mb-4 flex-1"
                        style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}
                      >
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border)]">
                      {item.price && (
                        <p className="font-bold text-[var(--color-accent)]" style={{ fontSize: "var(--text-md)" }}>
                          {item.price}
                        </p>
                      )}
                      {item.unit && (
                        <span className="text-[var(--color-muted)]" style={{ fontSize: "var(--text-xs)" }}>
                          / {item.unit}
                        </span>
                      )}
                    </div>

                    <a
                      href={waLink(WA_TRANSITAIRE, msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold hover:bg-[var(--color-accent-strong)] transition-colors"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      {t.cat_order}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Transit CTA */}
        <div className="mt-16 p-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div>
            <p className="eyebrow mb-2">{t.cat_transit}</p>
            <p className="text-[var(--color-muted)]" style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}>
              Nous gérons le transport, le dédouanement et la livraison de vos marchandises partout en Afrique.
            </p>
          </div>
          <a
            href={waLink(WA_TRANSITAIRE, "Bonjour Easy China, je souhaite des informations sur votre service transitaire.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-bold hover:bg-[var(--color-accent)] hover:text-white transition-colors"
            style={{ fontSize: "var(--text-sm)" }}
          >
            En savoir plus
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
