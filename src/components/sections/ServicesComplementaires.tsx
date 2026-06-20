// @ts-nocheck
import { MessageCircle, Ship, FileCheck, GraduationCap, CheckCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";

export function ServicesComplementaires() {
  useLang();
  const extras = [
    {
      icon: <MessageCircle size={22}/>,
      name: t("svc5_name"),
      desc: t("svc5_desc"),
      features: [t("svc5_f1"), t("svc5_f2"), t("svc5_f3"), t("svc5_f4")],
      cta: "Suivre ma commande",
      msg: "Bonjour Easy China, je souhaite des informations sur votre service de messagerie et suivi.",
    },
    {
      icon: <Ship size={22}/>,
      name: t("svc6_name"),
      desc: t("svc6_desc"),
      features: [t("svc6_f1"), t("svc6_f2"), t("svc6_f3"), t("svc6_f4")],
      cta: "Demander un devis fret",
      msg: "Bonjour Easy China, je souhaite un devis pour le transit maritime depuis la Chine.",
    },
    {
      icon: <FileCheck size={22}/>,
      name: t("svc7_name"),
      desc: t("svc7_desc"),
      features: [t("svc7_f1"), t("svc7_f2"), t("svc7_f3"), t("svc7_f4")],
      cta: "Commencer ma demande de visa",
      msg: "Bonjour Easy China, je souhaite des informations sur les visas et démarches administratives.",
    },
    {
      icon: <GraduationCap size={22}/>,
      name: t("svc8_name"),
      desc: t("svc8_desc"),
      features: [t("svc8_f1"), t("svc8_f2"), t("svc8_f3"), t("svc8_f4")],
      cta: "Explorer les universités",
      msg: "Bonjour Easy China, je souhaite des informations sur l'inscription dans les universités chinoises.",
    },
  ];

  return (
    <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("svc_extra_eyebrow")} title={t("svc_extra_title")} subtitle={t("svc_extra_subtitle")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-6)" }}>
          {extras.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <GlassCard tilt style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-sm)",
                  background: "var(--accent-soft)", color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "var(--space-4)",
                }}>{s.icon}</div>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)", marginBottom: "var(--space-2)", fontFamily: "var(--font-display)" }}>{s.name}</h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.65, marginBottom: "var(--space-4)", flex: 1 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 var(--space-6)" }}>
                  {s.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "var(--space-2)" }}>
                      <CheckCircle size={13} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))} style={{ width: "100%" }}>
                  {s.cta}
                </GoldenBtn>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
