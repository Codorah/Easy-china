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
      icon: <MessageCircle size={22} />,
      name: t("svc5_name"),
      desc: t("svc5_desc"),
      features: [t("svc5_f1"), t("svc5_f2"), t("svc5_f3"), t("svc5_f4")],
      cta: "Suivre ma commande",
      msg: "Bonjour Easy China, je souhaite des informations sur votre service de messagerie et suivi.",
    },
    {
      icon: <Ship size={22} />,
      name: t("svc6_name"),
      desc: t("svc6_desc"),
      features: [t("svc6_f1"), t("svc6_f2"), t("svc6_f3"), t("svc6_f4")],
      cta: "Demander un devis fret",
      msg: "Bonjour Easy China, je souhaite un devis pour le transit maritime depuis la Chine.",
    },
    {
      icon: <FileCheck size={22} />,
      name: t("svc7_name"),
      desc: t("svc7_desc"),
      features: [t("svc7_f1"), t("svc7_f2"), t("svc7_f3"), t("svc7_f4")],
      cta: "Commencer ma demande de visa",
      msg: "Bonjour Easy China, je souhaite des informations sur les visas et démarches administratives.",
    },
    {
      icon: <GraduationCap size={22} />,
      name: t("svc8_name"),
      desc: t("svc8_desc"),
      features: [t("svc8_f1"), t("svc8_f2"), t("svc8_f3"), t("svc8_f4")],
      cta: "Explorer les universités",
      msg: "Bonjour Easy China, je souhaite des informations sur l'inscription dans les universités chinoises.",
    },
  ];

  return (
    <div className="bg-surface-alt border-t border-b border-border py-24 lg:py-32 px-6 lg:px-8 relative z-[2]">
      <div className="max-w-container mx-auto">
        <SectionTitle
          eyebrow={t("svc_extra_eyebrow")}
          title={t("svc_extra_title")}
          subtitle={t("svc_extra_subtitle")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {extras.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <GlassCard tilt className="h-full flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent-soft flex items-center justify-center mb-5 text-accent transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  {s.icon}
                </div>
                <h3 className="text-sm font-bold text-text mb-2 font-display">
                  {s.name}
                </h3>
                <p className="text-xs text-muted leading-[1.65] mb-4 flex-1">
                  {s.desc}
                </p>
                <ul className="list-none p-0 mb-6 space-y-2">
                  {s.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs text-muted"
                    >
                      <CheckCircle
                        size={13}
                        className="shrink-0 mt-0.5 text-accent"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <GoldenBtn
                  variant="outline"
                  onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))}
                  className="w-full"
                >
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
