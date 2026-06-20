// @ts-nocheck
import { Globe } from "lucide-react";
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { WorldMap } from "@/components/ui/world-map";

const PAYS_AFRIQUE = [
  { flag: "\u{1F1F9}\u{1F1EC}", name: "Togo" },
  { flag: "\u{1F1E7}\u{1F1EF}", name: "Bénin" },
  { flag: "\u{1F1E8}\u{1F1EE}", name: "Côte d'Ivoire" },
  { flag: "\u{1F1F8}\u{1F1F3}", name: "Sénégal" },
  { flag: "\u{1F1E8}\u{1F1F2}", name: "Cameroun" },
  { flag: "\u{1F1EC}\u{1F1E6}", name: "Gabon" },
  { flag: "\u{1F1E8}\u{1F1EC}", name: "Congo" },
  { flag: "\u{1F1E8}\u{1F1E9}", name: "RD Congo" },
  { flag: "\u{1F1F2}\u{1F1F1}", name: "Mali" },
  { flag: "\u{1F1E7}\u{1F1EB}", name: "Burkina Faso" },
  { flag: "\u{1F1F3}\u{1F1EA}", name: "Niger" },
  { flag: "\u{1F1EC}\u{1F1F3}", name: "Guinée" },
  { flag: "\u{1F1F2}\u{1F1EC}", name: "Madagascar" },
  { flag: "\u{1F1F7}\u{1F1EA}", name: "La Réunion" },
  { flag: "\u{1F1F2}\u{1F1E6}", name: "Maroc" },
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

      {/* World Map with animated arcs */}
      <div className="max-w-container mx-auto relative z-[1] mb-12">
        <WorldMap
          lineColor="#c9302c"
          dots={[
            { start: { lat: 23.13, lng: 113.26, label: "Guangzhou" }, end: { lat: 6.17, lng: 1.23, label: "Lomé" } },
            { start: { lat: 23.13, lng: 113.26, label: "Guangzhou" }, end: { lat: 14.69, lng: -17.44, label: "Dakar" } },
            { start: { lat: 23.13, lng: 113.26, label: "Guangzhou" }, end: { lat: 5.36, lng: -4.01, label: "Abidjan" } },
            { start: { lat: 29.31, lng: 120.07, label: "Yiwu" }, end: { lat: 4.05, lng: 9.70, label: "Douala" } },
            { start: { lat: 29.31, lng: 120.07, label: "Yiwu" }, end: { lat: 6.37, lng: 2.42, label: "Cotonou" } },
          ]}
        />
      </div>

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
