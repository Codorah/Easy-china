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
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";

// Fallback photos from user's assets
const FALLBACK_PHOTOS = [
  "/assets/Gemini_Generated_Image_pi23pcpi23pcpi23.png",
  "/assets/Gemini_Generated_Image_k2dyogk2dyogk2dy.png",
  "/assets/Gemini_Generated_Image_tkorddtkorddtkor.png",
  "/assets/Gemini_Generated_Image_wfcn48wfcn48wfcn.png",
  "/assets/Gemini_Generated_Image_g3jhl3g3jhl3g3jh.png",
];

export function PageRealisations({ realisations }) {
  useLang();

  const mediaItems = realisations.map((r, i) => ({
    id: i + 1,
    type: "image",
    title: r.titre,
    desc: r.desc,
    url: r.image || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length],
    span: i === 0
      ? "md:col-span-2 md:row-span-3 sm:col-span-2 sm:row-span-2"
      : i % 3 === 1
      ? "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2"
      : "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
  }));

  const videoItems = [
    { id: 100, type: "video", title: "Easy China en Action", desc: "Import et logistique", url: "/assets/1000073482.mp4", span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2" },
    { id: 101, type: "video", title: "Nos Opérations", desc: "Guangzhou - Lomé", url: "/assets/1000073483.mp4", span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2" },
  ];

  const allItems = [...mediaItems, ...videoItems];

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
        <div className="relative z-[2] text-center px-6 lg:px-12">
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

      <div className="py-24 lg:py-32 px-6 lg:px-12 max-w-container mx-auto">
        {/* Interactive Bento Gallery */}
        <InteractiveBentoGallery
          mediaItems={allItems}
          title={t("real_title")}
          description={t("real_subtitle")}
        />

        {/* CTA Section */}
        <div className="mt-16">
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
    </div>
  );
}
