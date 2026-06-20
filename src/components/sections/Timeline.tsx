// @ts-nocheck
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { GlassCard } from "@/components/primitives/GlassCard";
import { cn } from "@/lib/utils";

export function Timeline({ items }) {
  return (
    <div className="relative max-w-[900px] mx-auto py-8">
      {/* Gradient line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-transparent via-accent/25 to-transparent hidden md:block" />

      {/* Decorative photos */}
      <img
        src="/assets/1000073489.jpg"
        alt=""
        className="absolute -left-16 top-20 w-28 h-28 rounded-xl object-cover opacity-[0.08] -rotate-6 pointer-events-none hidden lg:block"
      />
      <img
        src="/assets/1000073491.jpg"
        alt=""
        className="absolute -right-16 bottom-20 w-24 h-24 rounded-xl object-cover opacity-[0.08] rotate-6 pointer-events-none hidden lg:block"
      />

      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        return (
          <div
            key={index}
            className={cn(
              "relative mb-12 w-full",
              /* Desktop: 2-col alternating */
              "md:flex",
              isLeft ? "md:justify-start" : "md:justify-end",
              /* Mobile: single column, full width */
              "flex flex-col"
            )}
          >
            {/* Center dot on the vertical line (desktop only) */}
            <div className="absolute left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-white -translate-x-1/2 shadow-[0_0_0_3px_rgba(201,48,44,0.15)] z-[3] hidden md:block" />

            {/* Mobile dot (left-aligned) */}
            <div className="absolute left-0 top-6 w-3 h-3 rounded-full bg-accent border-2 border-white shadow-[0_0_0_3px_rgba(201,48,44,0.15)] z-[3] md:hidden" />

            {/* Card container */}
            <div
              className={cn(
                /* Mobile: full width with left padding for dot */
                "w-full pl-7 md:pl-0",
                /* Desktop: 45% width */
                "md:w-[45%]"
              )}
            >
              <ScrollReveal
                direction={isLeft ? "left" : "right"}
                delay={index * 0.08}
              >
                <GlassCard tilt className="p-7 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <span className="text-md font-bold text-accent block mb-1 font-display">
                    {item.year}
                  </span>
                  <h4 className="text-text text-base font-bold mb-2">
                    {item.title}
                  </h4>
                  <p className="text-muted text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        );
      })}

      {/* Mobile vertical line */}
      <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-accent/25 to-transparent md:hidden" />
    </div>
  );
}
