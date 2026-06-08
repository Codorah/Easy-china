import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, type LangCode } from "@/lib/i18n";
import { getRealisations } from "@/lib/data";

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
  return { title: t.real_title, description: t.real_subtitle };
}

export default async function RealisationsPage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);
  const items = await getRealisations();

  return (
    <div className="container-base section-py">
      <p className="eyebrow mb-3">{t.real_eyebrow}</p>
      <h1 className="display mb-4">{t.real_title}</h1>
      <p className="text-[var(--color-muted)] max-w-2xl mb-12">{t.real_subtitle}</p>

      {items.length === 0 ? (
        <p className="text-[var(--color-muted)]">No projects yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <li key={item.id} className="card p-5">
              <h2 className="font-semibold text-[var(--text-md)] mb-1">{item.title}</h2>
              <p className="text-[var(--text-sm)] text-[var(--color-muted)] mb-3">{item.category}</p>
              {item.description && (
                <p className="text-[var(--text-sm)] text-[var(--color-text)]">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
