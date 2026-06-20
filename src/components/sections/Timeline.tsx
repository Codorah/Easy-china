// @ts-nocheck
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { GlassCard } from "@/components/primitives/GlassCard";
import { cn } from "@/lib/utils";

export function Timeline({ items }) {
  return (
    <div className="relative max-w-[900px] mx-auto py-8">
      <div
        className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(201, 48, 44, 0.25) 15%, rgba(201, 48, 44, 0.25) 85%, transparent)" }}
      />

      <img src="/assets/1000073489.jpg" alt="" className="absolute -left-16 top-20 w-28 h-28 rounded-xl object-cover opacity-[0.08] rotate-[-6deg] pointer-events-none hidden lg:block" />
      <img src="/assets/1000073491.jpg" alt="" className="absolute -right-16 bottom-20 w-24 h-24 rounded-xl object-cover opacity-[0.08] rotate-[6deg] pointer-events-none hidden lg:block" />

      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        return (
          <div
            key={index}
            className={cn(
              "flex relative mb-[3.2rem] w-full",
              isLeft ? "justify-start" : "justify-end"
            )}
          >
            <div className="absolute left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-white -translate-x-1/2 shadow-[0_0_0_3px_rgba(201,48,44,0.15)] z-[3]" />

            <div className="w-[45%]">
              <ScrollReveal direction={isLeft ? "left" : "right"} delay={index * 0.08}>
                <GlassCard tilt={true} className="p-7">
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
    </div>
  );
}
