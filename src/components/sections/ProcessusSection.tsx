// @ts-nocheck
import { MessageCircle, Search, Ship, Package } from "lucide-react";
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";

export function ProcessusSection() {
  useLang();
  const steps = [
    { num: "01", icon: <MessageCircle size={24} />, title: t("proc1_title"), desc: t("proc1_desc") },
    { num: "02", icon: <Search size={24} />, title: t("proc2_title"), desc: t("proc2_desc") },
    { num: "03", icon: <Ship size={24} />, title: t("proc3_title"), desc: t("proc3_desc") },
    { num: "04", icon: <Package size={24} />, title: t("proc4_title"), desc: t("proc4_desc") },
  ];

  return (
    <section className="py-24 lg:py-32 px-[var(--gutter)] relative z-[2]">
      <div className="max-w-container mx-auto">
        <SectionTitle
          eyebrow={t("proc_eyebrow")}
          title={t("proc_title")}
          subtitle={t("proc_subtitle")}
        />

        {/* Timeline track */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className={cn(
              "hidden md:block absolute h-px z-0",
              "top-9 left-[calc(12.5%+36px)] right-[calc(12.5%+36px)]",
              "bg-gradient-to-r from-transparent via-accent/25 to-transparent"
            )}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {steps.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="flex flex-col items-center text-center px-3">
                  {/* Circle with gradient border */}
                  <div
                    className={cn(
                      "w-[72px] h-[72px] rounded-full",
                      "bg-gradient-to-br from-accent/20 to-accent/5 p-0.5"
                    )}
                  >
                    <div
                      className={cn(
                        "w-full h-full rounded-full",
                        "bg-gradient-to-br from-white to-surface",
                        "flex items-center justify-center",
                        "text-accent",
                        "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      )}
                    >
                      {s.icon}
                    </div>
                  </div>

                  {/* Step badge */}
                  <div
                    className={cn(
                      "relative -mt-4 z-[1]",
                      "bg-accent text-white rounded-full",
                      "w-7 h-7 text-xs font-bold",
                      "flex items-center justify-center",
                      "tracking-wide shadow-sm"
                    )}
                  >
                    {s.num}
                  </div>

                  <h3 className="text-sm font-bold text-text mb-2 mt-4 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed max-w-[22ch]">
                    {s.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
