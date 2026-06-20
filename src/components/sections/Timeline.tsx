// @ts-nocheck
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { GlassCard } from "@/components/primitives/GlassCard";

export function Timeline({ items }) {
  return (
    <div className="timeline-container" style={{
      position: "relative",
      maxWidth: 900,
      margin: "0 auto",
      padding: "2rem 0",
    }}>
      <div className="timeline-line" style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 2,
        background: `linear-gradient(to bottom, transparent, rgba(201, 48, 44, 0.25) 15%, rgba(201, 48, 44, 0.25) 85%, transparent)`,
        transform: "translateX(-50%)",
      }} />

      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        return (
          <div
            key={index}
            className="timeline-item"
            style={{
              display: "flex",
              justifyContent: isLeft ? "flex-start" : "flex-end",
              position: "relative",
              marginBottom: "3.2rem",
              width: "100%",
            }}
          >
            <div className="timeline-dot" style={{
              position: "absolute",
              left: "50%",
              top: 24,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "var(--accent)",
              border: `3px solid #fff`,
              transform: "translateX(-50%)",
              boxShadow: `0 0 0 3px rgba(201, 48, 44, 0.15)`,
              zIndex: 3,
            }} />

            <div className="timeline-card-wrapper" style={{ width: "45%" }}>
              <ScrollReveal direction={isLeft ? "left" : "right"} delay={index * 0.08}>
                <GlassCard tilt={true} style={{ padding: "1.8rem" }}>
                  <span style={{
                    fontSize: "var(--text-md)",
                    fontWeight: 700,
                    color: 'var(--accent)',
                    display: "block",
                    marginBottom: "0.4rem",
                    fontFamily: "var(--font-display)"
                  }}>
                    {item.year}
                  </span>
                  <h4 style={{
                    color: 'var(--text)',
                    fontSize: "var(--text-base)",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    color: 'var(--muted)',
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                  }}>
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
