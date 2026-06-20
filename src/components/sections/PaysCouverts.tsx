// @ts-nocheck
import { Globe } from "lucide-react";
import { t, useLang } from "@/i18n";
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
    <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <SectionTitle eyebrow={t("pays_eyebrow")} title={t("pays_title")} subtitle={t("pays_subtitle")} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", justifyContent: "center", maxWidth: "var(--container)", margin: "0 auto" }}>
        {PAYS_AFRIQUE.map((p, i) => (
          <ScrollReveal key={p.name} direction="up" delay={i * 0.04}>
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              background:"#fff", border:`1px solid var(--border)`,
              borderRadius:40, padding:"0.55rem 1.2rem",
              boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
              fontSize:"0.82rem", fontWeight:600, color:"var(--text)",
              cursor: "default",
              transition:"color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.transform="translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow=`0 8px 24px rgba(201,48,44,0.15)`; e.currentTarget.style.background="var(--accent-soft)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.background="#fff"; }}
            >
              <span style={{fontSize:"1.2rem"}}>{p.flag}</span>
              {p.name}
            </div>
          </ScrollReveal>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,48,44,0.06)", border:`1px solid rgba(201,48,44,0.2)`, color:"var(--accent)", borderRadius:30, padding:"0.5rem 1.4rem", fontSize:"0.8rem", fontWeight:700 }}>
          <Globe size={14}/> +15 pays · Livraison porte-à-porte
        </div>
      </div>
    </div>
  );
}
