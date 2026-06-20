// @ts-nocheck
import { MessageCircle, Search, Ship, Package } from "lucide-react";
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";

export function ProcessusSection() {
  useLang();
  const steps = [
    { num: "01", icon: <MessageCircle size={24}/>, title: t("proc1_title"), desc: t("proc1_desc") },
    { num: "02", icon: <Search size={24}/>,        title: t("proc2_title"), desc: t("proc2_desc") },
    { num: "03", icon: <Ship size={24}/>,          title: t("proc3_title"), desc: t("proc3_desc") },
    { num: "04", icon: <Package size={24}/>,       title: t("proc4_title"), desc: t("proc4_desc") },
  ];

  return (
    <div className="py-[var(--space-section)] px-[var(--gutter)] relative z-[2]">
      <div className="max-w-container mx-auto">
        <SectionTitle eyebrow={t("proc_eyebrow")} title={t("proc_title")} subtitle={t("proc_subtitle")} />

        {/* Timeline track */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="processus-line absolute h-px bg-border z-0"
            style={{
              top: 36,
              left: "calc(12.5% + 36px)",
              right: "calc(12.5% + 36px)",
            }}
          />

          <div className="processus-grid grid grid-cols-4 gap-[var(--space-4)]">
            {steps.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="flex flex-col items-center text-center px-3">
                  {/* Circle */}
                  <div className={cn(
                    "w-[72px] h-[72px] rounded-full",
                    "bg-gradient-to-br from-white to-surface border-2 border-accent/20 shadow-md",
                    "flex items-center justify-center",
                    "text-accent relative z-[1] mb-6",
                    "transition-all duration-150"
                  )}>
                    {s.icon}
                    {/* Step badge */}
                    <div className="absolute -top-2 -right-2 bg-accent text-white rounded-full w-[22px] h-[22px] text-xs font-bold flex items-center justify-center tracking-[0.03em]">
                      {s.num}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-text mb-2 leading-[1.3]">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted leading-[1.65] max-w-[22ch]">
                    {s.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
