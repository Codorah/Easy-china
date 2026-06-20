// @ts-nocheck
import {
  Leaf, Zap, Hammer, Heart, Shirt, Smartphone, UtensilsCrossed, Wind,
} from "lucide-react";
import { t, useLang } from "@/i18n";
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
    <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("sec_eyebrow")} title={t("sec_title")} subtitle={t("sec_subtitle")} centered={false} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-3)" }}>
          {SECTEURS.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={Math.floor(i / 2) * 0.08}>
              <div style={{
                display: "flex", gap: "var(--space-4)", alignItems: "flex-start",
                padding: "var(--space-6)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-sm)",
                  background: "var(--accent-soft)", color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>{s.icon}</div>
                <div>
                  <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)", marginBottom: "var(--space-1)", lineHeight: 1.3 }}>{s.name}</h4>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
