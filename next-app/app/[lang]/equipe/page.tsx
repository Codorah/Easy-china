import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, type LangCode } from "@/lib/i18n";
import { getEquipe } from "@/lib/data";

export const revalidate = 300;

interface Props {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return getStaticLangParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return { title: t.eq_title, description: t.eq_subtitle };
}

export default async function EquipePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);
  const members = await getEquipe();

  return (
    <div className="container-base section-py">
      <p className="eyebrow mb-3">{t.eq_eyebrow}</p>
      <h1 className="display mb-4">{t.eq_title}</h1>
      <p className="text-[var(--color-muted)] max-w-2xl mb-12">{t.eq_subtitle}</p>

      {members.length === 0 ? (
        <p className="text-[var(--color-muted)]">No team members yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <li key={m.id} className="card p-5 flex flex-col gap-3">
              <div>
                <h2 className="font-semibold text-[var(--text-md)]">{m.name}</h2>
                <p className="text-[var(--text-sm)] text-[var(--color-accent)]">{m.role}</p>
              </div>
              {m.bio && <p className="text-[var(--text-sm)] text-[var(--color-muted)]">{m.bio}</p>}
              {m.whatsapp && (
                <a
                  href={`https://wa.me/${m.whatsapp}`}
                  className="text-[var(--text-sm)] font-semibold text-[var(--color-accent)] hover:underline self-start"
                >
                  {t.eq_contact}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
