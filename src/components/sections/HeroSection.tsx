// @ts-nocheck
import { motion } from "framer-motion";
import { Globe, Ship, GraduationCap, Package, MessageCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { AnimatedCounter } from "@/components/primitives/AnimatedCounter";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { Img } from "@/components/primitives/Img";
import { cn } from "@/lib/utils";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroSection({ goTo }) {
  useLang();
  const heroStats = [
    { n: 500, l: t("hero_stat1"), s: "+" },
    { n: 15,  l: t("hero_stat3"), s: "+" },
    { n: 100, l: t("hero_stat4"), s: "%" },
  ];

  return (
    <div className="hero-split grid grid-cols-1 md:grid-cols-2 min-h-screen overflow-hidden">
      {/* Left -- Text Content */}
      <motion.div
        className="hero-text-panel bg-bg flex flex-col justify-center pt-32 pb-16 px-[clamp(2rem,8%,6rem)]"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 bg-accent-soft border border-accent/20 text-accent text-xs px-4 py-2 rounded-full mb-8 tracking-[0.15em] uppercase font-bold self-start"
        >
          <Globe size={12} /> {t("hero_badge")}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-[clamp(2.2rem,4vw,3.6rem)] font-bold leading-[1.1] mb-6 font-display text-text tracking-[-0.03em]"
        >
          EASY CHINA
          <br />
          <span className="text-accent">{t("hero_title2")}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-muted text-base max-w-[44ch] leading-[1.75] mb-8"
        >
          {t("hero_desc")}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex gap-3 flex-wrap mb-12"
        >
          <GoldenBtn variant="solid" className="animate-pulse-glow" onClick={() => goTo("catalogue")}>
            <Package size={16} /> {t("hero_cta1")}
          </GoldenBtn>
          <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite obtenir des informations sur vos services."))}>
            <MessageCircle size={16} /> {t("hero_cta2")}
          </GoldenBtn>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex gap-0 pt-6 border-t border-border flex-wrap"
        >
          {heroStats.map((s, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 min-w-[100px]",
                i < heroStats.length - 1 && "pr-8 border-r border-border mr-8"
              )}
            >
              <div className="text-4xl font-bold text-accent font-display leading-none">
                <AnimatedCounter value={s.n} suffix={s.s} duration={2} />
              </div>
              <div className="text-xs text-muted uppercase tracking-[0.06em] font-semibold mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right -- Image Panel */}
      <div className="hero-image-panel relative overflow-hidden min-h-screen">
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <Img
            src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&h=1400&q=80"
            alt="Conteneurs d'import-export au port"
            style={{ borderRadius: 0, height: "100%", width: "100%", objectFit: "cover" }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(253,252,248,0.25)] via-[rgba(201,48,44,0.08)] to-[rgba(26,47,94,0.35)]" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 to-transparent" />

        {/* Decorative Harbin image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[22%] left-[6%] z-[2] w-28 h-36 md:w-36 md:h-44 rounded-xl overflow-hidden shadow-lg ring-2 ring-white/60"
        >
          <img
            src="/assets/1000073491.jpg"
            alt="Harbin ice festival"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating badge -- imports */}
        <motion.div
          className="animate-float absolute bottom-[12%] left-[8%] z-[2] backdrop-blur-xl bg-white/90 shadow-lg rounded-xl px-5 py-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-accent to-accent-strong flex items-center justify-center text-white">
            <Ship size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-text">+500 imports</div>
            <div className="text-xs text-muted">livrés avec succès</div>
          </div>
        </motion.div>

        {/* Floating badge -- universities */}
        <motion.div
          className="animate-float-delay absolute top-[18%] right-[8%] z-[2] backdrop-blur-xl bg-white/90 shadow-lg rounded-xl px-5 py-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-secondary to-[#2a4a8a] flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-text">15+ universités</div>
            <div className="text-xs text-muted">partenaires en Chine</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
