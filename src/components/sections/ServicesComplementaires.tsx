// @ts-nocheck
import { MessageCircle, Ship, FileCheck, GraduationCap, CheckCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
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
    <div className="bg-surface-alt border-t border-b border-border py-[var(--space-section)] px-[var(--gutter)] relative z-[2]">
      <div className="max-w-container mx-auto">
        <SectionTitle eyebrow={t("svc_extra_eyebrow")} title={t("svc_extra_title")} subtitle={t("svc_extra_subtitle")} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {extras.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <GlassCard tilt className="h-full flex flex-col">
                <div className="w-12 h-12 rounded-sm bg-accent-soft text-accent flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-sm font-bold text-text mb-2 font-display">{s.name}</h3>
                <p className="text-xs text-muted leading-[1.65] mb-4 flex-1">{s.desc}</p>
                <ul className="list-none p-0 mb-6">
                  {s.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted mb-2">
                      <CheckCircle size={13} color="var(--accent)" className="shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))} className="w-full">
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
