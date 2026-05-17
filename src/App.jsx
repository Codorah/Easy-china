import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Ship, GraduationCap, Wrench, FileCheck, Globe, MapPin,
  Phone, Mail, ArrowRight, Send, Lock, LogOut, Plus,
  Edit2, Trash2, ChevronDown, Menu, X, Star, Package,
  Building2, Plane, Users, Award, TrendingUp, Clock,
  MessageCircle, CheckCircle, AlertCircle, Upload, Image,
  Search, Filter, ShieldCheck, Settings
} from "lucide-react";

// ─── THEME & COLOR SYSTEM ───────────────────────────────────────────────────
const T = {
  bgDeep: "#050810",     // Fond de page ultra-sombre premium
  bgCard: "#0d1117",     // Fond des cartes
  bgGlass: "rgba(255, 255, 255, 0.04)",
  gold: "#c9a84c",       // Or Luxe Signature
  gold2: "#f0d080",      // Or Clair Hover
  pink: "#e91e8c",       // Rose vibrant accent
  border: "rgba(201, 168, 76, 0.15)", // Bordure fine dorée
  text: "#f0ede8",       // Texte clair off-white
  muted: "rgba(240, 237, 232, 0.45)",  // Texte estompé
  radius: 14,
};

// ─── CONSTANTS & CONFIGURATION ───────────────────────────────────────────────
const WA_COMMERCIAL = "+22890000001";
const WA_TRANSITAIRE = "+22890000002";
const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || "ae16d0ee679873e767fc8798e0371a3a2bb59ced7577ec1ba724c29eece73db8";

const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const UNSPLASH = {
  "Import général": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&h=400&q=80",
  "Électronique":   "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&h=400&q=80",
  "Textile":        "https://images.unsplash.com/photo-1543097692-fa13c6cd8595?auto=format&fit=crop&w=600&h=400&q=80",
  "Machines":       "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&h=400&q=80",
  "Alimentaire":    "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&h=400&q=80",
  "Autre":          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=400&q=80",
};

const UNSPLASH_REAL = {
  "Import":    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&h=400&q=80",
  "Études":    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&h=400&q=80",
  "Visa":      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&h=400&q=80",
  "Formation": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&h=400&q=80",
  "Tourisme":  "https://images.unsplash.com/photo-1543097692-fa13c6cd8595?auto=format&fit=crop&w=600&h=400&q=80",
};

// ─── SEED DEFAULT DATA ───────────────────────────────────────────────────────
const DEFAULT_ARTICLES = [
  { id: "1", titre: "Machines de Pressing Industriel", prix: "À partir de 1,200 USD", desc: "Sourcing et livraison de lignes de lavage, séchage et repassage haut de gamme.", cat: "Machines", image: "" },
  { id: "2", titre: "Lignes d'Éclairage LED Connectées", prix: "À partir de 450 USD", desc: "Matériel d'éclairage LED haute puissance et basse consommation pour chantiers professionnels.", cat: "Électronique", image: "" },
  { id: "3", titre: "Textile de Lin & Soie Premium", prix: "À partir de 3 USD / m", desc: "Importation directe de rouleaux de textiles nobles depuis les meilleurs tisseurs de Zhejiang.", cat: "Textile", image: "" },
  { id: "4", titre: "Automates de Conditionnement Alimentaire", prix: "À partir de 2,400 USD", desc: "Machines de scellage, emballage et étiquetage de précision pour le secteur agroalimentaire.", cat: "Machines", image: "" },
  { id: "5", titre: "Pompes Solaires Agricoles Haute Efficacité", prix: "À partir de 800 USD", desc: "Systèmes d'irrigation alimentés par énergie solaire, idéaux pour les exploitations agricoles.", cat: "Import général", image: "" }
];

const DEFAULT_REALISATIONS = [
  { id: "1", titre: "Importation de 12 Tonnes de Textile", cat: "Import", desc: "Sourcing minutieux, contrôle qualité en usine et acheminement maritime sécurisé jusqu'au port de Lomé.", client: "Mme Ablavi T.", temoignage: "Easy China a pris en charge toute la chaîne logistique et les douanes. Zéro tracas, service parfait !", stars: "5", image: "" },
  { id: "2", titre: "15 Bourses Complètes en Ingénierie", cat: "Études", desc: "Accompagnement administratif, dépôt de dossier consulaire et admission de 15 brillants étudiants à Pékin.", client: "M. Koffi L.", temoignage: "Grâce à leur expertise, mon fils a intégré Tsinghua avec une bourse d'excellence gouvernementale.", stars: "5", image: "" },
  { id: "3", titre: "Lancement d'une Blanchisserie Moderne", cat: "Formation", desc: "Livraison, configuration technique de pressing industriel et cycle complet de formation des équipes à Lomé.", client: "M. Kodjo A.", temoignage: "Les machines importées sont d'une efficacité incroyable. Le support technique est irréprochable.", stars: "5", image: "" },
  { id: "4", titre: "Délégation d'Affaires - Visas Express", cat: "Visa", desc: "Montage des dossiers consulaires et obtention accélérée de visas d'affaires pour une visite d'usine à Guangzhou.", client: "M. Yao K.", temoignage: "Visa obtenu en moins de 10 jours ouvrés. Notre mission commerciale en Chine a été une réussite totale.", stars: "5", image: "" }
];

// Helper functions
const sanitize = s => s.replace(/<[^>]*>/g, '').trim();

const sha256 = async (str) => {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ─── CUSTOM HOOKS ────────────────────────────────────────────────────────────
function useScrollReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.once) {
          observer.unobserve(entry.target);
        }
      } else if (!options.once) {
        setIsVisible(false);
      }
    }, { threshold: options.threshold || 0.1, ...options });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.once, options.threshold]);

  return [ref, isVisible];
}

function useCountUp(target, duration = 2, isTriggered = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;
    
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const startTime = performance.now();
    let animationFrameId;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= totalMiliseconds) {
        setCount(end);
        return;
      }

      const progress = elapsedTime / totalMiliseconds;
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, isTriggered]);

  return count;
}

function useParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;
  const scale = Math.max(1, 1.02 - (scrollY / 400) * 0.02);

  return { parallaxOffset, scale };
}

function useMouseTilt(ref, maxDeg = 8) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 0, glareY: 0, isHovered: false });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const px = (x / width) - 0.5;
    const py = (y / height) - 0.5;
    
    const rotateX = -(py * maxDeg * 2);
    const rotateY = px * maxDeg * 2;
    
    setTilt({
      rotateX,
      rotateY,
      glareX: (x / width) * 100,
      glareY: (y / height) * 100,
      isHovered: true
    });
  }, [ref, maxDeg]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 0, glareY: 0, isHovered: false });
  }, []);

  return { tilt, handleMouseMove, handleMouseLeave };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

// ─── PREMIUM UTILITY COMPONENTS ──────────────────────────────────────────────

// 1. Composant Image Sécurisé avec Skeleton Shimmer & Gestion des Erreurs
const Img = ({ src, alt, style={} }) => {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div style={{position:"relative", overflow:"hidden", ...style}}>
      {!loaded && !err && (
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(90deg, #0d1117 25%, rgba(201,168,76,0.15) 50%, #0d1117 75%)",
          backgroundSize:"200% 100%",
          animation:"shimmer 1.5s infinite linear",
          borderRadius:"inherit"
        }}/>
      )}
      {!err
        ? <img src={src} alt={alt} loading="lazy"
            onLoad={()=>setLoaded(true)}
            onError={()=>setErr(true)}
            style={{width:"100%",height:"100%",objectFit:"cover",
              opacity:loaded?1:0,transition:"opacity .3s",borderRadius:"inherit"}}/>
        : <div style={{width:"100%",height:"100%",background:"#0d1117",
            border:"1px solid rgba(201,168,76,0.15)",
            display:"flex",alignItems:"center",justifyContent:"center",
            color: T.gold,borderRadius:"inherit"}}>
            <Image size={32}/>
          </div>
      }
    </div>
  );
};

// 2. Bouton Réutilisable Luxe
function GoldenBtn({ children, variant = "solid", onClick, style = {}, disabled = false, ariaLabel }) {
  const [ripples, setRipples] = useState([]);
  const [isDown, setIsDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (onClick) onClick(e);
  };

  const getBtnStyle = () => {
    const base = {
      position: "relative",
      border: "none",
      borderRadius: 40,
      padding: "0.85rem 2.2rem",
      fontSize: "0.88rem",
      fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: "0.5px",
      cursor: disabled ? "not-allowed" : "pointer",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      transform: isDown ? "scale(0.97)" : isHovered ? "translateY(-2px)" : "translateY(0)",
      outline: "none",
      userSelect: "none",
      opacity: disabled ? 0.6 : 1
    };

    if (variant === "solid") {
      return {
        ...base,
        background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
        color: T.bgDeep,
        boxShadow: isHovered && !disabled ? `0 8px 30px rgba(201, 168, 76, 0.4)` : `0 4px 15px rgba(201, 168, 76, 0.15)`,
      };
    } else if (variant === "outline") {
      return {
        ...base,
        background: isHovered && !disabled ? "rgba(201, 168, 76, 0.08)" : "transparent",
        color: T.gold,
        border: `1.5px solid ${T.gold}`,
        boxShadow: isHovered && !disabled ? `0 0 20px rgba(201, 168, 76, 0.2)` : "none",
      };
    } else if (variant === "ghost") {
      return {
        ...base,
        background: isHovered && !disabled ? "rgba(255, 255, 255, 0.04)" : "transparent",
        color: T.text,
      };
    } else if (variant === "glow") {
      return {
        ...base,
        background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
        color: T.bgDeep,
        boxShadow: `0 0 25px rgba(201, 168, 76, 0.35)`,
      };
    }
    return base;
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {variant === "glow" && !disabled && (
        <div style={{
          position: "absolute",
          inset: -3,
          borderRadius: 44,
          background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
          filter: "blur(12px)",
          opacity: isHovered ? 0.8 : 0.4,
          animation: "pulseGlow 2.5s infinite ease-in-out",
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
        }} />
      )}
      <button
        aria-label={ariaLabel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsDown(false); }}
        onMouseDown={() => setIsDown(true)}
        onMouseUp={() => setIsDown(false)}
        onClick={handleClick}
        style={{ ...getBtnStyle(), ...style }}
        disabled={disabled}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.35)",
              transform: "translate(-50%, -50%) scale(0)",
              animation: "rippleAnim 0.6s linear",
              pointerEvents: "none",
            }}
          />
        ))}
        {children}
      </button>
    </div>
  );
}

// 3. Carte Premium Glassmorphism
function GlassCard({ children, tilt = true, style = {}, lift = 5, className = "" }) {
  const cardRef = useRef(null);
  const { tilt: tiltState, handleMouseMove, handleMouseLeave } = useMouseTilt(cardRef, 6);

  const getCardStyle = () => {
    const isHovered = tiltState.isHovered;
    const base = {
      position: "relative",
      borderRadius: T.radius,
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${isHovered ? "rgba(201, 168, 76, 0.35)" : "rgba(201, 168, 76, 0.18)"}`,
      padding: "2rem",
      overflow: "hidden",
      boxShadow: isHovered ? "0 20px 45px rgba(0, 0, 0, 0.45)" : "0 4px 20px rgba(0, 0, 0, 0.2)",
    };

    if (tilt && isHovered) {
      return {
        ...base,
        transform: `perspective(800px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) translateY(-${lift}px)`,
      };
    } else if (isHovered) {
      return {
        ...base,
        transform: `translateY(-${lift}px)`,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      };
    }

    return {
      ...base,
      transform: "translateY(0)",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    };
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={tilt ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        ...getCardStyle(),
        ...style,
      }}
    >
      {tilt && tiltState.isHovered && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(255, 255, 255, 0.06) 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 1,
        }} />
      )}
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

// 4. Compteur animé
function AnimatedCounter({ value, suffix = "+", duration = 2.5 }) {
  const [ref, isVisible] = useScrollReveal({ once: true, threshold: 0.1 });
  const count = useCountUp(value, duration, isVisible);

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      {count}{suffix}
    </span>
  );
}

// 5. Wrapper Scroll Reveal
function ScrollReveal({ children, delay = 0, direction = "up", duration = 0.6, style = {}, className = "" }) {
  const [ref, isVisible] = useScrollReveal({ once: true, threshold: 0.08 });
  
  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up": return "translateY(40px)";
        case "down": return "translateY(-40px)";
        case "left": return "translateX(40px)";
        case "right": return "translateX(-40px)";
        default: return "translateY(40px)";
      }
    }
    return "translate(0, 0)";
  };

  const finalStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    ...style
  };

  return (
    <div ref={ref} className={className} style={finalStyle}>
      {children}
    </div>
  );
}

// 6. ParticleCanvas
function ParticleCanvas({ color = "#c9a84c", count = 50 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.1 + 0.8,
        alpha: Math.random() * 0.3 + 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < count; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - dist / 120) * 0.12;
            ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

// 7. SectionTitle
function SectionTitle({ eyebrow, title, subtitle, centered = true }) {
  return (
    <ScrollReveal direction="up" delay={0}>
      <div style={{
        textAlign: centered ? "center" : "left",
        marginBottom: "3.5rem",
        position: "relative",
      }}>
        {eyebrow && (
          <div style={{
            fontSize: "0.75rem",
            color: T.gold,
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "0.6rem",
          }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          background: `linear-gradient(90deg, ${T.gold}, ${T.gold2})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
          marginBottom: "0.8rem",
          lineHeight: 1.2,
          position: "relative",
          fontFamily: "'Syne', sans-serif"
        }}>
          {title}
          <span style={{
            position: "absolute",
            bottom: -8,
            left: centered ? "50%" : 0,
            transform: centered ? "translateX(-50%)" : "none",
            width: 45,
            height: 2,
            background: T.gold,
            borderRadius: 2,
          }} />
        </h2>
        {subtitle && (
          <p style={{
            color: T.muted,
            fontSize: "0.95rem",
            maxWidth: 540,
            margin: centered ? "1.2rem auto 0" : "1.2rem 0 0",
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}

// 8. Timeline Notre Histoire
function Timeline({ items }) {
  return (
    <div className="timeline-container" style={{
      position: "relative",
      maxWidth: 900,
      margin: "0 auto",
      padding: "2rem 0",
    }}>
      <div className="timeline-line" style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 1,
        background: `linear-gradient(to bottom, transparent, rgba(201, 168, 76, 0.3) 15%, rgba(201, 168, 76, 0.3) 85%, transparent)`,
        transform: "translateX(-50%)",
      }} />

      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        return (
          <div
            key={index}
            className="timeline-item"
            style={{
              display: "flex",
              justifyContent: isLeft ? "flex-start" : "flex-end",
              position: "relative",
              marginBottom: "3.2rem",
              width: "100%",
            }}
          >
            <div className="timeline-dot" style={{
              position: "absolute",
              left: "50%",
              top: 24,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: T.bgDeep,
              border: `3px solid ${T.gold}`,
              transform: "translateX(-50%)",
              boxShadow: `0 0 12px ${T.gold}`,
              zIndex: 3,
            }} />

            <div className="timeline-card-wrapper" style={{ width: "45%" }}>
              <ScrollReveal direction={isLeft ? "left" : "right"} delay={index * 0.08}>
                <GlassCard tilt={true} style={{ padding: "1.8rem" }}>
                  <span style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: T.gold,
                    display: "block",
                    marginBottom: "0.4rem",
                    fontFamily: "'Syne', sans-serif"
                  }}>
                    {item.year}
                  </span>
                  <h4 style={{
                    color: T.text,
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    color: T.muted,
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </p>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 9. Témoignage Card
function Testimonial({ quote, author, role, stars }) {
  return (
    <GlassCard tilt={true} style={{ padding: "2.2rem 2rem", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: "2.8rem", color: T.gold, lineHeight: 0.4, opacity: 0.3, marginBottom: "0.8rem", fontFamily: "serif" }}>“</div>
        <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: T.text, lineHeight: 1.65, marginBottom: "1.8rem" }}>
          {quote}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.gold}, ${T.pink})`,
          border: `1.5px solid ${T.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: T.bgDeep, fontSize: "0.95rem"
        }}>
          {author.charAt(0)}
        </div>
        <div>
          <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: T.text, margin: 0 }}>{author}</h4>
          <span style={{ fontSize: "0.72rem", color: T.muted, display: "block", marginTop: 2 }}>{role}</span>
          <div style={{ color: T.gold, display: "flex", gap: 2, marginTop: 4 }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={14} fill={idx < stars ? T.gold : "transparent"} color={T.gold} />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// 10. Carrousel Témoignages
function TestimonialCarousel() {
  const testimonials = [
    { quote: "Grâce à Easy China, j'ai importé 3 conteneurs de machines textiles sans aucun souci logistique. L'équipe à Lomé et Guangzhou est exceptionnelle.", author: "M. Yao K.", role: "CEO, Africa Textiles", stars: 5 },
    { quote: "L'assistance pour mon admission à l'Université de Wuhan a été rapide et transparente. J'ai même obtenu une bourse complète. Merci infiniment !", author: "Mlle Amivi S.", role: "Étudiante en Master", stars: 5 },
    { quote: "Leur formation sur les machines de pressing industriel en Chine a transformé ma blanchisserie à Lomé. Recommandé à 100% !", author: "M. Kodjo A.", role: "Directeur, Smart Wash", stars: 5 },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div style={{ maxWidth: 650, margin: "0 auto", position: "relative", overflow: "hidden", padding: "1rem" }}>
      <div style={{
        display: "flex",
        transform: `translateX(-${active * 100}%)`,
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{ minWidth: "100%", padding: "0 10px" }}>
            <Testimonial quote={t.quote} author={t.author} role={t.role} stars={t.stars} />
          </div>
        ))}
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "1.5rem" }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              background: active === i ? T.gold : "rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── LOGO SVG PROFESSIONNEL ──────────────────────────────────────────────────
const Logo = ({ onClick, size="md" }) => {
  const s = size==="sm" ? 32 : 42;
  return (
    <div onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:12,
        cursor:"pointer",userSelect:"none"}}>
      <svg width={s} height={s} viewBox="0 0 42 42" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="42" rx="11" fill="url(#logoGrad)"/>
        <path d="M10 13h10M10 13v16M10 21h8M10 29h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M24 16a7 7 0 1 0 0 10" stroke="#f0d080" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <polygon points="36,6 37.2,9.6 41,9.6 38,11.8 39.2,15.4 36,13.2 32.8,15.4 34,11.8 31,9.6 34.8,9.6" fill="#e53935" opacity=".9"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="42" y2="42">
            <stop offset="0%" stopColor="#0d1117"/>
            <stop offset="100%" stopColor="#1a2540"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{lineHeight:1.15, textAlign: "left"}}>
        <div style={{
          color:"#fff", fontWeight:800, fontSize:"1.05rem",
          letterSpacing:"2.5px", fontFamily:"'Syne','Segoe UI',sans-serif"
        }}>
          EASY <span style={{color:"#c9a84c"}}>CHINA</span>
        </div>
        <div style={{
          color:"rgba(255,255,255,.35)", fontSize:".48rem",
          letterSpacing:"3.5px", marginTop:2, textTransform:"uppercase"
        }}>
          Togo · Réunion · Chine
        </div>
      </div>
    </div>
  );
};

// 11. Floating Navigation
function FloatingNav({ pages, activePage, setPage }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: 3,
        background: `linear-gradient(to right, ${T.gold}, ${T.gold2})`,
        zIndex: 1001,
        transition: "width 0.1s ease",
      }} />

      <nav style={{
        position: "fixed",
        top: isScrolled ? 14 : 0,
        left: isScrolled ? "5%" : 0,
        right: isScrolled ? "5%" : 0,
        width: isScrolled ? "90%" : "100%",
        maxWidth: 1400,
        margin: "0 auto",
        background: isScrolled ? "rgba(5, 8, 16, 0.78)" : "transparent",
        backdropFilter: isScrolled ? "blur(18px)" : "none",
        border: isScrolled ? `1px solid rgba(201, 168, 76, 0.15)` : "1px solid transparent",
        borderTop: isScrolled ? `1.5px solid rgba(201, 168, 76, 0.25)` : "1px solid transparent",
        borderRadius: isScrolled ? T.radius : 0,
        height: 70,
        padding: "0 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 1000,
      }}>
        <Logo onClick={() => { setPage("accueil"); setIsOpen(false); }} />

        <div className="nav-desktop-menu" style={{ display: "flex", gap: 6 }}>
          {pages.map(([k, l]) => (
            <NavBtn key={k} label={l} active={activePage === k} onClick={() => setPage(k)} />
          ))}
        </div>

        <button
          aria-label="Ouvrir le menu"
          className="nav-mobile-trigger"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 30,
            height: 30,
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            gap: 6,
            position: "relative",
            zIndex: 1002,
          }}
        >
          {isOpen ? <X size={24} color={T.gold}/> : <Menu size={24} color={T.gold}/>}
        </button>
      </nav>

      {isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5, 8, 16, 0.98)",
          backdropFilter: "blur(20px)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          animation: "pageEnter 0.3s ease",
        }}>
          {pages.map(([k, l]) => (
            <button
              key={k}
              onClick={() => { setPage(k); setIsOpen(false); }}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: activePage === k ? T.gold : T.text,
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "1px",
                fontFamily: "'Syne', sans-serif"
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function NavBtn({ label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active || hov ? "rgba(201, 168, 76, 0.08)" : "none",
        border: "none",
        color: active ? T.gold : hov ? "#fff" : T.muted,
        cursor: "pointer",
        padding: "0.55rem 1.15rem",
        borderRadius: 8,
        fontSize: "0.85rem",
        fontWeight: 600,
        letterSpacing: "0.3px",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}
    >
      {label}
      <span style={{
        position: "absolute",
        bottom: 4,
        left: active || hov ? "20%" : "50%",
        right: active || hov ? "20%" : "50%",
        height: 2,
        background: T.gold,
        borderRadius: 2,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }} />
    </button>
  );
}

function Tag({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(201, 168, 76, 0.18)" : "rgba(201, 168, 76, 0.08)",
        color: T.gold,
        border: `1px solid rgba(201, 168, 76, ${hov ? 0.4 : 0.2})`,
        padding: "0.45rem 1rem",
        borderRadius: 20,
        fontSize: "0.75rem",
        fontWeight: 600,
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "all 0.25s ease",
        cursor: "default",
      }}
    >
      {children}
    </span>
  );
}

function CityPill({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(201, 168, 76, 0.1)" : "rgba(255, 255, 255, 0.03)",
        border: `1px solid ${hov ? T.gold : "rgba(255, 255, 255, 0.08)"}`,
        padding: "0.45rem 1.25rem",
        borderRadius: 30,
        fontSize: "0.8rem",
        fontWeight: 600,
        color: hov ? T.gold2 : T.text,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 4px 15px rgba(201,168,76,0.15)" : "none",
        transition: "all 0.25s ease",
        cursor: "default"
      }}
    >
      {children}
    </span>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, options, rows }) {
  const [foc, setFoc] = useState(false);
  
  const baseStyle = {
    width: "100%",
    padding: "0.85rem 1.1rem",
    border: `1.5px solid ${foc ? T.gold : "rgba(201, 168, 76, 0.2)"}`,
    borderRadius: 10,
    fontSize: "0.88rem",
    background: T.bgDeep,
    color: T.text,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxShadow: foc ? `0 0 15px rgba(201, 168, 76, 0.15)` : "none",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div style={{ marginBottom: "1.4rem", textAlign: "left" }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "0.8rem",
          color: T.gold,
          marginBottom: 6,
          fontWeight: 600,
          letterSpacing: "0.5px"
        }}>
          {label}
        </label>
      )}
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={{ ...baseStyle, cursor: "pointer" }}
        >
          {options.map((o) => (
            <option key={o} value={o} style={{ background: T.bgCard, color: T.text }}>
              {o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={{ ...baseStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
}

// 12. Enveloppe de transition de page
function PageTransition({ children, pageKey }) {
  return (
    <div
      key={pageKey}
      style={{
        animation: "pageEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {children}
    </div>
  );
}

// 🔍 COMPOSANT SEOHEAD DYNAMIQUE ────────────────────────────────────────────────
function SEOHead({ page }) {
  useEffect(() => {
    let title = "Easy China – Import, Études & Visa Chine depuis le Togo";
    let desc = "Easy China : votre partenaire d'import depuis la Chine, inscription universités chinoises, visa, formation professionnelle. Bureau à Lomé, Togo.";
    let keywords = "import chine togo, université chine inscription, visa chine togo, formation chine, lomé chine, easy china services, transitaire togo";

    if (page === "catalogue") {
      title = "Easy China – Catalogue d'Importation Sourcing Direct";
      desc = "Découvrez notre sélection de produits industriels et matériels de haute qualité, sourcés directement auprès des meilleures usines certifiées en Chine.";
    } else if (page === "realisations") {
      title = "Easy China – Nos Réalisations & Témoignages Clients";
      desc = "Découvrez comment nous accompagnons nos clients partenaires au Togo et en Afrique dans la concrétisation de leurs projets académiques et logistiques.";
    }

    document.title = title;

    const updateMeta = (name, value, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", value);
    };

    updateMeta("description", desc);
    updateMeta("keywords", keywords);
    updateMeta("robots", "index, follow");
    updateMeta("author", "Easy China Services");

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://easychina-services.com");

    updateMeta("og:type", "website", true);
    updateMeta("og:title", title, true);
    updateMeta("og:description", desc, true);
    updateMeta("og:image", "https://easychina-services.com/og-image.jpg", true);
    updateMeta("og:url", "https://easychina-services.com", true);
    updateMeta("og:locale", "fr_FR", true);
    updateMeta("og:site_name", "Easy China", true);

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", desc);

    let scriptSchema = document.getElementById("jsonld-schema");
    if (!scriptSchema) {
      scriptSchema = document.createElement("script");
      scriptSchema.id = "jsonld-schema";
      scriptSchema.type = "application/ld+json";
      document.head.appendChild(scriptSchema);
    }
    scriptSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Easy China Services",
      "description": desc,
      "url": "https://easychina-services.com",
      "telephone": "+22890000001",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lomé",
        "addressCountry": "TG"
      },
      "areaServed": ["TG", "RE", "CN"],
      "serviceType": ["Import", "Études", "Visa", "Formation", "Tourisme"]
    });
  }, [page]);

  return null;
}

// ─── PAGES & SECTIONS ────────────────────────────────────────────────────────

// 1. Section Hero
function HeroSection({ goTo }) {
  const { parallaxOffset, scale } = useParallaxHero();

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      background: T.bgDeep,
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "8rem 2rem 4rem",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        transform: `translateY(${parallaxOffset}px)`,
        zIndex: 0,
        pointerEvents: "none",
      }}>
        <Img 
          src="https://images.unsplash.com/photo-1540759786422-c60d5ed57d7b?auto=format&fit=crop&w=1600&h=900&q=80" 
          alt="Shanghai skyline" 
          style={{ borderRadius: 0, width: "100%", height: "120%" }} 
        />
      </div>

      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(5, 8, 16, 0.75)",
        zIndex: 1,
        pointerEvents: "none"
      }} />

      <ParticleCanvas color={T.gold} count={50} />

      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 800,
        margin: "0 auto",
        transform: `scale(${scale})`,
        transition: "transform 0.1s ease-out"
      }}>
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(201, 168, 76, 0.08)",
            border: `1px solid rgba(201, 168, 76, 0.25)`,
            color: T.gold,
            fontSize: "0.75rem",
            padding: "0.45rem 1rem",
            borderRadius: 30,
            marginBottom: "2rem",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 600
          }}>
            <Globe size={16} style={{marginRight: 4}}/> Togo · La Réunion · Chine
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "1.5rem",
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "-1px"
          }}>
            EASY CHINA<br/>
            <span style={{
              background: `linear-gradient(90deg, ${T.gold}, ${T.gold2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Votre Pont Vers la Chine</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <p style={{
            color: T.muted,
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            maxWidth: 600,
            margin: "0 auto 3rem",
            lineHeight: 1.75
          }}>
            Sécurisez vos investissements, vos études et vos déplacements en Chine. Notre agence internationale vous accompagne à chaque étape directement depuis le Togo.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <GoldenBtn variant="glow" onClick={() => goTo("catalogue")}>
            <Package size={18} style={{marginRight: 8}}/> Découvrir le Catalogue
          </GoldenBtn>
          <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite obtenir des informations sur vos services."))}>
            <MessageCircle size={18} style={{marginRight: 8}}/> WhatsApp Direct
          </GoldenBtn>
        </ScrollReveal>
      </div>
    </div>
  );
}

// 2. Page d'Accueil Principale
function PageAccueil({ goTo }) {
  const stats = [
    { n: 500, l: "Étudiants placés", s: "+" },
    { n: 8, l: "Années d'expérience", s: "+" },
    { n: 2, l: "Bureaux physiques", s: "" },
    { n: 100, l: "Accompagnement", s: "%" },
  ];

  const services = [
    { icon: <Ship size={26}/>, cat: "Import", title: "Import & Logistique", text: "Sourcing produits, inspection qualité en usine, transport maritime et dédouanement. Accompagnement personnalisé pour sécuriser vos achats." },
    { icon: <GraduationCap size={26}/>, cat: "Études", title: "Université & Études", text: "Inscription dans les meilleures universités chinoises, bourses d'études, accompagnement administratif complet. Plus de 500 étudiants accompagnés." },
    { icon: <Wrench size={26}/>, cat: "Formation", title: "Formation Professionnelle", text: "Formations techniques en Chine : pressing, blanchisserie industrielle, maintenance machines. Certifications reconnues et stages pratiques." },
    { icon: <FileCheck size={26}/>, cat: "Visa", title: "Assistance Visa", text: "Obtention de visas chinois (tourisme, affaires, études, travail). Préparation dossiers, traduction certifiée, accompagnement consulaire." },
  ];

  const historyItems = [
    { year: "2017", title: "Fondation d'Easy China", desc: "Création de l'agence à Lomé, Togo avec pour mission de simplifier la liaison commerciale et académique entre l'Afrique de l'Ouest et la Chine." },
    { year: "2019", title: "Ouverture du Bureau en Chine", desc: "Établissement de nos bureaux permanents à Guangzhou et Yiwu pour assurer une inspection qualité physique en usine et un accompagnement local des étudiants." },
    { year: "2021", title: "Expansion de l'Offre Universitaire", desc: "Signature de partenariats exclusifs avec plus de 30 grandes universités chinoises, garantissant l'accès à des bourses gouvernementales d'excellence." },
    { year: "2024", title: "Digitalisation & Transitaire", desc: "Lancement de notre service de suivi logistique automatisé et renforcement de notre flotte transitaire maritime pour des imports 100% sécurisés." }
  ];

  const officesList = [
    { flag: "🇹🇬", title: "Easy China Lomé", query: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Quartier Hédzranawoé, Lomé, Togo", "contact@easychina-services.com", "+228 90 XX XX XX"] },
    { flag: "🇨🇳", title: "Guangzhou Permanent", query: "https://images.unsplash.com/photo-1540759786422-c60d5ed57d7b?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Guangzhou CBD & Yiwu City", "Sourcing direct, inspection logistique", "Présence physique permanente"] }
  ];

  return (
    <div>
      <HeroSection goTo={goTo} />

      {/* Stats Band */}
      <div style={{
        background: "rgba(255, 255, 255, 0.01)",
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        padding: "3rem 2rem",
        position: "relative",
        zIndex: 2,
      }}>
        <div className="grid-4" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {stats.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.5rem"
              }}>
                <AnimatedCounter value={s.n} suffix={s.s} duration={2.2} />
              </div>
              <div style={{
                fontSize: "0.75rem",
                color: T.muted,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                fontWeight: 600
              }}>
                {s.l}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow="Ce que nous faisons" title="Nos Services d'Élite" subtitle="Une expertise locale et internationale sur mesure pour concrétiser tous vos projets avec la Chine." />
        <div className="grid-3">
          {services.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <GlassCard tilt={true} style={{ height: "100%", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                <div style={{ height: 180, position: "relative" }}>
                  <Img src={UNSPLASH_REAL[s.cat] || UNSPLASH[s.cat]} alt={s.title} style={{ borderRadius: "0px", height: "100%" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent, rgba(5,8,16,0.9))",
                  }} />
                  <div style={{
                    position: "absolute", bottom: -20, left: "2rem",
                    width: 50, height: 50, borderRadius: 12,
                    background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(201,168,76,0.3)",
                    color: T.bgDeep,
                    zIndex: 3
                  }}>{s.icon}</div>
                </div>
                <div style={{ padding: "2.5rem 2rem 2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", color: T.text, fontWeight: 700, marginBottom: "0.8rem", marginTop: "0.5rem", textAlign: "left" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.88rem", color: T.muted, lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "left" }}>{s.text}</p>
                  </div>
                  <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite obtenir des informations sur le service : "${s.title}".`))} style={{ width: "100%" }}>
                    En savoir plus
                  </GoldenBtn>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Tourisme & Business Section */}
      <div style={{ background: "rgba(255, 255, 255, 0.01)", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <div className="grid-50-50" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", color: T.gold, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.8rem" }}>Voyages & Affaires</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "1.5rem", fontFamily: "'Syne', sans-serif" }}>
                Tourisme & Business en Immersion
              </h2>
              <p style={{ color: T.muted, lineHeight: 1.7, marginBottom: "1.2rem", fontSize: "0.95rem" }}>
                Nous organisons vos voyages d'affaires de A à Z : visites d'usines exclusives à Guangzhou et Yiwu, négociations de prix accompagnées par des interprètes qualifiés, et accès aux plus grands marchés de gros du monde.
              </p>
              <p style={{ color: T.muted, lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.95rem" }}>
                Bénéficiez également de nos circuits touristiques personnalisés pour découvrir la richesse culturelle de la Chine moderne, tout en restant connecté à vos opportunités d'affaires locales.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
                {["Visites d'usines", "Marché de Yiwu", "Interprètes bilingues", "Circuits guidés", "Guangzhou", "Négociations"].map(t => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <GlassCard tilt={true} style={{ padding: "2.5rem", textAlign: "center", background: "rgba(201, 168, 76, 0.02)" }}>
              <div style={{ height: 250, marginBottom: "2rem", borderRadius: T.radius, overflow: "hidden" }}>
                <Img src="https://images.unsplash.com/photo-1543097692-fa13c6cd8595?auto=format&fit=crop&w=800&h=600&q=80" alt="guangzhou market" style={{ height: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {["🇨🇳 Guangzhou", "🇨🇳 Yiwu", "🇹🇬 Lomé"].map(c => (
                  <CityPill key={c}>{c}</CityPill>
                ))}
              </div>
              <p style={{ color: T.muted, fontSize: "0.8rem", marginTop: "1.5rem", fontStyle: "italic" }}>
                Bureaux physiques permanents en Afrique et en Chine pour une assistance 24/7.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow="Notre parcours" title="Notre Histoire" subtitle="Depuis notre création, nous franchissons chaque étape avec pour unique objectif l'excellence de vos projets." />
        <Timeline items={historyItems} />
      </div>

      {/* Testimonials Section */}
      <div style={{ background: "rgba(255, 255, 255, 0.01)", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow="Ce qu'ils disent de nous" title="Témoignages de Confiance" subtitle="Découvrez les retours d'expérience de nos clients partenaires, importateurs et étudiants." />
        <TestimonialCarousel />
      </div>

      {/* Bureaux Section */}
      <div style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow="Où nous trouver" title="Nos Bureaux Internationaux" />
        <div className="grid-3" style={{justifyContent: "center"}}>
          {officesList.map((b, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <GlassCard tilt={true} style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                <div style={{ height: 140 }}>
                  <Img src={b.query} alt={b.title} style={{ borderRadius: "0px", height: "100%" }} />
                </div>
                <div style={{ padding: "2rem", textAlign: "left" }}>
                  <h3 style={{ color: T.gold, marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{b.flag}</span> {b.title}
                  </h3>
                  {b.lines.map((l, j) => (
                    <p key={j} style={{ fontSize: "0.85rem", color: T.muted, lineHeight: 1.6, marginBottom: 4 }}>{l}</p>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div style={{ padding: "8rem 2rem", textAlign: "center", position: "relative", overflow: "hidden", zIndex: 2 }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 400, height: 400, borderRadius: "50%",
          background: T.gold, opacity: 0.08, filter: "blur(80px)",
          transform: "translate(-50%, -50%)", pointerEvents: "none"
        }} />
        
        <div style={{ position: "relative", zIndex: 3, maxWidth: 650, margin: "0 auto" }}>
          <ScrollReveal direction="up" delay={0.1}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "'Syne', sans-serif" }}>
              Prêt à Conquérir le Marché Chinois ?
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p style={{ color: T.muted, fontSize: "1rem", lineHeight: 1.7, marginBottom: "3rem" }}>
              Qu'il s'agisse d'importer des marchandises, d'obtenir une bourse d'études ou de sécuriser un visa, nos experts sont à votre entière disposition.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <GoldenBtn variant="glow" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour, je souhaite démarrer un projet d'importation/études avec Easy China."))}>
              <TrendingUp size={18} style={{marginRight: 8}}/> Discuter avec un Expert
            </GoldenBtn>
          </ScrollReveal>
        </div>
      </div>

      {/* Formulaire de Contact */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderTop: `1px solid ${T.border}`, padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <SectionTitle eyebrow="Formulaire direct" title="Parlons de Votre Projet" subtitle="Envoyez-nous un descriptif de votre besoin pour une étude de faisabilité gratuite sous 24h." />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

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

// Formulaire de contact
function ContactForm() {
  const [f, setF] = useState({ nom: "", email: "", service: "Import & Logistique", msg: "" });
  const [honey, setHoney] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const send = () => {
    if (isSending) return;
    if (honey) {
      // Silent spam block
      return;
    }
    if (!f.nom || !f.email || !f.msg) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSending(true);

    const txt = `Bonjour Easy China,\n\nNom: ${sanitize(f.nom)}\nEmail: ${sanitize(f.email)}\nService concerné: ${f.service}\n\nMessage:\n${sanitize(f.msg)}`;
    window.open(waLink(WA_COMMERCIAL, txt));

    setTimeout(() => {
      setIsSending(false);
    }, 2000);
  };

  return (
    <GlassCard style={{ padding: "2.5rem", width: "100%", border: `1.5px solid rgba(201, 168, 76, 0.25)` }}>
      <input
        type="text"
        value={honey}
        onChange={e => setHoney(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />
      <Field label="Nom Complet *" value={f.nom} onChange={v => setF(p => ({ ...p, nom: v }))} placeholder="Votre nom et prénom" />
      <Field label="Adresse Email *" type="email" value={f.email} onChange={v => setF(p => ({ ...p, email: v }))} placeholder="vous@entreprise.com" />
      <Field label="Service Demandé" value={f.service} onChange={v => setF(p => ({ ...p, service: v }))}
        options={["Import & Logistique", "Université & Études", "Formation Professionnelle", "Assistance Visa", "Tourisme & Business"]} />
      <Field label="Message & Spécifications *" value={f.msg} onChange={v => setF(p => ({ ...p, msg: v }))} placeholder="Décrivez en détail votre besoin (quantités, budgets, délais)..." rows={4} />
      <GoldenBtn variant="solid" onClick={send} disabled={isSending} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
        {isSending ? <Clock size={18} style={{marginRight: 8}}/> : <MessageCircle size={18} style={{marginRight: 8}}/>}
        {isSending ? "Envoi en cours..." : "Envoyer le projet sur WhatsApp"}
      </GoldenBtn>
    </GlassCard>
  );
}

// ─── PAGE CATALOGUE ──────────────────────────────────────────────────────────
function PageCatalogue({ articles }) {
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
    <div style={{ padding: "8rem 2rem 6rem", maxWidth: 1200, margin: "0 auto" }}>
      <SectionTitle
        eyebrow="Notre Sourcing Direct"
        title="Catalogue d'Importation"
        subtitle="Découvrez notre sélection de produits industriels et matériels de haute qualité, sourcés directement auprès des meilleures usines certifiées en Chine."
      />

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
                  background: isActive ? `linear-gradient(135deg, ${T.gold}, ${T.gold2})` : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isActive ? T.gold2 : "rgba(201, 168, 76, 0.15)"}`,
                  color: isActive ? T.bgDeep : T.text,
                  padding: "0.6rem 1.5rem",
                  borderRadius: 30,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isActive ? "0 4px 15px rgba(201, 168, 76, 0.3)" : "none",
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
          <ScrollReveal key={a.id} direction="up" delay={i * 0.05}>
            <GlassCard style={{ height: "100%", padding: 0, overflow: "hidden" }}>
              <div className="zoom-container" style={{ height: 200, position: "relative" }}>
                <Img
                  src={a.image || UNSPLASH[a.cat] || UNSPLASH["Autre"]}
                  className="zoom-img"
                  style={{ height: "100%", transition: "transform 0.5s ease", borderRadius: "0px" }}
                />
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
                  color: T.bgDeep,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "0.3rem 0.8rem",
                  borderRadius: 20,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}>
                  {a.cat}
                </div>
                <div style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "rgba(5, 8, 16, 0.75)",
                  backdropFilter: "blur(4px)",
                  border: `1.5px solid ${T.gold}`,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.gold
                }}>
                  <Package size={18}/>
                </div>
              </div>

              <div style={{ padding: "1.8rem", display: "flex", flexDirection: "column", height: "calc(100% - 200px)", justifyContent: "space-between" }}>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: T.text, marginBottom: "0.5rem" }}>
                    {a.titre}
                  </h3>
                  <div style={{ color: T.gold, fontWeight: 800, fontSize: "1rem", marginBottom: "0.8rem" }}>
                    {a.prix}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: T.muted, lineHeight: 1.5, marginBottom: "1.8rem" }}>
                    {a.desc}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <GoldenBtn
                    variant="solid"
                    onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite passer commande pour le produit "${a.titre}" au prix de "${a.prix}".`))}
                    style={{ width: "100%" }}
                  >
                    <Package size={18} style={{marginRight: 8}}/> Commander (Togo)
                  </GoldenBtn>
                  <GoldenBtn
                    variant="outline"
                    onClick={() => window.open(waLink(WA_TRANSITAIRE, `Bonjour Easy China, je souhaite obtenir des informations douanières et logistiques pour l'importation de : "${a.titre}".`))}
                    style={{ width: "100%" }}
                  >
                    <Ship size={18} style={{marginRight: 8}}/> Service Transitaire
                  </GoldenBtn>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE RÉALISATIONS ────────────────────────────────────────────────────────
function PageRealisations({ realisations }) {
  return (
    <div style={{ padding: "8rem 2rem 6rem", maxWidth: 1200, margin: "0 auto" }}>
      <SectionTitle
        eyebrow="Nos succès commerciaux"
        title="Réalisations & Témoignages"
        subtitle="Découvrez comment nous accompagnons nos clients partenaires au Togo et en Afrique dans la concrétisation de leurs projets académiques, logistiques et industriels."
      />

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
              <GlassCard style={{ height: "100%", padding: 0, overflow: "hidden" }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}>
                  {/* Visual Image Banner for larger items */}
                  {isLarge && (
                    <div style={{ height: 160, position: "relative" }}>
                      <Img
                        src={r.image || UNSPLASH_REAL[r.cat] || UNSPLASH_REAL["Tourisme"]}
                        style={{ borderRadius: "0px", height: "100%" }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, transparent, rgba(13, 17, 23, 0.95))"
                      }} />
                    </div>
                  )}

                  <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContext: "space-between", marginBottom: "0.8rem", justifyContent: "space-between" }}>
                        <span style={{
                          background: "rgba(201, 168, 76, 0.08)",
                          border: `1px solid rgba(201, 168, 76, 0.25)`,
                          color: T.gold,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.75rem",
                          borderRadius: 20,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          {r.cat}
                        </span>
                        <span style={{ color: T.gold }}>
                          {r.cat === "Import" ? <Ship size={20}/> :
                           r.cat === "Études" ? <GraduationCap size={20}/> :
                           r.cat === "Formation" ? <Wrench size={20}/> :
                           <FileCheck size={20}/>}
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: isLarge ? "1.3rem" : "1.05rem",
                        fontWeight: 800,
                        color: T.text,
                        lineHeight: 1.25,
                        marginBottom: "0.6rem",
                        fontFamily: "'Syne', sans-serif",
                        textAlign: "left"
                      }}>
                        {r.titre}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: T.muted, lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "left" }}>
                        {r.desc}
                      </p>
                    </div>

                    {/* Testimonial Quote inside Bento Box */}
                    {r.temoignage && (
                      <div style={{
                        borderTop: `1px solid rgba(201, 168, 76, 0.1)`,
                        paddingTop: "1.2rem",
                        marginTop: "1rem"
                      }}>
                        <div style={{ color: T.gold, fontSize: "1.8rem", height: 16, lineHeight: 0.1, fontFamily: "serif", opacity: 0.3, marginBottom: "0.4rem", textAlign: "left" }}>“</div>
                        <p style={{ fontStyle: "italic", fontSize: "0.82rem", color: T.text, lineHeight: 1.5, marginBottom: "0.8rem", textAlign: "left" }}>
                          {r.temoignage}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: T.gold }}>{r.client}</span>
                          <span style={{ color: T.gold, display: "flex", gap: 1 }}>
                            {Array.from({ length: Number(r.stars || 5) }).map((_, stIdx) => (
                              <Star key={stIdx} size={11} fill={T.gold} color={T.gold} />
                            ))}
                          </span>
                        </div>
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
          background: "linear-gradient(135deg, rgba(201, 168, 76, 0.03), rgba(233, 30, 140, 0.02))",
          border: `1.5px solid ${T.border}`,
          padding: "3.5rem",
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: "1rem", fontFamily: "'Syne', sans-serif" }}>
            Vous aussi, concrétisez vos projets avec la Chine !
          </h3>
          <p style={{ color: T.muted, fontSize: "0.95rem", maxWidth: 650, margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
            Bénéficiez de la sécurité et de la puissance de notre réseau transitaire et académique pour réaliser vos ambitions d'importation ou d'études.
          </p>
          <GoldenBtn variant="glow" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite démarrer un projet logistique/études avec vous."))}>
            🚀 Lancer mon Projet
          </GoldenBtn>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}

// ─── COMPOSANT IMAGEUPLOAD EN BASE64 ──────────────────────────────────────────
const ImageUpload = ({ value, onChange }) => {
  const ref = useRef();
  const [preview, setPreview] = useState(value||"");
  const [drag, setDrag] = useState(false);

  const handleFile = file => {
    if(!file || !file.type.startsWith("image/")) return;
    if(file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      setPreview(e.target.result);
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{marginBottom:"1.1rem", textAlign: "left"}}>
      <label style={{fontSize:".78rem",color:T.gold,fontWeight:600,
        display:"block",marginBottom:6}}>
        Photo
      </label>
      <div
        onClick={()=>ref.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
        style={{
          border:`2px dashed ${drag?"#c9a84c":"rgba(201, 168, 76, 0.2)"}`,
          borderRadius:12, padding:"1rem", textAlign:"center",
          cursor:"pointer", background: drag?"rgba(201,168,76,0.05)":"rgba(255,255,255,0.02)",
          transition:"all .2s", position:"relative", minHeight:120,
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", gap:8
        }}
      >
        {preview
          ? <>
              <img src={preview} alt="preview"
                style={{maxHeight:180,maxWidth:"100%",borderRadius:8,objectFit:"cover"}}/>
              <button type="button"
                onClick={e=>{e.stopPropagation();setPreview("");onChange("")}}
                style={{position:"absolute",top:8,right:8,background:"#e53935",
                  border:"none",borderRadius:6,color:"#fff",
                  padding:"2px 8px",cursor:"pointer",fontSize:".75rem", display: "flex", alignItems: "center", gap: 4}}>
                <X size={12}/> Supprimer
              </button>
            </>
          : <>
              <Upload size={28} style={{color: T.gold, opacity: 0.6}}/>
              <p style={{fontSize:".8rem",color:"#aaa",margin:0}}>
                Glisse une photo ici ou <span style={{color:"#c9a84c",
                fontWeight:600}}>clique pour choisir</span>
              </p>
              <p style={{fontSize:".7rem",color:"#ccc",margin:0}}>PNG, JPG, WEBP · Max 5MB</p>
            </>
        }
        <input ref={ref} type="file" accept="image/*"
          style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
      </div>
      <input
        type="text" value={preview.startsWith("data:") ? "" : preview}
        onChange={e=>{setPreview(e.target.value);onChange(e.target.value)}}
        placeholder="Ou colle une URL d'image..."
        style={{width:"100%",marginTop:8,padding:".6rem .9rem",border:"1.5px solid rgba(201,168,76,0.2)",
          borderRadius:8,fontSize:".8rem",fontFamily:"inherit",outline:"none", background: T.bgDeep, color: T.text}}
      />
    </div>
  );
};

// ─── PAGE ADMIN ──────────────────────────────────────────────────────────────
function PageAdmin({ articles, setArticles, realisations, setRealisations }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [lockoutTime, setLockoutTime] = useState(() => {
    try {
      const stored = localStorage.getItem("ec_lockout");
      if (stored) {
        const parsed = Number(stored);
        if (parsed > Date.now()) return parsed;
      }
    } catch {}
    return 0;
  });
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("ec_session");
      if (stored) {
        const { token, expires } = JSON.parse(stored);
        if (token && expires && expires > Date.now()) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("ec_session");
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (lockoutTime <= Date.now()) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
        setFailedAttempts(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  // Product Form State
  const [artNom, setArtNom] = useState("");
  const [artPrix, setArtPrix] = useState("");
  const [artDesc, setArtDesc] = useState("");
  const [artCat, setArtCat] = useState("Machines");
  const [artImage, setArtImage] = useState("");
  const [editingArtId, setEditingArtId] = useState(null);

  // Realisation Form State
  const [realNom, setRealNom] = useState("");
  const [realDesc, setRealDesc] = useState("");
  const [realCat, setRealCat] = useState("Import");
  const [realClient, setRealClient] = useState("");
  const [realTemoignage, setRealTemoignage] = useState("");
  const [realStars, setRealStars] = useState("5");
  const [realImage, setRealImage] = useState("");
  const [editingRealId, setEditingRealId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutTime > Date.now()) {
      return;
    }

    const hashed = await sha256(password);
    if (hashed === ADMIN_HASH) {
      setIsAuthenticated(true);
      setErrorMsg("");
      setFailedAttempts(0);
      try {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("ec_session", JSON.stringify({
          token,
          expires: Date.now() + 4 * 3600000 // 4 hours
        }));
      } catch (err) {}
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        const until = Date.now() + 60000;
        setLockoutTime(until);
        localStorage.setItem("ec_lockout", until.toString());
        setErrorMsg("Trop de tentatives échouées. Compte bloqué pour 60 secondes.");
      } else {
        setErrorMsg(`Mot de passe incorrect (${3 - newAttempts} tentatives restantes).`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ec_session");
  };

  // CRUD Product Actions
  const handleSaveArticle = () => {
    if (!artNom || !artPrix || !artDesc) {
      alert("Veuillez remplir tous les champs obligatoires du produit.");
      return;
    }

    if (artImage && !artImage.startsWith("https://") && !artImage.startsWith("data:")) {
      alert("L'URL de l'image doit commencer par https:// ou être une photo importée.");
      return;
    }

    const cleanNom = sanitize(artNom).slice(0, 120);
    const cleanPrix = sanitize(artPrix).slice(0, 50);
    const cleanDesc = sanitize(artDesc).slice(0, 600);

    if (editingArtId) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArtId
            ? { ...a, titre: cleanNom, prix: cleanPrix, desc: cleanDesc, cat: artCat, image: artImage }
            : a
        )
      );
      setEditingArtId(null);
    } else {
      const newArt = {
        id: Date.now().toString(),
        titre: cleanNom,
        prix: cleanPrix,
        desc: cleanDesc,
        cat: artCat,
        image: artImage
      };
      setArticles((prev) => [...prev, newArt]);
    }

    setArtNom("");
    setArtPrix("");
    setArtDesc("");
    setArtImage("");
  };

  const handleEditArticle = (art) => {
    setArtNom(art.titre);
    setArtPrix(art.prix);
    setArtDesc(art.desc);
    setArtCat(art.cat);
    setArtImage(art.image || "");
    setEditingArtId(art.id);
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit du catalogue ?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      if (editingArtId === id) {
        setEditingArtId(null);
        setArtNom("");
        setArtPrix("");
        setArtDesc("");
        setArtImage("");
      }
    }
  };

  // CRUD Realisations Actions
  const handleSaveRealisation = () => {
    if (!realNom || !realDesc) {
      alert("Veuillez remplir les champs obligatoires de la réalisation.");
      return;
    }

    if (realImage && !realImage.startsWith("https://") && !realImage.startsWith("data:")) {
      alert("L'URL de l'image doit commencer par https:// ou être une photo importée.");
      return;
    }

    const cleanNom = sanitize(realNom).slice(0, 120);
    const cleanDesc = sanitize(realDesc).slice(0, 600);
    const cleanClient = sanitize(realClient).slice(0, 120);
    const cleanTemoignage = sanitize(realTemoignage).slice(0, 600);

    if (editingRealId) {
      setRealisations((prev) =>
        prev.map((r) =>
          r.id === editingRealId
            ? {
                ...r,
                titre: cleanNom,
                desc: cleanDesc,
                cat: realCat,
                client: cleanClient,
                temoignage: cleanTemoignage,
                stars: realStars,
                image: realImage
              }
            : r
        )
      );
      setEditingRealId(null);
    } else {
      const newReal = {
        id: Date.now().toString(),
        titre: cleanNom,
        desc: cleanDesc,
        cat: realCat,
        client: cleanClient,
        temoignage: cleanTemoignage,
        stars: realStars,
        image: realImage
      };
      setRealisations((prev) => [...prev, newReal]);
    }

    setRealNom("");
    setRealDesc("");
    setRealClient("");
    setRealTemoignage("");
    setRealImage("");
  };

  const handleEditRealisation = (r) => {
    setRealNom(r.titre);
    setRealDesc(r.desc);
    setRealCat(r.cat);
    setRealClient(r.client || "");
    setRealTemoignage(r.temoignage || "");
    setRealStars(r.stars || "5");
    setRealImage(r.image || "");
    setEditingRealId(r.id);
  };

  const handleDeleteRealisation = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette réalisation ?")) {
      setRealisations((prev) => prev.filter((r) => r.id !== id));
      if (editingRealId === id) {
        setEditingRealId(null);
        setRealNom("");
        setRealDesc("");
        setRealClient("");
        setRealTemoignage("");
        setRealImage("");
      }
    }
  };

  if (!isAuthenticated) {
    const isLocked = lockoutTime > Date.now();
    return (
      <div style={{ padding: "10rem 2rem 8rem", display: "flex", justifyContent: "center" }}>
        <GlassCard style={{ maxWidth: 450, width: "100%", padding: "3rem 2.5rem", border: `1.5px solid ${T.gold}` }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "rgba(201,168,76,0.1)",
              border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem", color: T.gold
            }}>
              <Lock size={26}/>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "1rem", fontFamily: "'Syne', sans-serif" }}>
              Accès Administration
            </h2>
            <p style={{ color: T.muted, fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Veuillez saisir le code d'accès pour modifier le catalogue d'importation et les réalisations.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <Field
              label="Mot de Passe"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Code administrateur"
            />
            {errorMsg && (
              <p style={{ color: T.pink, fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem", textAlign: "left" }}>
                ⚠️ {errorMsg}
              </p>
            )}
            {isLocked && (
              <p style={{ color: T.pink, fontSize: "0.8rem", fontWeight: 700, marginBottom: "1rem", textAlign: "left" }}>
                🔒 Compte verrouillé temporairement. Réessayez dans {timeLeft}s.
              </p>
            )}
            <GoldenBtn 
              variant="solid" 
              disabled={isLocked} 
              style={{ width: "100%", justifyContent: "center" }}
            >
              Déverrouiller l'Espace
            </GoldenBtn>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div style={{ padding: "8rem 2rem 6rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
        <div style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.gold }}>
            Espace Professionnel Administration
          </h2>
          <p style={{ color: T.muted, fontSize: "0.9rem" }}>
            Gérez vos produits du catalogue en temps réel ainsi que les réalisations et témoignages clients de l'agence.
          </p>
        </div>
        <GoldenBtn variant="outline" onClick={handleLogout}>
          <LogOut size={16} style={{marginRight: 8}}/> Déconnexion
        </GoldenBtn>
      </div>

      <div className="grid-50-50" style={{ alignItems: "flex-start", gap: "2.5rem" }}>
        {/* CATALOGUE CRUD PANEL */}
        <GlassCard style={{ padding: "2.2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#fff", marginBottom: "1.5rem", textAlign: "left" }}>
            {editingArtId ? "✏️ Modifier le Produit" : "➕ Ajouter au Catalogue"}
          </h3>
          <Field label="Titre du Produit *" value={artNom} onChange={setArtNom} placeholder="Ex: Machine de Presse à Vapeur" />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Prix (ou indicatif) *" value={artPrix} onChange={setArtPrix} placeholder="Ex: À partir de 1,200 USD" />
            <Field
              label="Catégorie"
              value={artCat}
              onChange={setArtCat}
              options={["Machines", "Électronique", "Textile", "Import général", "Alimentaire", "Autre"]}
            />
          </div>

          <ImageUpload value={artImage} onChange={setArtImage} />

          <Field label="Description & Spécifications *" value={artDesc} onChange={setArtDesc} placeholder="Détails du produit, capacité..." rows={3} />
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <GoldenBtn variant="solid" onClick={handleSaveArticle} style={{ flex: 1 }}>
              {editingArtId ? "Enregistrer" : "Ajouter le Produit"}
            </GoldenBtn>
            {editingArtId && (
              <GoldenBtn
                variant="ghost"
                onClick={() => {
                  setEditingArtId(null);
                  setArtNom("");
                  setArtPrix("");
                  setArtDesc("");
                  setArtImage("");
                }}
              >
                Annuler
              </GoldenBtn>
            )}
          </div>
        </GlassCard>

        {/* CATALOGUE LIST VIEW */}
        <GlassCard style={{ padding: "2.2rem", maxHeight: "650px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#fff", marginBottom: "1.5rem", textAlign: "left" }}>
            Produits du Catalogue ({articles.length})
          </h3>
          {articles.length === 0 ? (
            <p style={{ color: T.muted, fontSize: "0.85rem" }}>Aucun produit dans le catalogue.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {articles.map((art) => (
                <div key={art.id} style={{
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: T.gold }}><Package size={18}/></span>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>{art.titre}</h4>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: T.gold, fontWeight: 600 }}>{art.prix} · {art.cat}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      aria-label="Modifier"
                      onClick={() => handleEditArticle(art)}
                      style={{ background: "rgba(201, 168, 76, 0.15)", color: T.gold, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Edit2 size={14}/>
                    </button>
                    <button
                      aria-label="Supprimer"
                      onClick={() => handleDeleteArticle(art.id)}
                      style={{ background: "rgba(233, 30, 140, 0.15)", color: T.pink, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <div style={{ height: "4rem" }} />

      <div className="grid-50-50" style={{ alignItems: "flex-start", gap: "2.5rem" }}>
        {/* REALISATIONS CRUD PANEL */}
        <GlassCard style={{ padding: "2.2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#fff", marginBottom: "1.5rem", textAlign: "left" }}>
            {editingRealId ? "✏️ Modifier la Réalisation" : "➕ Ajouter une Réalisation"}
          </h3>
          <Field label="Titre de la Réalisation *" value={realNom} onChange={setRealNom} placeholder="Ex: Livraison d'un Conteneur de 40 pieds" />
          
          <Field label="Nom Client / Fonction" value={realClient} onChange={setRealClient} placeholder="Ex: Mme Ablavi T., Importatrice" />
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field
              label="Catégorie"
              value={realCat}
              onChange={setRealCat}
              options={["Import", "Études", "Formation", "Visa", "Tourisme"]}
            />
            <Field
              label="Note Étoiles"
              value={realStars}
              onChange={setRealStars}
              options={["5", "4", "3", "2", "1"]}
            />
          </div>

          <ImageUpload value={realImage} onChange={setRealImage} />

          <Field label="Descriptif / Récit de Réussite *" value={realDesc} onChange={setRealDesc} placeholder="Comment cela a été réalisé (logistique, délais, réussite)..." rows={2} />
          <Field label="Témoignage Client" value={realTemoignage} onChange={setRealTemoignage} placeholder="Citation directe du client..." rows={2} />

          <div style={{ display: "flex", gap: "1rem" }}>
            <GoldenBtn variant="solid" onClick={handleSaveRealisation} style={{ flex: 1 }}>
              {editingRealId ? "Enregistrer" : "Ajouter la Réalisation"}
            </GoldenBtn>
            {editingRealId && (
              <GoldenBtn
                variant="ghost"
                onClick={() => {
                  setEditingRealId(null);
                  setRealNom("");
                  setRealDesc("");
                  setRealClient("");
                  setRealTemoignage("");
                  setRealImage("");
                }}
              >
                Annuler
              </GoldenBtn>
            )}
          </div>
        </GlassCard>

        {/* REALISATIONS LIST VIEW */}
        <GlassCard style={{ padding: "2.2rem", maxHeight: "650px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#fff", marginBottom: "1.5rem", textAlign: "left" }}>
            Réalisations Clients ({realisations.length})
          </h3>
          {realisations.length === 0 ? (
            <p style={{ color: T.muted, fontSize: "0.85rem" }}>Aucune réalisation enregistrée.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {realisations.map((real) => (
                <div key={real.id} style={{
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: T.gold }}>
                        {real.cat === "Import" ? <Ship size={18}/> :
                         real.cat === "Études" ? <GraduationCap size={18}/> :
                         real.cat === "Formation" ? <Wrench size={18}/> :
                         <FileCheck size={18}/>}
                      </span>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>{real.titre}</h4>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: T.gold, fontWeight: 600 }}>{real.cat} · {real.client || "Client Anonyme"} ({real.stars} ★)</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      aria-label="Modifier"
                      onClick={() => handleEditRealisation(real)}
                      style={{ background: "rgba(201, 168, 76, 0.15)", color: T.gold, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Edit2 size={14}/>
                    </button>
                    <button
                      aria-label="Supprimer"
                      onClick={() => handleDeleteRealisation(real.id)}
                      style={{ background: "rgba(233, 30, 140, 0.15)", color: T.pink, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

// ─── GLOBAL APP ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("accueil");
  
  const [articles, setArticlesState] = useState(() => {
    try {
      const stored = localStorage.getItem("ec_articles");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
      return DEFAULT_ARTICLES;
    } catch {
      return DEFAULT_ARTICLES;
    }
  });

  const [realisations, setRealisationsState] = useState(() => {
    try {
      const stored = localStorage.getItem("ec_reals");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
      return DEFAULT_REALISATIONS;
    } catch {
      return DEFAULT_REALISATIONS;
    }
  });

  const setArticles = useCallback((v) => {
    setArticlesState((prev) => {
      const val = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem("ec_articles", JSON.stringify(val)); } catch {}
      return val;
    });
  }, []);

  const setRealisations = useCallback((v) => {
    setRealisationsState((prev) => {
      const val = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem("ec_reals", JSON.stringify(val)); } catch {}
      return val;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = "fr";
  }, []);

  const pagesList = [
    ["accueil", "Accueil"],
    ["catalogue", "Catalogue"],
    ["realisations", "Réalisations"],
    ["admin", "⚙ Admin"]
  ];

  const goTo = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
      background: T.bgDeep,
      color: T.text,
      position: "relative",
      overflowX: "hidden"
    }}>
      <SEOHead page={page} />

      {/* Dynamic Ambient Background Glows */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%",
        width: "50vw", height: "50vw", borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)`,
        zIndex: 0, pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "-10%",
        width: "60vw", height: "60vw", borderRadius: "50%",
        background: `radial-gradient(circle, rgba(233,30,140,0.04) 0%, transparent 70%)`,
        zIndex: 0, pointerEvents: "none"
      }} />

      {/* Global CSS Stylesheet Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          background-color: ${T.bgDeep};
          color: ${T.text};
          font-family: 'Inter', system-ui, sans-serif;
          overflow-x: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${T.bgDeep};
        }
        ::-webkit-scrollbar-thumb {
          background: ${T.gold};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${T.gold2};
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes pulseGlow {
          0% { transform: scale(0.95); opacity: 0.45; }
          50% { transform: scale(1.05); opacity: 0.75; }
          100% { transform: scale(0.95); opacity: 0.45; }
        }

        @keyframes rippleAnim {
          to {
            transform: translate(-50%, -50%) scale(5);
            opacity: 0;
          }
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.8rem;
        }

        .grid-50-50 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4.5rem;
          align-items: center;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          grid-auto-flow: dense;
        }

        .zoom-container {
          overflow: hidden;
          position: relative;
        }
        
        .zoom-container:hover .zoom-img {
          transform: scale(1.08) !important;
        }

        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .bento-card-large {
            grid-column: span 2 !important;
          }
          .grid-50-50 {
            gap: 2.5rem !important;
          }
        }

        @media (max-width: 640px) {
          .grid-50-50 {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
          .nav-desktop-menu {
            display: none !important;
          }
          .nav-mobile-trigger {
            display: flex !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
            gap: 0px !important;
          }
          .timeline-line {
            left: 15px !important;
          }
          .timeline-item {
            justify-content: flex-start !important;
            padding-left: 35px !important;
            width: 100% !important;
          }
          .timeline-dot {
            left: 15px !important;
          }
          .timeline-card-wrapper {
            width: 100% !important;
          }
        }
      ` }} />

      {/* Floating Header Navigation */}
      <FloatingNav pages={pagesList} activePage={page} setPage={goTo} />

      {/* Page Content with Slide-in Mount Animation */}
      <main style={{ position: "relative", zIndex: 1 }}>
        <PageTransition pageKey={page}>
          {page === "accueil" && <PageAccueil goTo={goTo} />}
          {page === "catalogue" && <PageCatalogue articles={articles} />}
          {page === "realisations" && <PageRealisations realisations={realisations} />}
          {page === "admin" && <PageAdmin articles={articles} setArticles={setArticles} realisations={realisations} setRealisations={setRealisations} />}
        </PageTransition>
      </main>

      {/* Footer Luxe */}
      <footer style={{
        background: "#080c14",
        color: T.muted,
        textAlign: "center",
        padding: "3.5rem 2rem",
        fontSize: "0.85rem",
        borderTop: `1px solid ${T.border}`,
        position: "relative",
        zIndex: 2
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Logo onClick={() => goTo("accueil")} />
          </div>
          <p style={{ fontSize: "0.82rem", letterSpacing: "0.5px" }}>
            Togo · La Réunion · Chine — © 2025 <span style={{ color: T.gold, fontWeight: 700 }}>Easy China Services</span> — Agence de Liaison Commerciale & Académique Internationale.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted} onClick={() => goTo("accueil")}>Accueil</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted} onClick={() => goTo("catalogue")}>Catalogue d'Import</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted} onClick={() => goTo("realisations")}>Réalisations clients</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = T.gold} onMouseLeave={e => e.currentTarget.style.color = T.muted} onClick={() => goTo("admin")}>Espace Professionnel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
