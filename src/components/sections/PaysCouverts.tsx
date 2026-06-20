// @ts-nocheck
import { Globe } from "lucide-react";
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";

const PAYS_AFRIQUE = [
  { flag:"🇹🇬", name:"Togo" },        { flag:"🇧🇯", name:"Bénin" },
  { flag:"🇨🇮", name:"Côte d'Ivoire" },{ flag:"🇸🇳", name:"Sénégal" },
  { flag:"🇨🇲", name:"Cameroun" },    { flag:"🇬🇦", name:"Gabon" },
  { flag:"🇨🇬", name:"Congo" },       { flag:"🇨🇩", name:"RD Congo" },
  { flag:"🇲🇱", name:"Mali" },        { flag:"🇧🇫", name:"Burkina Faso" },
  { flag:"🇳🇪", name:"Niger" },       { flag:"🇬🇳", name:"Guinée" },
  { flag:"🇲🇬", name:"Madagascar" },  { flag:"🇷🇪", name:"La Réunion" },
  { flag:"🇲🇦", name:"Maroc" },
];

export function PaysCouverts() {
  useLang();
  return (
    <div className="relative overflow-hidden bg-surface-alt border-t border-b border-border py-[var(--space-section)] px-[var(--gutter)] z-[2]">
      <div className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('/assets/1000073490.jpg')" }} />
      <SectionTitle eyebrow={t("pays_eyebrow")} title={t("pays_title")} subtitle={t("pays_subtitle")} />
      <div className="flex flex-wrap gap-3 justify-center max-w-container mx-auto relative z-[1]">
        {PAYS_AFRIQUE.map((p, i) => (
          <ScrollReveal key={p.name} direction="up" delay={i * 0.04}>
            <div className={cn(
              "flex items-center gap-2 bg-white border border-border rounded-full",
              "py-[0.55rem] px-[1.2rem] shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
              "text-[0.82rem] font-semibold text-text cursor-default",
              "transition-all duration-150",
              "hover:border-accent hover:text-accent hover:-translate-y-[3px] hover:scale-[1.04]",
              "hover:shadow-[0_8px_24px_rgba(201,48,44,0.15)] hover:bg-accent-soft"
            )}>
              <span className="text-[1.2rem]">{p.flag}</span>
              {p.name}
            </div>
          </ScrollReveal>
        ))}
      </div>
      <div className="text-center mt-10 relative z-[1]">
        <div className="inline-flex items-center gap-2 bg-accent-soft border border-accent/20 text-accent rounded-full py-2 px-[1.4rem] text-sm font-bold">
          <Globe size={14}/> +15 pays · Livraison porte-à-porte
        </div>
      </div>
    </div>
  );
}
