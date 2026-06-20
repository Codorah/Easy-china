// @ts-nocheck
import { Globe } from "lucide-react";
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";

const PAYS_AFRIQUE = [
  { flag: "🇹🇬", name: "Togo" },
  { flag: "🇧🇯", name: "Bénin" },
  { flag: "🇨🇮", name: "Côte d'Ivoire" },
  { flag: "🇸🇳", name: "Sénégal" },
  { flag: "🇨🇲", name: "Cameroun" },
  { flag: "🇬🇦", name: "Gabon" },
  { flag: "🇨🇬", name: "Congo" },
  { flag: "🇨🇩", name: "RD Congo" },
  { flag: "🇲🇱", name: "Mali" },
  { flag: "🇧🇫", name: "Burkina Faso" },
  { flag: "🇳🇪", name: "Niger" },
  { flag: "🇬🇳", name: "Guinée" },
  { flag: "🇲🇬", name: "Madagascar" },
  { flag: "🇷🇪", name: "La Réunion" },
  { flag: "🇲🇦", name: "Maroc" },
];

export function PaysCouverts() {
  useLang();
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-surface-alt border-t border-b border-border",
        "py-24 lg:py-32 px-[var(--gutter)] z-[2]"
      )}
    >
      {/* Background image overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-[url('/assets/1000073490.jpg')] bg-cover bg-center opacity-[0.03]"
        )}
      />

      <SectionTitle
        eyebrow={t("pays_eyebrow")}
        title={t("pays_title")}
        subtitle={t("pays_subtitle")}
      />

      {/* Country pills */}
      <div className="flex flex-wrap gap-3 justify-center max-w-container mx-auto relative z-[1]">
        {PAYS_AFRIQUE.map((p, i) => (
          <ScrollReveal key={p.name} direction="up" delay={i * 0.04}>
            <div
              className={cn(
                "flex items-center gap-2 bg-white border border-border rounded-full",
                "py-2.5 px-5 shadow-sm",
                "text-sm font-semibold text-text cursor-default",
                "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "hover:border-accent hover:text-accent hover:-translate-y-[3px] hover:scale-[1.04]",
                "hover:shadow-accent hover:bg-accent-soft"
              )}
            >
              <span className="text-lg">{p.flag}</span>
              {p.name}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Footer badge */}
      <div className="text-center mt-10 relative z-[1]">
        <div
          className={cn(
            "inline-flex items-center gap-2",
            "bg-accent-soft border border-accent/20 text-accent",
            "rounded-full py-2 px-6 text-sm font-bold"
          )}
        >
          <Globe size={14} />
          +15 pays · Livraison porte-à-porte
        </div>
      </div>
    </section>
  );
}
