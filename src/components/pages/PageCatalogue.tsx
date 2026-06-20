// @ts-nocheck
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Package, Ship } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, WA_TRANSITAIRE, UNSPLASH, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
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
      <div className={cn(
        "relative h-[clamp(180px,28vw,280px)] overflow-hidden",
        "bg-gradient-to-br from-secondary via-[#0f1f40] to-accent-strong",
        "flex items-center justify-center"
      )}>
        <div className="absolute inset-0 opacity-[0.12]">
          <Img src="/assets/Gemini_Generated_Image_pi23pcpi23pcpi23.png" alt="" className="h-full w-full object-cover rounded-none" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:20px_20px]" />
        <div className="relative z-[2] text-center px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs text-white/60 tracking-[0.18em] uppercase font-bold mb-2.5">
              {t("cat_eyebrow")}
            </div>
            <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white font-display leading-tight">
              {t("cat_title")}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="py-24 lg:py-32 px-6 lg:px-12 max-w-container mx-auto">
        <p className="text-center text-muted text-sm max-w-[60ch] mx-auto mb-8 leading-[1.7]">
          {t("cat_subtitle")}
        </p>

        {/* Category Filter Pills */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex justify-center gap-2.5 flex-wrap mb-14">
            {categories.map((c) => {
              const isActive = selectedCat === c;
              return (
                <span
                  key={c}
                  className={cn(
                    "p-0.5 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isActive
                      ? "bg-accent/10 ring-1 ring-accent/30"
                      : "bg-black/[0.02] ring-1 ring-black/[0.04]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCat(c)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-sm font-semibold",
                      "cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isActive
                        ? "bg-gradient-to-br from-accent to-accent-strong border border-accent text-white shadow-accent -translate-y-0.5"
                        : "bg-surface-alt border border-border text-muted hover:text-text hover:border-accent/30"
                    )}
                  >
                    {c}
                  </button>
                </span>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((a, i) => (
            <ScrollReveal key={a.id} direction="up" delay={i * 0.06}>
              <GlassCard tilt className="h-full p-0 overflow-hidden border border-border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg hover:-translate-y-1">
                {/* Image with layered overlays */}
                <div className="zoom-container h-[220px] relative">
                  <MediaDisplay
                    src={a.image}
                    fallback={UNSPLASH[a.cat] || UNSPLASH["Autre"]}
                    alt={a.titre}
                    className="h-full rounded-none"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-text/70 via-text/10 to-transparent z-[1]" />
                  {/* Category badge */}
                  <span className={cn(
                    "absolute top-3.5 right-3.5 z-[2]",
                    "bg-white/[0.92] backdrop-blur-sm",
                    "text-accent text-xs font-bold",
                    "py-1.5 px-4 rounded-full",
                    "shadow-md tracking-wide"
                  )}>
                    {a.cat}
                  </span>
                  {/* Price overlay on image */}
                  <div className="absolute bottom-3.5 left-3.5 z-[2] flex items-center gap-2.5">
                    <span className={cn(
                      "bg-gradient-to-br from-accent to-accent-strong",
                      "text-white text-sm font-bold",
                      "py-2 px-4 rounded-sm shadow-accent"
                    )}>
                      {a.prix}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col h-[calc(100%-220px)] justify-between">
                  <div className="text-left">
                    <h3 className="text-md font-bold text-text mb-2.5 leading-tight">
                      {a.titre}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-6">
                      {a.desc}
                    </p>
                  </div>

                  <div className="flex gap-2.5">
                    <GoldenBtn
                      variant="solid"
                      onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite passer commande pour le produit "${a.titre}" au prix de "${a.prix}".`))}
                      className="flex-1"
                    >
                      <Package size={16}/> Commander
                    </GoldenBtn>
                    <GoldenBtn
                      variant="outline"
                      onClick={() => window.open(waLink(WA_TRANSITAIRE, `Bonjour Easy China, je souhaite obtenir des informations douanières et logistiques pour l'importation de : "${a.titre}".`))}
                      className="flex-1"
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
