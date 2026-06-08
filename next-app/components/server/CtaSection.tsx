import type { Dict } from "@/lib/i18n";
import { ScrollReveal } from "@/components/client/ScrollReveal";

const WA_COMMERCIAL = "+8619876105148";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

interface Props { t: Dict }

export function CtaSection({ t }: Props) {
  return (
    <section className="section-alt section-py text-center" aria-label="Call to action">
      <div className="container-base max-w-2xl">
        <ScrollReveal direction="up" delay={0}>
          <p className="eyebrow mb-6">Contact</p>
          <h2 className="font-display font-extrabold text-[var(--color-text)] mb-6 text-[clamp(var(--text-xl),3vw,var(--text-3xl))] leading-[var(--leading-heading)] tracking-[var(--tracking-title)]">
            {t.cta_title}
          </h2>
          <p className="text-[var(--color-muted)] text-[var(--text-md)] leading-[var(--leading-body)] mb-10 mx-auto">
            {t.cta_subtitle}
          </p>
          <a
            href={waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite discuter d'un projet avec un expert.")}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-md)] shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.543 4.073 1.497 5.783L.057 23.857l6.22-1.614A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.495-5.195-1.361l-.372-.22-3.851 1.009 1.031-3.751-.241-.385A9.947 9.947 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t.cta_btn}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

