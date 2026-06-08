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
        <SectionHeader
          eyebrow={t.proc_eyebrow}
          title={t.proc_title}
          subtitle={t.proc_subtitle}
        />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(to right, transparent, var(--color-border) 20%, var(--color-border) 80%, transparent)" }}
            aria-hidden
          />

          {steps.map((s, i) => (
            <li key={s.n} className="flex flex-col items-center text-center gap-4">
              {/* Step number */}
              <div
                className="relative w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold text-white shrink-0"
                style={{
                  background: "var(--color-accent)",
                  boxShadow: "var(--shadow-accent)",
                  fontSize: "var(--text-md)",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {s.n}
              </div>
              <h3
                className="font-display font-bold text-[var(--color-text)]"
                style={{ fontSize: "var(--text-md)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-[var(--color-muted)]"
                style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}
              >
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
