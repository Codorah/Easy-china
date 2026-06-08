import type { Dict } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";
import { ScrollReveal } from "@/components/client/ScrollReveal";

const WA_COMMERCIAL = "+8619876105148";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

interface Props { t: Dict }

export function PremiumSection({ t }: Props) {
  const items = [
    {
      title: t.prem1_title, tag: t.prem1_tag, desc: t.prem1_desc,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="1" y="3" width="15" height="13"/><path d="m16 8 5 0 2 4-2 4H16"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>,
    },
    {
      title: t.prem2_title, tag: t.prem2_tag, desc: t.prem2_desc,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    },
    {
      title: t.prem3_title, tag: t.prem3_tag, desc: t.prem3_desc,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    },
    {
      title: t.prem4_title, tag: t.prem4_tag, desc: t.prem4_desc,
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
  ];

  return (
    <section className="section-alt section-py" aria-labelledby="premium-heading">
      <div className="container-base">
        <ScrollReveal direction="up" delay={0}>
          <SectionHeader eyebrow={t.prem_eyebrow} title={t.prem_title} subtitle={t.prem_subtitle} />
        </ScrollReveal>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {items.map((item, i) => (
            <li key={item.title}>
              <ScrollReveal direction="up" delay={0.06 + i * 0.09} className="card p-6 relative overflow-visible flex flex-col gap-4 h-full">
                <div className="absolute -top-3 left-5 px-3 py-1 rounded-[var(--radius-full)] text-white font-bold uppercase text-[var(--text-xs)] tracking-[0.06em] bg-[var(--color-accent)] shadow-[var(--shadow-accent)]">
                  {item.tag}
                </div>
                <div className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-accent)] mt-4 bg-[var(--color-accent-soft)] border border-[rgba(201,48,44,0.2)]">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-[var(--color-text)] text-[var(--text-md)]">{item.title}</h3>
                <p className="text-[var(--color-muted)] text-[var(--text-sm)] leading-[var(--leading-body)] flex-1">{item.desc}</p>
              </ScrollReveal>
            </li>
          ))}
        </ul>
        <div className="text-center mt-12">
          <a
            href={waLink(WA_COMMERCIAL, "Bonjour Easy China, je suis intéressé par vos services premium (DDP, Marque Privée, Visite d'usine, Accompagnement).")}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-sm)] tracking-wide shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Discuter de mes besoins spécifiques
          </a>
        </div>
      </div>
    </section>
  );
}

