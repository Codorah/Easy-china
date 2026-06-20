// @ts-nocheck
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";

const WORD_EASE = [0.32, 0.72, 0, 1];

export function SectionTitle({ eyebrow, title, subtitle, centered = true }) {
  /* Split title into words for staggered reveal */
  const words = typeof title === "string" ? title.split(" ") : null;

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

      {/* Title -- word-by-word staggered reveal */}
      <h2
        className={cn(
          "text-[clamp(1.8rem,3.5vw,2.8rem)] font-display font-bold tracking-tight leading-[1.12] text-text",
          subtitle ? "mb-4" : "mb-0"
        )}
      >
        {words ? (
          words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.05,
                duration: 0.5,
                ease: WORD_EASE,
              }}
            >
              {word}
              {i < words.length - 1 && " "}
            </motion.span>
          ))
        ) : (
          /* Fallback for non-string titles (JSX) */
          <ScrollReveal direction="up" delay={0.1} duration={0.8}>
            {title}
          </ScrollReveal>
        )}
      </h2>

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
