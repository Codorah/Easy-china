// @ts-nocheck
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";

export function SectionTitle({ eyebrow, title, subtitle, centered = true }) {
  return (
    <ScrollReveal direction="up" delay={0}>
      <div className={cn("mb-12", centered ? "text-center" : "text-left")}>
        {eyebrow && (
          <div className="text-xs text-accent tracking-[0.18em] uppercase font-bold mb-3 font-body">
            {eyebrow}
          </div>
        )}
        <h2
          className={cn(
            "text-[clamp(1.75rem,3.5vw,2.6rem)] font-bold text-text leading-[1.2] font-display tracking-[-0.02em]",
            subtitle ? "mb-4" : "mb-0"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "text-muted text-base max-w-[56ch] leading-[1.7]",
              centered ? "mx-auto" : "mx-0"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
