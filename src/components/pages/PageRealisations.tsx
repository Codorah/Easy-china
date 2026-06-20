// @ts-nocheck
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, UNSPLASH_REAL, waLink } from "@/lib/constants";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { MediaDisplay } from "@/components/primitives/MediaDisplay";
import { Img } from "@/components/primitives/Img";

// Bento coordinate mapping
const getBentoStyle = (index) => {
  const spans = [
    { gridColumn: "span 2", gridRow: "span 2" }, // index 0: big bento
    { gridColumn: "span 1", gridRow: "span 1" }, // index 1: small
    { gridColumn: "span 1", gridRow: "span 2" }, // index 2: tall
    { gridColumn: "span 2", gridRow: "span 1" }, // index 3: wide
    { gridColumn: "span 1", gridRow: "span 1" }, // index 4: small
  ];
  return spans[index % spans.length];
};

export function PageRealisations({ realisations }) {
  useLang();
  return (
    <div>
      {/* Hero banner for realisations */}
      <div style={{
        position: "relative", height: "clamp(180px, 28vw, 280px)", overflow: "hidden",
        background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 50%, var(--secondary) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
          <Img src="https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=1400&h=400&q=70" alt="" style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: 0 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 var(--gutter)" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.6rem" }}>
              {t("real_eyebrow")}
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
              {t("real_title")}
            </h1>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: "var(--space-12) var(--gutter) var(--space-section)", maxWidth: "var(--container)", margin: "0 auto" }}>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "var(--text-sm)", maxWidth: "60ch", margin: "0 auto var(--space-8)", lineHeight: 1.7 }}>
        {t("real_subtitle")}
      </p>

      {/* Bento Grid */}
      <div className="bento-grid" style={{ marginBottom: "4rem" }}>
        {realisations.map((r, i) => {
          const bentoStyle = getBentoStyle(i);
          const isLarge = bentoStyle.gridColumn.includes("2") || bentoStyle.gridRow.includes("2");
          return (
            <ScrollReveal
              key={r.id}
              direction="up"
              delay={i * 0.06}
              style={{ ...bentoStyle }}
              className={isLarge ? "bento-card-large" : "bento-card"}
            >
              <GlassCard tilt style={{ height: "100%", padding: 0, overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div className="zoom-container" style={{ height: isLarge ? 180 : 140, position: "relative", flexShrink: 0 }}>
                    <MediaDisplay
                      src={r.image}
                      fallback={UNSPLASH_REAL[r.cat] || UNSPLASH_REAL["Tourisme"]}
                      alt={r.titre}
                      style={{ borderRadius: "0px", height: "100%" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,20,16,0.65) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)",
                        color: "var(--accent)", fontSize: "var(--text-xs)", fontWeight: 700,
                        padding: "0.3rem 0.75rem", borderRadius: 20,
                        textTransform: "uppercase", letterSpacing: "0.04em",
                      }}>
                        {r.cat}
                      </span>
                    </div>
                    <div style={{ position: "absolute", bottom: 10, right: 12, zIndex: 2, display: "flex", gap: 2 }}>
                      {Array.from({ length: Number(r.stars || 5) }).map((_, stIdx) => (
                        <Star key={stIdx} size={12} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "1.4rem 1.6rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{
                        fontSize: isLarge ? "1.2rem" : "1rem",
                        fontWeight: 700, color: "var(--text)", lineHeight: 1.3,
                        marginBottom: "0.5rem", fontFamily: "var(--font-display)", textAlign: "left",
                      }}>
                        {r.titre}
                      </h3>
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem", textAlign: "left" }}>
                        {r.desc}
                      </p>
                    </div>

                    {r.temoignage && (
                      <div style={{
                        background: "var(--accent-soft)", borderRadius: "var(--radius-sm)",
                        padding: "1rem 1.1rem", position: "relative",
                      }}>
                        <div style={{ color: "var(--accent)", fontSize: "2rem", lineHeight: 0.8, fontFamily: "serif", opacity: 0.25, position: "absolute", top: 6, left: 10 }}>&ldquo;</div>
                        <p style={{ fontStyle: "italic", fontSize: "var(--text-xs)", color: "var(--text)", lineHeight: 1.5, marginBottom: "0.5rem", textAlign: "left", paddingLeft: 12 }}>
                          {r.temoignage}
                        </p>
                        <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--accent)", paddingLeft: 12 }}>&mdash; {r.client}</span>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal direction="up" delay={0.1}>
        <GlassCard style={{
          background: `linear-gradient(135deg, var(--surface-alt), #fff)`,
          border: `1.5px solid var(--border)`,
          padding: "3.5rem",
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 700, color: 'var(--text)', marginBottom: "1rem", fontFamily: "var(--font-display)" }}>
            Vous aussi, concrétisez vos projets avec la Chine !
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: "var(--text-base)", maxWidth: 650, margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
            Bénéficiez de la sécurité et de la puissance de notre réseau transitaire et académique pour réaliser vos ambitions d'importation ou d'études.
          </p>
          <GoldenBtn variant="glow" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite démarrer un projet logistique/études avec vous."))}>
            Lancer mon Projet
          </GoldenBtn>
        </GlassCard>
      </ScrollReveal>
      </div>
    </div>
  );
}
