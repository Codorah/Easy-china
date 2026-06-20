// @ts-nocheck
import { ScrollReveal } from "@/components/primitives/ScrollReveal";

export function SectionTitle({ eyebrow, title, subtitle, centered = true }) {
  return (
    <ScrollReveal direction="up" delay={0}>
      <div style={{ textAlign: centered ? "center" : "left", marginBottom: "var(--space-12)" }}>
        {eyebrow && (
          <div style={{
            fontSize: "var(--text-xs)",
            color: "var(--accent)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "var(--space-3)",
            fontFamily: "var(--font-body)",
          }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.2,
          marginBottom: subtitle ? "var(--space-4)" : 0,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{
            color: "var(--muted)",
            fontSize: "var(--text-base)",
            maxWidth: "56ch",
            margin: centered ? "0 auto" : "0",
            lineHeight: 1.7,
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
