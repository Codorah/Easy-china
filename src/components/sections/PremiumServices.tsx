// @ts-nocheck
import { ShieldCheck, Award, Globe, Plane, TrendingUp } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";

export function PremiumServices() {
  useLang();
  const items = [
    { icon: <ShieldCheck size={24}/>, tag: t("prem1_tag"), title: t("prem1_title"), desc: t("prem1_desc") },
    { icon: <Award size={24}/>,       tag: t("prem2_tag"), title: t("prem2_title"), desc: t("prem2_desc") },
    { icon: <Globe size={24}/>,       tag: t("prem3_tag"), title: t("prem3_title"), desc: t("prem3_desc") },
    { icon: <Plane size={24}/>,       tag: t("prem4_tag"), title: t("prem4_title"), desc: t("prem4_desc") },
  ];

  return (
    <div style={{ padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("prem_eyebrow")} title={t("prem_title")} subtitle={t("prem_subtitle")} centered={false} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-6)" }}>
          {items.map((item, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.09}>
              <GlassCard tilt style={{ height: "100%" }}>
                {/* Category tag */}
                <div style={{
                  display: "inline-block",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  padding: "0.2rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "var(--space-6)",
                }}>{item.tag}</div>

                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-sm)",
                  background: "var(--accent-soft)", color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "var(--space-4)",
                }}>{item.icon}</div>

                <h3 style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                  fontFamily: "var(--font-display)",
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.7, flex: 1 }}>
                  {item.desc}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
        <div style={{ marginTop: "var(--space-12)" }}>
          <GoldenBtn variant="solid" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je suis intéressé par vos services premium (DDP, Marque Privée, Visite d'usine)."))}>
            <TrendingUp size={16}/> Discuter de mes besoins spécifiques
          </GoldenBtn>
        </div>
      </div>
    </div>
  );
}
