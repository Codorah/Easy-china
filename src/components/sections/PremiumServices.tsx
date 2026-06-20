// @ts-nocheck
import { ShieldCheck, Award, Globe, Plane, TrendingUp } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
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
    <div className="py-[var(--space-section)] px-[var(--gutter)] relative z-[2]">
      <div className="max-w-container mx-auto">
        <SectionTitle eyebrow={t("prem_eyebrow")} title={t("prem_title")} subtitle={t("prem_subtitle")} centered={false} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {items.map((item, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.09}>
              <GlassCard tilt className="h-full">
                {/* Category tag */}
                <div className="inline-block bg-accent-soft text-accent text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase mb-6">
                  {item.tag}
                </div>

                <div className="w-12 h-12 rounded-sm bg-accent-soft text-accent flex items-center justify-center mb-4">
                  {item.icon}
                </div>

                <h3 className="text-sm font-bold text-text mb-2 font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-muted leading-[1.7] flex-1">
                  {item.desc}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-12">
          <GoldenBtn variant="solid" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je suis intéressé par vos services premium (DDP, Marque Privée, Visite d'usine)."))}>
            <TrendingUp size={16}/> Discuter de mes besoins spécifiques
          </GoldenBtn>
        </div>
      </div>
    </div>
  );
}
