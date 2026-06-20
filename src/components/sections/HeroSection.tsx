// @ts-nocheck
import { motion } from "framer-motion";
import { Globe, Ship, GraduationCap, Package, MessageCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { AnimatedCounter } from "@/components/primitives/AnimatedCounter";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { Img } from "@/components/primitives/Img";

export function HeroSection({ goTo }) {
  useLang();
  const heroStats = [
    { n: 500, l: t("hero_stat1"), s: "+" },
    { n: 15,  l: t("hero_stat3"), s: "+" },
    { n: 100, l: t("hero_stat4"), s: "%" },
  ];

  return (
    <div className="hero-split" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "100vh",
      overflow: "hidden",
    }}>
      {/* Left -- Text Content */}
      <div className="hero-text-panel" style={{
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem var(--space-12) var(--space-16) clamp(var(--space-8), 8%, var(--space-24))",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "var(--accent-soft)",
            border: "1px solid rgba(201, 48, 44, 0.2)",
            color: "var(--accent)",
            fontSize: "var(--text-xs)",
            padding: "0.45rem 1rem",
            borderRadius: "var(--radius-full)",
            marginBottom: "var(--space-8)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          <Globe size={12}/> {t("hero_badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "var(--space-6)",
            fontFamily: "var(--font-display)",
            color: "var(--text)",
            letterSpacing: "-0.03em",
          }}
        >
          EASY CHINA
          <br/>
          <span style={{ color: "var(--accent)" }}>{t("hero_title2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: "var(--muted)",
            fontSize: "var(--text-base)",
            maxWidth: "44ch",
            lineHeight: 1.75,
            marginBottom: "var(--space-8)",
          }}
        >
          {t("hero_desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}
        >
          <GoldenBtn variant="solid" className="animate-pulse-glow" onClick={() => goTo("catalogue")}>
            <Package size={16}/> {t("hero_cta1")}
          </GoldenBtn>
          <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite obtenir des informations sur vos services."))}>
            <MessageCircle size={16}/> {t("hero_cta2")}
          </GoldenBtn>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            gap: 0,
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--border)",
            flexWrap: "wrap",
          }}
        >
          {heroStats.map((s, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 100,
              paddingRight: "var(--space-8)",
              borderRight: i < heroStats.length - 1 ? "1px solid var(--border)" : "none",
              marginRight: i < heroStats.length - 1 ? "var(--space-8)" : 0,
            }}>
              <div style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "var(--font-display)",
                lineHeight: 1,
              }}>
                <AnimatedCounter value={s.n} suffix={s.s} duration={2} />
              </div>
              <div style={{
                fontSize: "var(--text-xs)",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                marginTop: "var(--space-2)",
              }}>
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right -- Image Panel */}
      <div className="hero-image-panel" style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
        <motion.div
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: "100%", width: "100%" }}
        >
          <Img
            src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&h=1400&q=80"
            alt="Conteneurs d'import-export au port"
            style={{ borderRadius: 0, height: "100%", width: "100%", objectFit: "cover" }}
          />
        </motion.div>
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(135deg, rgba(253,252,248,0.25) 0%, rgba(201,48,44,0.08) 40%, rgba(26,47,94,0.35) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)",
        }} />
        {/* Floating decorative badge */}
        <motion.div
          className="animate-float"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          style={{
            position: "absolute", bottom: "12%", left: "8%", zIndex: 2,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
            borderRadius: "var(--radius-md)", padding: "1rem 1.4rem",
            boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--accent-strong))",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <Ship size={20} />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)" }}>+500 imports</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>livrés avec succès</div>
          </div>
        </motion.div>
        <motion.div
          className="animate-float-delay"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          style={{
            position: "absolute", top: "18%", right: "8%", zIndex: 2,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
            borderRadius: "var(--radius-md)", padding: "1rem 1.4rem",
            boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 12,
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--secondary), #2a4a8a)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)" }}>15+ universités</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)" }}>partenaires en Chine</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
