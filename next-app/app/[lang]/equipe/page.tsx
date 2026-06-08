import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, LANGS, type LangCode } from "@/lib/i18n";
import { getEquipe } from "@/lib/data";
import { SectionHeader } from "@/components/server/SectionHeader";
import { JsonLd } from "@/components/server/JsonLd";

const BASE_URL = "https://easychina-services.com";
const OG_IMAGE = `${BASE_URL}/og.png`;

export const revalidate = 300;

const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

interface Props { params: Promise<{ lang: string }> }

export function generateStaticParams() { return getStaticLangParams(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  const canonical = `${BASE_URL}/${lang}/equipe`;
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l.hreflang] = `${BASE_URL}/${l.code}/equipe`;
  return {
    title: t.eq_title,
    description: t.eq_subtitle,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      url: canonical,
      title: t.eq_title,
      description: t.eq_subtitle,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: t.eq_title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.eq_title,
      description: t.eq_subtitle,
      images: [OG_IMAGE],
    },
  };
}

export default async function EquipePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);
  const members = await getEquipe();

  const initials = (name: string) =>
    name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${BASE_URL}/${lang}/equipe`,
    name: t.eq_title,
    description: t.eq_subtitle,
    inLanguage: lang,
  };

  return (
    <>
    <JsonLd data={jsonLd} />
    <div className="section-py">
      <div className="container-base">
        <SectionHeader
          eyebrow={t.eq_eyebrow}
          title={t.eq_title}
          subtitle={t.eq_subtitle}
        />

        {members.length === 0 ? (
          <p className="text-center text-[var(--color-muted)] text-[var(--text-md)] py-20">
            Équipe en cours de mise à jour.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {members.map((m) => (
              <li key={m.id} className="card overflow-hidden flex flex-col">
                <div className="h-56 flex items-center justify-center relative overflow-hidden bg-[var(--color-surface-alt)]">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center font-display font-extrabold text-white text-[var(--text-2xl)] bg-[var(--color-accent)]">
                      {initials(m.name)}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent)]" aria-hidden />
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div>
                    <h2 className="font-display font-bold text-[var(--color-text)] text-[var(--text-md)]">
                      {m.name}
                    </h2>
                    <p className="font-semibold uppercase text-[var(--color-accent)] text-[var(--text-xs)] tracking-[0.1em] mt-0.5">
                      {m.role}
                    </p>
                  </div>

                  {m.bio && (
                    <p className="text-[var(--color-muted)] text-[var(--text-sm)] leading-[var(--leading-body)] flex-1">
                      {m.bio}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2 mt-auto border-t border-[var(--color-border)]">
                    {m.whatsapp && (
                      <a
                        href={waLink(m.whatsapp, `Bonjour ${m.name}, je vous contacte via le site Easy China.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--color-accent)] text-[var(--text-sm)] font-semibold hover:underline"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.543 4.073 1.497 5.783L.057 23.857l6.22-1.614A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.495-5.195-1.361l-.372-.22-3.851 1.009 1.031-3.751-.241-.385A9.947 9.947 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        {t.eq_contact}
                      </a>
                    )}
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--color-muted)] text-[var(--text-sm)] font-semibold hover:text-[var(--color-text)] transition-colors"
                        aria-label={`LinkedIn de ${m.name}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
}
