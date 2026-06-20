// @ts-nocheck
import { motion } from "framer-motion";
import { Globe, Ship, GraduationCap, Package, MessageCircle, ArrowRight } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { AnimatedCounter } from "@/components/primitives/AnimatedCounter";
import { Img } from "@/components/primitives/Img";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1];

/* Stagger blur-up entrance for text elements */
const blurUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, delay, ease: EASE },
});

export function HeroSection({ goTo }) {
  useLang();

  const heroStats = [
    { n: 500, l: t("hero_stat1"), s: "+" },
    { n: 15, l: t("hero_stat3"), s: "+" },
    { n: 100, l: t("hero_stat4"), s: "%" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[100dvh] overflow-hidden">
      {/* ── Left Text Panel ── */}
      <div className="bg-bg flex flex-col justify-center pt-32 lg:pt-0 px-6 lg:px-16 pb-16 lg:pb-0">
        {/* Eyebrow badge -- double-bezel pill */}
        <motion.div {...blurUp(0.1)} className="self-start mb-8">
          <div className="p-1.5 rounded-full bg-black/[0.03] ring-1 ring-black/[0.06] inline-flex">
            <div className="rounded-full bg-accent-soft border border-accent/20 px-4 py-2 inline-flex items-center gap-2">
              <Globe size={12} className="text-accent" />
              <span className="text-accent text-xs font-bold tracking-[0.15em] uppercase">
                {t("hero_badge")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...blurUp(0.2)}
          className="text-[clamp(2.4rem,5vw,4rem)] font-display font-bold tracking-tight leading-[1.08] mb-6 text-text"
        >
          EASY CHINA
          <br />
          <span className="bg-gradient-to-r from-accent to-accent-strong bg-clip-text text-transparent">
            {t("hero_title2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...blurUp(0.35)}
          className="text-lg text-muted max-w-[42ch] leading-relaxed mb-10"
        >
          {t("hero_desc")}
        </motion.p>

        {/* CTA Buttons -- Button-in-Button pattern */}
        <motion.div {...blurUp(0.5)} className="flex gap-3 flex-wrap mb-14">
          {/* Primary CTA */}
          <button
            onClick={() => goTo("catalogue")}
            className={cn(
              "group inline-flex items-center gap-3",
              "bg-gradient-to-r from-accent to-accent-strong text-white",
              "rounded-full py-3 pl-7 pr-3",
              "text-sm font-semibold font-body tracking-wide",
              "border-none cursor-pointer",
              "hover:shadow-lg hover:-translate-y-px",
              "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              "active:translate-y-0"
            )}
          >
            <Package size={16} />
            {t("hero_cta1")}
            <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight size={14} />
            </span>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() =>
              window.open(
                waLink(
                  WA_COMMERCIAL,
                  "Bonjour Easy China, je souhaite obtenir des informations sur vos services."
                )
              )
            }
            className={cn(
              "group inline-flex items-center gap-3",
              "bg-transparent text-accent border-2 border-accent",
              "rounded-full py-3 pl-7 pr-3",
              "text-sm font-semibold font-body tracking-wide",
              "cursor-pointer",
              "hover:bg-accent hover:text-white hover:shadow-lg hover:-translate-y-px",
              "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              "active:translate-y-0"
            )}
          >
            <MessageCircle size={16} />
            {t("hero_cta2")}
            <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight size={14} />
            </span>
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          {...blurUp(0.65)}
          className="flex gap-0 pt-8 border-t border-border flex-wrap"
        >
          {heroStats.map((s, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 min-w-[100px]",
                i < heroStats.length - 1 && "pr-8 border-r border-border mr-8"
              )}
            >
              <div className="text-5xl font-display font-bold text-accent leading-none">
                <AnimatedCounter value={s.n} suffix={s.s} duration={2} />
              </div>
              <div className="text-xs text-muted uppercase tracking-[0.06em] font-semibold mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right Image Panel ── */}
      <div className="relative overflow-hidden min-h-[60vh] lg:min-h-screen">
        {/* Main hero image with zoom-in */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: EASE }}
          className="h-full w-full"
        >
          <Img
            src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&h=1400&q=80"
            alt="Conteneurs d'import-export au port"
            className="w-full h-full object-cover rounded-none"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(250,245,240,0.25)] via-[rgba(201,48,44,0.08)] to-[rgba(26,47,94,0.35)]" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/40 to-transparent" />

        {/* Decorative Harbin floating thumbnail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -4 }}
          transition={{ delay: 1.4, duration: 1, ease: EASE }}
          className="absolute top-[20%] left-[6%] z-[2]"
        >
          {/* Double-bezel frame */}
          <div className="p-1.5 rounded-[1.5rem] bg-white/20 ring-1 ring-white/30">
            <div className="w-28 h-36 md:w-36 md:h-44 rounded-[calc(1.5rem-0.375rem)] overflow-hidden shadow-xl">
              <img
                src="/assets/1000073491.jpg"
                alt="Harbin ice festival"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Floating badge -- imports (double-bezel) */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          className="absolute bottom-[12%] left-[8%] z-[2]"
        >
          <div className="p-1.5 rounded-[1.5rem] bg-black/[0.03] ring-1 ring-black/[0.06]">
            <div className="rounded-[calc(1.5rem-0.375rem)] backdrop-blur-xl bg-white/90 shadow-lg px-5 py-4 flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-accent to-accent-strong flex items-center justify-center text-white shrink-0">
                <Ship size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-text">+500 imports</div>
                <div className="text-xs text-muted">livrés avec succès</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating badge -- universities (double-bezel) */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
          className="absolute top-[18%] right-[8%] z-[2]"
        >
          <div className="p-1.5 rounded-[1.5rem] bg-black/[0.03] ring-1 ring-black/[0.06]">
            <div className="rounded-[calc(1.5rem-0.375rem)] backdrop-blur-xl bg-white/90 shadow-lg px-5 py-4 flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-secondary to-[#2a4a8a] flex items-center justify-center text-white shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-text">15+ universités</div>
                <div className="text-xs text-muted">partenaires en Chine</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
