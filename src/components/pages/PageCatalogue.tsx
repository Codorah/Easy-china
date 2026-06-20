// @ts-nocheck
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Package, Ship } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, WA_TRANSITAIRE, UNSPLASH, waLink } from "@/lib/constants";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { MediaDisplay } from "@/components/primitives/MediaDisplay";
import { Img } from "@/components/primitives/Img";

export function PageCatalogue({ articles }) {
  useLang();
  const [selectedCat, setSelectedCat] = useState("Tous");

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.cat));
    return ["Tous", ...Array.from(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCat === "Tous") return articles;
    return articles.filter((a) => a.cat === selectedCat);
  }, [articles, selectedCat]);

  return (
    <div>
      {/* Hero banner for catalogue */}
      <div style={{
        position: "relative", height: "clamp(180px, 28vw, 280px)", overflow: "hidden",
        background: "linear-gradient(135deg, var(--secondary) 0%, #0f1f40 60%, var(--accent-strong) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
          <Img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&h=400&q=70" alt="" style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: 0 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 var(--gutter)" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.6rem" }}>
              {t("cat_eyebrow")}
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>
              {t("cat_title")}
            </h1>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: "var(--space-12) var(--gutter) var(--space-section)", maxWidth: "var(--container)", margin: "0 auto" }}>
      <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "var(--text-sm)", maxWidth: "60ch", margin: "0 auto var(--space-8)", lineHeight: 1.7 }}>
        {t("cat_subtitle")}
      </p>

      {/* Category Filter Pills */}
      <ScrollReveal direction="up" delay={0.1}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: "3.5rem"
        }}>
          {categories.map((c) => {
            const isActive = selectedCat === c;
            return (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                style={{
                  background: isActive ? `linear-gradient(135deg, var(--accent), var(--accent-strong))` : "var(--surface-alt)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  color: isActive ? "#fff" : "var(--muted)",
                  padding: "0.6rem 1.5rem",
                  borderRadius: 30,
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.2s, box-shadow 0.2s",
                  boxShadow: isActive ? "0 4px 15px rgba(201, 48, 44, 0.25)" : "none",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)"
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Products Grid */}
      <div className="grid-3">
        {filteredArticles.map((a, i) => (
          <ScrollReveal key={a.id} direction="up" delay={i * 0.06}>
            <GlassCard tilt style={{ height: "100%", padding: 0, overflow: "hidden", border: "1px solid var(--border)", transition: "transform 0.3s, box-shadow 0.3s" }}>
              {/* Image with layered overlays */}
              <div className="zoom-container" style={{ height: 220, position: "relative" }}>
                <MediaDisplay
                  src={a.image}
                  fallback={UNSPLASH[a.cat] || UNSPLASH["Autre"]}
                  alt={a.titre}
                  style={{ height: "100%", borderRadius: "0px" }}
                />
                {/* Gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,20,16,0.7) 0%, rgba(26,20,16,0.1) 40%, transparent 70%)", zIndex: 1 }} />
                {/* Category badge */}
                <div style={{
                  position: "absolute", top: 14, right: 14, zIndex: 2,
                  background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                  color: "var(--accent)", fontSize: "var(--text-xs)", fontWeight: 700,
                  padding: "0.35rem 0.9rem", borderRadius: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)", letterSpacing: "0.04em",
                }}>
                  {a.cat}
                </div>
                {/* Price overlay on image */}
                <div style={{
                  position: "absolute", bottom: 14, left: 14, zIndex: 2,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    background: "linear-gradient(135deg, var(--accent), var(--accent-strong))",
                    color: "#fff", fontSize: "var(--text-sm)", fontWeight: 700,
                    padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)",
                    boxShadow: "var(--shadow-accent)",
                  }}>
                    {a.prix}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.6rem", display: "flex", flexDirection: "column", height: "calc(100% - 220px)", justifyContent: "space-between" }}>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--text)", marginBottom: "0.6rem", lineHeight: 1.3 }}>
                    {a.titre}
                  </h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    {a.desc}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <GoldenBtn
                    variant="solid"
                    onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite passer commande pour le produit "${a.titre}" au prix de "${a.prix}".`))}
                    style={{ flex: 1 }}
                  >
                    <Package size={16}/> Commander
                  </GoldenBtn>
                  <GoldenBtn
                    variant="outline"
                    onClick={() => window.open(waLink(WA_TRANSITAIRE, `Bonjour Easy China, je souhaite obtenir des informations douanières et logistiques pour l'importation de : "${a.titre}".`))}
                    style={{ flex: 1 }}
                  >
                    <Ship size={16}/> Transitaire
                  </GoldenBtn>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
      </div>
    </div>
  );
}
