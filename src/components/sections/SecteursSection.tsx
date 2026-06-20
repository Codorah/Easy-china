// @ts-nocheck
import {
  Leaf, Zap, Hammer, Heart, Shirt, Smartphone, UtensilsCrossed, Wind,
} from "lucide-react";
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";

const SECTEURS = [
  { icon: <Leaf size={20}/>,             name: "Agriculture & Irrigation",   desc: "Pompes solaires, systèmes d'irrigation, équipements agricoles de haute précision." },
  { icon: <Zap size={20}/>,              name: "Énergie Solaire",             desc: "Panneaux photovoltaïques, onduleurs, batteries, systèmes off-grid pour l'Afrique." },
  { icon: <Hammer size={20}/>,           name: "Construction & BTP",          desc: "Matériaux de construction, outillage professionnel, équipements de chantier." },
  { icon: <Heart size={20}/>,            name: "Santé & Médical",             desc: "Équipements médicaux, matériel de laboratoire, consommables hospitaliers certifiés." },
  { icon: <Shirt size={20}/>,            name: "Mode & Textile",              desc: "Tissus, prêt-à-porter, accessoires de mode directement des ateliers de Guangzhou." },
  { icon: <Smartphone size={20}/>,       name: "Électronique & Tech",         desc: "Téléphones, ordinateurs, LED, composants électroniques à prix usine." },
  { icon: <UtensilsCrossed size={20}/>,  name: "Agroalimentaire",             desc: "Machines d'emballage, de conditionnement, de transformation alimentaire industrielle." },
  { icon: <Wind size={20}/>,             name: "Pressing & Blanchisserie",    desc: "Lignes complètes de lavage, séchage, repassage industriel et formation technique." },
];

export function SecteursSection() {
  useLang();
  return (
    <div className="bg-surface-alt border-t border-b border-border py-[var(--space-section)] px-[var(--gutter)] relative z-[2]">
      <div className="max-w-container mx-auto">
        <SectionTitle eyebrow={t("sec_eyebrow")} title={t("sec_title")} subtitle={t("sec_subtitle")} centered={false} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
          {SECTEURS.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={Math.floor(i / 2) * 0.08}>
              <div className={cn(
                "group flex gap-4 items-start p-6 bg-surface border border-border rounded-md",
                "cursor-default transition-all duration-150",
                "hover:border-accent hover:-translate-y-0.5 hover:shadow-md"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-sm bg-accent-soft text-accent",
                  "flex items-center justify-center shrink-0",
                  "group-hover:bg-accent group-hover:text-white transition-colors duration-150"
                )}>
                  {s.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text mb-1 leading-[1.3]">{s.name}</h4>
                  <p className="text-xs text-muted leading-[1.6]">{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
