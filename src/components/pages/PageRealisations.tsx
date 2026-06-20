// @ts-nocheck
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, UNSPLASH_REAL, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { MediaDisplay } from "@/components/primitives/MediaDisplay";
import { Img } from "@/components/primitives/Img";

// Fallback photos from user's assets
const FALLBACK_PHOTOS = [
  "/assets/1000073489.jpg",
  "/assets/1000073490.jpg",
  "/assets/1000073491.jpg",
];

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
      <div className={cn(
        "relative h-[clamp(180px,28vw,280px)] overflow-hidden",
        "bg-gradient-to-br from-accent via-accent-strong to-secondary",
        "flex items-center justify-center"
      )}>
        <div className="absolute inset-0 opacity-[0.15]">
          <Img src="/assets/1000073491.jpg" alt="" className="h-full w-full object-cover rounded-none" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:20px_20px]" />
        <div className="relative z-[2] text-center px-[clamp(20px,5vw,48px)]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 tracking-[0.18em] uppercase font-bold mb-2.5">
              {t("real_eyebrow")}
            </div>
            <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white font-display leading-tight">
              {t("real_title")}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="py-12 px-[clamp(20px,5vw,48px)] pb-[clamp(64px,10vw,112px)] max-w-container mx-auto">
        <p className="text-center text-muted text-sm max-w-[60ch] mx-auto mb-8 leading-[1.7]">
          {t("real_subtitle")}
        </p>

        {/* Bento Grid */}
        <div className="bento-grid mb-16">
          {realisations.map((r, i) => {
            const bentoStyle = getBentoStyle(i);
            const isLarge = bentoStyle.gridColumn.includes("2") || bentoStyle.gridRow.includes("2");
            // Use user's fallback photos when the realisation has no image
            const fallbackImage = r.image
              ? (UNSPLASH_REAL[r.cat] || UNSPLASH_REAL["Tourisme"])
              : FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length];
            return (
              <ScrollReveal
                key={r.id}
                direction="up"
                delay={i * 0.06}
                style={{ ...bentoStyle }}
                className={isLarge ? "bento-card-large" : "bento-card"}
              >
                <GlassCard tilt className="h-full p-0 overflow-hidden border border-border">
                  <div className="flex flex-col h-full">
                    <div className={cn(
                      "zoom-container relative shrink-0",
                      isLarge ? "h-[180px]" : "h-[140px]"
                    )}>
                      <MediaDisplay
                        src={r.image}
                        fallback={fallbackImage}
                        alt={r.titre}
                        className="rounded-none h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-text/65 to-transparent" />
                      <div className="absolute top-3 left-3 z-[2] flex items-center gap-2">
                        <span className={cn(
                          "bg-white/90 backdrop-blur-sm",
                          "text-accent text-xs font-bold",
                          "py-1 px-3 rounded-full",
                          "uppercase tracking-wide"
                        )}>
                          {r.cat}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-3 z-[2] flex gap-0.5">
                        {Array.from({ length: Number(r.stars || 5) }).map((_, stIdx) => (
                          <Star key={stIdx} size={12} fill="#fbbf24" color="#fbbf24" />
                        ))}
                      </div>
                    </div>

                    <div className="px-6 py-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className={cn(
                          isLarge ? "text-lg" : "text-base",
                          "font-bold text-text leading-tight",
                          "mb-2 font-display text-left"
                        )}>
                          {r.titre}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed mb-4 text-left">
                          {r.desc}
                        </p>
                      </div>

                      {r.temoignage && (
                        <div className="bg-accent-soft rounded-sm p-4 relative">
                          <div className="text-accent text-[2rem] leading-none font-serif opacity-25 absolute top-1.5 left-2.5">&ldquo;</div>
                          <p className="italic text-xs text-text leading-snug mb-2 text-left pl-3">
                            {r.temoignage}
                          </p>
                          <span className="text-xs font-bold text-accent pl-3">&mdash; {r.client}</span>
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
          <GlassCard className={cn(
            "bg-gradient-to-br from-surface-alt to-white",
            "border-[1.5px] border-border",
            "p-10 md:p-14 text-center"
          )}>
            <h3 className="text-[1.8rem] font-bold text-text mb-4 font-display">
              Vous aussi, concrétisez vos projets avec la Chine !
            </h3>
            <p className="text-muted text-base max-w-[650px] mx-auto mb-10 leading-relaxed">
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
