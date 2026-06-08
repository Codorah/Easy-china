import type { Dict } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";

interface Props { t: Dict }

export function ProcessSection({ t }: Props) {
  const steps = [
    { n: "01", title: t.proc1_title, desc: t.proc1_desc },
    { n: "02", title: t.proc2_title, desc: t.proc2_desc },
    { n: "03", title: t.proc3_title, desc: t.proc3_desc },
    { n: "04", title: t.proc4_title, desc: t.proc4_desc },
  ];

  return (
    <section className="section-py" aria-labelledby="process-heading">
      <div className="container-base">
        <SectionHeader eyebrow={t.proc_eyebrow} title={t.proc_title} subtitle={t.proc_subtitle} />
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" aria-hidden />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold text-white text-[var(--text-md)] bg-[var(--color-accent)] shadow-[var(--shadow-accent)] shrink-0">
                {s.n}
              </div>
              <h3 className="font-display font-bold text-[var(--color-text)] text-[var(--text-md)]">{s.title}</h3>
              <p className="text-[var(--color-muted)] text-[var(--text-sm)] leading-[var(--leading-body)]">{s.desc}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
