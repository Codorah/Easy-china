// @ts-nocheck
import { MessageCircle, Search, Ship, Package } from "lucide-react";
import { t, useLang } from "@/i18n";
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
    <div style={{ padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("proc_eyebrow")} title={t("proc_title")} subtitle={t("proc_subtitle")} />

        {/* Timeline track */}
        <div style={{ position: "relative" }}>
          {/* Connecting line */}
          <div className="processus-line" style={{
            position: "absolute",
            top: 36,
            left: "calc(12.5% + 36px)",
            right: "calc(12.5% + 36px)",
            height: 1,
            background: "var(--border)",
            zIndex: 0,
          }} />

          <div className="processus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
            {steps.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 var(--space-3)" }}>
                  {/* Circle */}
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "var(--surface)",
                    border: "2px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--accent)",
                    position: "relative", zIndex: 1,
                    marginBottom: "var(--space-6)",
                    boxShadow: "var(--shadow-sm)",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}>
                    {s.icon}
                    {/* Step badge */}
                    <div style={{
                      position: "absolute", top: -8, right: -8,
                      background: "var(--accent)", color: "#fff",
                      borderRadius: "var(--radius-full)",
                      width: 22, height: 22,
                      fontSize: "var(--text-xs)", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      letterSpacing: "0.03em",
                    }}>{s.num}</div>
                  </div>
                  <h3 style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "var(--space-2)",
                    lineHeight: 1.3,
                  }}>
                    {s.title}
                  </h3>
                  <p style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    maxWidth: "22ch",
                  }}>
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
