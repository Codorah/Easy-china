// @ts-nocheck
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";

export function SectionTitle({ eyebrow, title, subtitle, centered = true }) {
  return (
    <div className={cn("mb-12", centered ? "text-center" : "text-left")}>
      {/* Eyebrow: Double-Bezel pill */}
      {eyebrow && (
        <ScrollReveal direction="up" delay={0} duration={0.8}>
          <div
            className={cn(
              "inline-flex mb-4",
              centered ? "justify-center" : "justify-start"
            )}
          >
            {/* Outer shell */}
            <span className="inline-flex p-px rounded-full bg-accent/[0.06] ring-1 ring-accent/10">
              {/* Inner pill */}
              <span className="rounded-full bg-accent/[0.04] px-4 py-1.5 text-xs text-accent tracking-[0.18em] uppercase font-bold font-body">
                {eyebrow}
              </span>
            </span>
          </div>
        </ScrollReveal>
      )}

      {/* Title */}
      <ScrollReveal direction="up" delay={0.1} duration={0.8}>
        <h2
          className={cn(
            "text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold tracking-tight leading-[1.12] text-text",
            subtitle ? "mb-4" : "mb-0"
          )}
        >
          {title}
        </h2>
      </ScrollReveal>

      {/* Subtitle */}
      {subtitle && (
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <p
            className={cn(
              "text-muted text-base leading-relaxed max-w-[55ch]",
              centered ? "mx-auto" : "mx-0"
            )}
          >
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
