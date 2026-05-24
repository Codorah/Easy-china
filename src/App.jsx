import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { t, useLang, changeLang, LANGS } from "./i18n";
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
  bgDeep: "#ffffff",       // Fond blanc principal
  bgCard: "#ffffff",       // Fond des cartes
  bgSection: "#f8fafc",    // Sections alternées légères
  bgGlass: "rgba(201, 48, 44, 0.03)",
  gold: "#c9302c",         // Rouge Chine — accent principal
  gold2: "#e53935",        // Rouge vif — survol
  pink: "#1e3a8a",         // Marine — accent secondaire
  border: "#e2e8f0",       // Bordure légère
  text: "#0f172a",         // Texte sombre
  muted: "#64748b",        // Texte atténué ardoise
  radius: 14,
};

// ─── CONSTANTS & CONFIGURATION ───────────────────────────────────────────────
const WA_COMMERCIAL = "+22890000001";
const WA_TRANSITAIRE = "+22890000002";
const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || "6e5349233f2be8ca69d702d25710ca05a515f608ce9f340512774f6c167ec3cb";

const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

const UNSPLASH = {
  "Import général": "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80",
  "Électronique":   "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&h=400&q=80",
  "Textile":        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=400&q=80",
  "Machines":       "https://images.unsplash.com/photo-1565715101539-8cca2c24bf0f?auto=format&fit=crop&w=600&h=400&q=80",
  "Alimentaire":    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=400&q=80",
  "Autre":          "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&h=400&q=80",
};

const UNSPLASH_REAL = {
  "Import":    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80",
  "Études":    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80",
  "Visa":      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&h=400&q=80",
  "Formation": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&h=400&q=80",
  "Tourisme":  "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=600&h=400&q=80",
};

// ─── SEED DEFAULT DATA ───────────────────────────────────────────────────────
const DEFAULT_ARTICLES = [
  { id: "1", titre: "Machines de Pressing Industriel", prix: "À partir de 1,200 USD", desc: "Sourcing et livraison de lignes de lavage, séchage et repassage haut de gamme.", cat: "Machines", image: "" },
  { id: "2", titre: "Lignes d'Éclairage LED Connectées", prix: "À partir de 450 USD", desc: "Matériel d'éclairage LED haute puissance et basse consommation pour chantiers professionnels.", cat: "Électronique", image: "" },
  { id: "3", titre: "Textile de Lin & Soie Premium", prix: "À partir de 3 USD / m", desc: "Importation directe de rouleaux de textiles nobles depuis les meilleurs tisseurs de Zhejiang.", cat: "Textile", image: "" },
  { id: "4", titre: "Automates de Conditionnement Alimentaire", prix: "À partir de 2,400 USD", desc: "Machines de scellage, emballage et étiquetage de précision pour le secteur agroalimentaire.", cat: "Machines", image: "" },
  { id: "5", titre: "Pompes Solaires Agricoles Haute Efficacité", prix: "À partir de 800 USD", desc: "Systèmes d'irrigation alimentés par énergie solaire, idéaux pour les exploitations agricoles.", cat: "Import général", image: "" }
];

const DEFAULT_EQUIPE = [
  {
    id: "1",
    nom: "Jean-Baptiste Koffi",
    poste: "Directeur Général & Fondateur",
    bio: "Passionné par les échanges sino-africains depuis plus de 10 ans, Jean-Baptiste a fondé Easy China en 2017 après plusieurs années passées à Guangzhou. Il supervise les opérations commerciales, les partenariats stratégiques et les négociations directes avec les usines chinoises.",
    contact: "+228 90 12 34 56",
    email: "direction@easychina-services.com",
    specialites: "Import & Logistique,Partenariats Chine,Négociations B2B",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=600&q=80"
  },
  {
    id: "2",
    nom: "Amivi Sénamé",
    poste: "Responsable Académique & Visas",
    bio: "Ancienne boursière à l'Université de Wuhan, Amivi dirige depuis 2019 le pôle universitaire d'Easy China. Elle accompagne personnellement chaque étudiant dans ses démarches d'inscription, d'obtention de bourses gouvernementales et de visa d'études.",
    contact: "+228 90 56 78 90",
    email: "etudes@easychina-services.com",
    specialites: "Admissions Universitaires,Bourses Gouvernementales,Visas Études",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&h=600&q=80"
  },
  {
    id: "3",
    nom: "Kwame Agbodjan",
    poste: "Responsable Logistique & Transit",
    bio: "Expert en transit international et dédouanement avec 8 ans d'expérience dans le fret maritime, Kwame gère l'ensemble de la chaîne logistique depuis les ports de Guangzhou et Yiwu jusqu'au port de Lomé. Il garantit la sécurité et la conformité de chaque cargaison.",
    contact: "+228 90 34 56 78",
    email: "logistique@easychina-services.com",
    specialites: "Fret Maritime,Dédouanement,Inspection Qualité",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&h=600&q=80"
  }
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
          background:"linear-gradient(90deg, #f1f5f9 25%, rgba(201,48,44,0.07) 50%, #f1f5f9 75%)",
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
        : <div style={{width:"100%",height:"100%",background:"#f8fafc",
            border:`1px solid ${T.border}`,
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
        color: "#fff",
        boxShadow: isHovered && !disabled ? `0 8px 30px rgba(201, 48, 44, 0.35)` : `0 4px 15px rgba(201, 48, 44, 0.18)`,
      };
    } else if (variant === "outline") {
      return {
        ...base,
        background: isHovered && !disabled ? "rgba(201, 48, 44, 0.06)" : "transparent",
        color: T.gold,
        border: `1.5px solid ${T.gold}`,
        boxShadow: isHovered && !disabled ? `0 0 20px rgba(201, 48, 44, 0.15)` : "none",
      };
    } else if (variant === "ghost") {
      return {
        ...base,
        background: isHovered && !disabled ? "rgba(15, 23, 42, 0.04)" : "transparent",
        color: T.text,
      };
    } else if (variant === "glow") {
      return {
        ...base,
        background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
        color: "#fff",
        boxShadow: `0 0 25px rgba(201, 48, 44, 0.3)`,
      };
    } else if (variant === "white") {
      return {
        ...base,
        background: isHovered && !disabled ? "#f8fafc" : "#ffffff",
        color: T.gold,
        boxShadow: isHovered && !disabled ? `0 8px 30px rgba(0,0,0,0.18)` : `0 4px 15px rgba(0,0,0,0.1)`,
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
          filter: "blur(14px)",
          opacity: isHovered ? 0.5 : 0.25,
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
      background: "#ffffff",
      backdropFilter: "none",
      border: `1px solid ${isHovered ? "rgba(201, 48, 44, 0.22)" : T.border}`,
      padding: "2rem",
      overflow: "hidden",
      boxShadow: isHovered ? "0 12px 40px rgba(0, 0, 0, 0.11)" : "0 2px 12px rgba(0, 0, 0, 0.06)",
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
function ParticleCanvas({ color = "#c9302c", count = 50 }) {
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
            ctx.strokeStyle = `rgba(201, 48, 44,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 48, 44,${p.alpha})`;
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
            fontSize: "0.72rem",
            color: T.gold,
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "0.8rem",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: T.gold, borderRadius: 2 }} />
            {eyebrow}
            <span style={{ display: "inline-block", width: 24, height: 2, background: T.gold, borderRadius: 2 }} />
          </div>
        )}
        <h2 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          color: T.text,
          display: "block",
          marginBottom: "0.8rem",
          lineHeight: 1.2,
          position: "relative",
          fontFamily: "'Syne', sans-serif"
        }}>
          {title}
          <span style={{
            display: "block",
            width: 48,
            height: 3,
            background: T.gold,
            borderRadius: 3,
            marginTop: 12,
            marginLeft: centered ? "auto" : 0,
            marginRight: centered ? "auto" : 0,
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
        width: 2,
        background: `linear-gradient(to bottom, transparent, rgba(201, 48, 44, 0.25) 15%, rgba(201, 48, 44, 0.25) 85%, transparent)`,
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
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: T.gold,
              border: `3px solid #fff`,
              transform: "translateX(-50%)",
              boxShadow: `0 0 0 3px rgba(201, 48, 44, 0.15)`,
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
          background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
          border: `1.5px solid rgba(201, 48, 44, 0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: "0.95rem"
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
              background: active === i ? T.gold : T.border,
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
        <path d="M24 16a7 7 0 1 0 0 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <polygon points="36,6 37.2,9.6 41,9.6 38,11.8 39.2,15.4 36,13.2 32.8,15.4 34,11.8 31,9.6 34.8,9.6" fill="#fff" opacity=".9"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="42" y2="42">
            <stop offset="0%" stopColor="#c9302c"/>
            <stop offset="100%" stopColor="#b71c1c"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{lineHeight:1.15, textAlign: "left"}}>
        <div style={{
          color: T.text, fontWeight:800, fontSize:"1.05rem",
          letterSpacing:"2.5px", fontFamily:"'Syne','Segoe UI',sans-serif"
        }}>
          EASY <span style={{color: T.gold}}>CHINA</span>
        </div>
        <div style={{
          color: T.muted, fontSize:".48rem",
          letterSpacing:"3.5px", marginTop:2, textTransform:"uppercase"
        }}>
          Togo · Réunion · Chine
        </div>
      </div>
    </div>
  );
};

// Language Switcher Dropdown
function LangSwitcher() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find(l => l.code === lang) || LANGS[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: open ? "rgba(201,48,44,0.07)" : "transparent",
          border: `1px solid ${open ? T.gold : T.border}`,
          borderRadius: 8, padding: "0.4rem 0.85rem",
          fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
          color: open ? T.gold : T.muted, transition: "all 0.25s",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ fontSize: "1rem" }}>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={13} style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "#fff", border: `1px solid ${T.border}`,
          borderRadius: T.radius, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          zIndex: 2000, minWidth: 150, overflow: "hidden",
          animation: "pageEnter 0.2s ease",
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { changeLang(l.code); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", display: "flex",
                alignItems: "center", gap: 10, padding: "0.65rem 1rem",
                background: lang === l.code ? "rgba(201,48,44,0.06)" : "transparent",
                border: "none", cursor: "pointer",
                fontSize: "0.82rem", fontWeight: lang === l.code ? 700 : 500,
                color: lang === l.code ? T.gold : T.text,
                fontFamily: "'Inter', sans-serif", transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "1.1rem" }}>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 11. Floating Navigation
function FloatingNav({ pages, activePage, setPage }) {
  useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const progress = useScrollProgress();

  const NAV_KEYS = { accueil:"nav_accueil", catalogue:"nav_catalogue", realisations:"nav_realisations", equipe:"nav_equipe", admin:"nav_admin" };

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 40); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0,
        width: `${progress}%`, height: 3,
        background: `linear-gradient(to right, ${T.gold}, ${T.gold2})`,
        zIndex: 1003, transition: "width 0.1s ease",
      }} />

      <nav style={{
        position: "fixed",
        top: isScrolled ? 12 : 0,
        left: isScrolled ? "4%" : 0,
        right: isScrolled ? "4%" : 0,
        width: isScrolled ? "92%" : "100%",
        maxWidth: 1400,
        margin: "0 auto",
        background: isScrolled ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(16px)",
        border: isScrolled ? `1px solid ${T.border}` : `1px solid rgba(226, 232, 240, 0.6)`,
        borderRadius: isScrolled ? T.radius : 0,
        height: 68,
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "0 1px 0 rgba(0,0,0,0.05)",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 1000,
      }}>
        <Logo onClick={() => { setPage("accueil"); setIsOpen(false); }} />

        <div className="nav-desktop-menu" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {pages.map(([k]) => (
            <NavBtn key={k} label={t(NAV_KEYS[k] || k)} active={activePage === k} onClick={() => setPage(k)} />
          ))}
          <div style={{ marginLeft: 8 }}><LangSwitcher /></div>
        </div>

        <button
          aria-label={t("nav_open")}
          className="nav-mobile-trigger"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            width: 30, height: 30, display: "none",
            flexDirection: "column", justifyContent: "center",
            gap: 6, position: "relative", zIndex: 1002,
          }}
        >
          {isOpen ? <X size={24} color={T.text}/> : <Menu size={24} color={T.text}/>}
        </button>
      </nav>

      {isOpen && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          zIndex: 999, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "2rem", animation: "pageEnter 0.3s ease",
        }}>
          {pages.map(([k]) => (
            <button key={k} onClick={() => { setPage(k); setIsOpen(false); }}
              style={{
                background: "none", border: "none", fontSize: "1.5rem",
                fontWeight: 700, color: activePage === k ? T.gold : T.text,
                cursor: "pointer", transition: "all 0.2s",
                letterSpacing: "1px", fontFamily: "'Syne', sans-serif"
              }}
            >
              {t(NAV_KEYS[k] || k)}
            </button>
          ))}
          <div style={{ marginTop: "1rem" }}><LangSwitcher /></div>
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
        background: active ? "rgba(201, 48, 44, 0.07)" : hov ? "rgba(15, 23, 42, 0.04)" : "none",
        border: "none",
        color: active ? T.gold : hov ? T.text : T.muted,
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
        background: hov ? "rgba(201, 48, 44, 0.1)" : "rgba(201, 48, 44, 0.05)",
        color: T.gold,
        border: `1px solid rgba(201, 48, 44, ${hov ? 0.35 : 0.18})`,
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
        background: hov ? "rgba(201, 48, 44, 0.07)" : T.bgSection,
        border: `1px solid ${hov ? T.gold : T.border}`,
        padding: "0.45rem 1.25rem",
        borderRadius: 30,
        fontSize: "0.8rem",
        fontWeight: 600,
        color: hov ? T.gold : T.text,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 4px 15px rgba(201,48,44,0.1)" : "none",
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
    border: `1.5px solid ${foc ? T.gold : T.border}`,
    borderRadius: 10,
    fontSize: "0.88rem",
    background: foc ? "#fff" : T.bgSection,
    color: T.text,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxShadow: foc ? `0 0 0 3px rgba(201, 48, 44, 0.1)` : "none",
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
            <option key={o} value={o} style={{ background: "#fff", color: T.text }}>
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
const SEO_PAGES = {
  accueil: {
    title: "Easy China – Import, Université, Visa & Tourisme Chine depuis le Togo",
    desc: "Easy China : votre agence de référence entre le Togo et la Chine. Import direct Guangzhou & Yiwu, inscription université chinoise avec bourses, visa Chine rapide, formation professionnelle, voyages tourisme & affaires. Bureau à Lomé.",
    keywords: "import chine togo, importation guangzhou lomé, université chine inscription, bourse études chine togo, visa chine togo, tourisme voyage chine, voyage affaires chine, formation professionnelle chine, sourcing guangzhou yiwu, easy china lomé, transitaire chine togo, logistique chine afrique, dédouanement togo, marché yiwu achat, agent import chine",
    url: "https://easychina-services.com/",
  },
  catalogue: {
    title: "Catalogue Import Direct Chine – Machines, Textile, Électronique | Easy China Togo",
    desc: "Importez directement depuis la Chine au meilleur prix : machines industrielles pressing & blanchisserie, électronique LED, textile soie & lin, équipements agroalimentaires. Sourcing Guangzhou et Yiwu avec inspection qualité garantie.",
    keywords: "catalogue import chine, machines pressing chine, blanchisserie industrielle chine, électronique LED chine togo, textile soie lin import, machines industrielles togo, sourcing guangzhou, yiwu marché achat, importateur togo chine, fournisseur chine direct, prix usine chine",
    url: "https://easychina-services.com/#catalogue",
  },
  realisations: {
    title: "Réalisations & Témoignages Clients – Easy China | Import, Études, Visa Togo",
    desc: "Nos succès en images : conteneurs importés depuis Guangzhou, étudiants boursiers dans les meilleures universités chinoises, ouvertures de blanchisseries professionnelles, visas obtenus en 10 jours. Témoignages clients Easy China.",
    keywords: "témoignages easy china, réalisations import chine togo, bourses université chine avis, blanchisserie chine formation, visa chine 10 jours, client easy china togo, importation réussie chine",
    url: "https://easychina-services.com/#realisations",
  },
  equipe: {
    title: "Notre Équipe d'Experts Chine-Afrique | Easy China Lomé Togo",
    desc: "Rencontrez l'équipe Easy China : directeur général basé à Guangzhou, responsable académique ancienne boursière Wuhan, expert logistique transit maritime. Votre pont humain entre le Togo et la Chine.",
    keywords: "équipe easy china, expert import chine lomé, agent universitaire chine togo, transitaire maritime togo chine, contact easy china, bureau lomé guangzhou",
    url: "https://easychina-services.com/#equipe",
  },
};

function SEOHead({ page }) {
  useEffect(() => {
    const seo = SEO_PAGES[page] || SEO_PAGES.accueil;
    const SITE = "https://easychina-services.com";
    const OG_IMG = `${SITE}/og-cover.jpg`;

    document.title = seo.title;

    const setMeta = (name, val, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", href);
    };

    // Standard SEO
    setMeta("description", seo.desc);
    setMeta("keywords", seo.keywords);
    setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("author", "Easy China Services");
    setMeta("language", "French");
    setMeta("geo.region", "TG");
    setMeta("geo.placename", "Lomé, Togo");

    // Canonical
    setLink("canonical", seo.url || SITE);

    // Open Graph
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Easy China Services", true);
    setMeta("og:locale", "fr_FR", true);
    setMeta("og:title", seo.title, true);
    setMeta("og:description", seo.desc, true);
    setMeta("og:url", seo.url || SITE, true);
    setMeta("og:image", OG_IMG, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", "Easy China – Agence Chine-Togo", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.desc);
    setMeta("twitter:image", OG_IMG);
    setMeta("twitter:image:alt", "Easy China – Agence Chine-Togo");

    // JSON-LD Structured Data
    let script = document.getElementById("jsonld-schema");
    if (!script) { script = document.createElement("script"); script.id = "jsonld-schema"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${SITE}/#business`,
          "name": "Easy China Services",
          "alternateName": "Easy China",
          "description": "Agence de liaison commerciale et académique internationale spécialisée dans l'import depuis la Chine, l'inscription dans les universités chinoises, l'obtention de visas, la formation professionnelle et le tourisme d'affaires.",
          "url": SITE,
          "logo": `${SITE}/favicon.svg`,
          "image": OG_IMG,
          "telephone": "+22890000001",
          "email": "contact@easychina-services.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Quartier Hédzranawoé",
            "addressLocality": "Lomé",
            "addressCountry": "TG"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": 6.1375, "longitude": 1.2123 },
          "areaServed": [
            { "@type": "Country", "name": "Togo" },
            { "@type": "Country", "name": "Chine" },
            { "@type": "Country", "name": "La Réunion" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services Easy China",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Import & Logistique depuis la Chine", "description": "Sourcing produits en Chine, inspection qualité usine, transport maritime, dédouanement Togo." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Inscription Université Chinoise & Bourses", "description": "Admission dans les universités chinoises, dossier bourse gouvernementale, accompagnement complet." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Visa Chine", "description": "Obtention visa Chine touristique, affaires, études et travail depuis le Togo." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formation Professionnelle en Chine", "description": "Formations techniques en Chine : pressing, blanchisserie industrielle, maintenance machines." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tourisme & Voyage d'Affaires en Chine", "description": "Organisation de voyages d'affaires à Guangzhou et Yiwu, visites d'usines, circuits touristiques." } }
            ]
          },
          "sameAs": [],
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        },
        {
          "@type": "WebSite",
          "@id": `${SITE}/#website`,
          "url": SITE,
          "name": "Easy China Services",
          "description": seo.desc,
          "inLanguage": "fr-FR",
          "publisher": { "@id": `${SITE}/#business` }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Comment importer des marchandises depuis la Chine vers le Togo ?", "acceptedAnswer": { "@type": "Answer", "text": "Easy China gère l'intégralité du processus : identification des fournisseurs certifiés, inspection qualité en usine à Guangzhou ou Yiwu, groupage maritime, dédouanement au port de Lomé." } },
            { "@type": "Question", "name": "Quels sont les délais pour obtenir un visa Chine depuis le Togo ?", "acceptedAnswer": { "@type": "Answer", "text": "Avec notre service visa express, vous obtenez votre visa touristique ou d'affaires en 7 à 15 jours ouvrés." } },
            { "@type": "Question", "name": "Comment s'inscrire dans une université chinoise et obtenir une bourse ?", "acceptedAnswer": { "@type": "Answer", "text": "Notre responsable académique vous accompagne de A à Z : choix de l'université, dépôt des dossiers d'admission, demande de bourse gouvernementale CSC, obtention du visa étudiant et installation en Chine." } },
            { "@type": "Question", "name": "Quels produits puis-je importer depuis la Chine avec Easy China ?", "acceptedAnswer": { "@type": "Answer", "text": "Nous importons tous types de marchandises : machines industrielles (pressing, blanchisserie, conditionnement alimentaire), électronique LED, textile, équipements agricoles, mobilier, et bien plus." } },
            { "@type": "Question", "name": "Easy China est-elle réellement présente en Chine ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui, nos équipes sont physiquement implantées à Guangzhou (Guangdong) et à Yiwu (Zhejiang), les deux capitales mondiales du commerce de gros." } }
          ]
        }
      ]
    });
  }, [page]);

  return null;
}

// ─── PAGES & SECTIONS ────────────────────────────────────────────────────────

// 1. Section Hero — Split Layout Light
function HeroSection({ goTo }) {
  useLang();
  const heroStats = [
    { n: 500, l: t("hero_stat1"), s: "+" },
    { n: 8,   l: t("hero_stat2"), s: "+" },
    { n: 2,   l: t("hero_stat3"), s: "" },
    { n: 100, l: t("hero_stat4"), s: "%" },
  ];

  return (
    <div className="hero-split" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "100vh",
      overflow: "hidden",
    }}>
      {/* Left — Text Content */}
      <div style={{
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "7rem 4rem 4rem clamp(2rem, 8%, 6rem)",
      }}>
        <ScrollReveal direction="right" delay={0.1}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(201, 48, 44, 0.07)",
            border: "1px solid rgba(201, 48, 44, 0.2)",
            color: T.gold,
            fontSize: "0.72rem",
            padding: "0.45rem 1.1rem",
            borderRadius: 30,
            marginBottom: "2rem",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            fontWeight: 700,
          }}>
            <Globe size={13}/> {t("hero_badge")}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.2}>
          <h1 style={{
            fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            fontFamily: "'Syne', sans-serif",
            color: T.text,
            letterSpacing: "-0.5px",
          }}>
            EASY CHINA
            <br/>
            <span style={{ color: T.gold }}>{t("hero_title2")}</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.3}>
          <p style={{
            color: T.muted,
            fontSize: "1rem",
            maxWidth: 460,
            lineHeight: 1.8,
            marginBottom: "2.5rem",
          }}>
            {t("hero_desc")}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.4}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <GoldenBtn variant="solid" onClick={() => goTo("catalogue")}>
              <Package size={17} style={{marginRight: 8}}/> {t("hero_cta1")}
            </GoldenBtn>
            <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite obtenir des informations sur vos services."))}>
              <MessageCircle size={17} style={{marginRight: 8}}/> {t("hero_cta2")}
            </GoldenBtn>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.5}>
          <div style={{
            display: "flex",
            gap: "2.5rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${T.border}`,
            flexWrap: "wrap",
          }}>
            {heroStats.map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: "1.9rem",
                  fontWeight: 800,
                  color: T.gold,
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1,
                }}>
                  <AnimatedCounter value={s.n} suffix={s.s} duration={2} />
                </div>
                <div style={{
                  fontSize: "0.7rem",
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  fontWeight: 600,
                  marginTop: 4,
                }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right — Image Panel */}
      <div className="hero-image-panel" style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
        <Img
          src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1200&h=1400&q=80"
          alt="Shanghai skyline"
          style={{ borderRadius: 0, height: "100%", width: "100%" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.25) 100%)",
          zIndex: 1,
        }} />
        {/* Floating info card */}
        <div style={{
          position: "absolute",
          bottom: 36,
          left: 32,
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(12px)",
          borderRadius: T.radius,
          padding: "1.1rem 1.4rem",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        }}>
          <div style={{
            width: 42,
            height: 42,
            background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <MapPin size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", color: T.text, lineHeight: 1.3 }}>{t("hero_offices")}</div>
            <div style={{ fontSize: "0.75rem", color: T.muted, marginTop: 2 }}>{t("hero_cities")}</div>
          </div>
        </div>
        {/* Red accent ribbon */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 5,
          height: "100%",
          background: `linear-gradient(to bottom, ${T.gold}, ${T.gold2})`,
          zIndex: 2,
        }} />
      </div>
    </div>
  );
}

// 2. Page d'Accueil Principale
function PageAccueil({ goTo }) {
  useLang();
  const services = [
    { icon: <Ship size={26}/>, cat: "Import", title: t("svc1_name"), text: t("svc1_desc") },
    { icon: <GraduationCap size={26}/>, cat: "Études", title: t("svc2_name"), text: t("svc2_desc") },
    { icon: <Wrench size={26}/>, cat: "Formation", title: t("svc3_name"), text: t("svc3_desc") },
    { icon: <FileCheck size={26}/>, cat: "Visa", title: t("svc4_name"), text: t("svc4_desc") },
  ];

  const historyItems = [
    { year: "2017", title: "Fondation d'Easy China", desc: "Création de l'agence à Lomé, Togo avec pour mission de simplifier la liaison commerciale et académique entre l'Afrique de l'Ouest et la Chine." },
    { year: "2019", title: "Ouverture du Bureau en Chine", desc: "Établissement de nos bureaux permanents à Guangzhou et Yiwu pour assurer une inspection qualité physique en usine et un accompagnement local des étudiants." },
    { year: "2021", title: "Expansion de l'Offre Universitaire", desc: "Signature de partenariats exclusifs avec plus de 30 grandes universités chinoises, garantissant l'accès à des bourses gouvernementales d'excellence." },
    { year: "2024", title: "Digitalisation & Transitaire", desc: "Lancement de notre service de suivi logistique automatisé et renforcement de notre flotte transitaire maritime pour des imports 100% sécurisés." }
  ];

  const officesList = [
    { flag: "🇹🇬", title: "Easy China Lomé", query: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Quartier Hédzranawoé, Lomé, Togo", "contact@easychina-services.com", "+228 90 XX XX XX"] },
    { flag: "🇨🇳", title: "Guangzhou Permanent", query: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Guangzhou CBD & Yiwu City", "Sourcing direct, inspection logistique", "Présence physique permanente"] }
  ];

  return (
    <div>
      <HeroSection goTo={goTo} />

      {/* Services Grid */}
      <div style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("svc_eyebrow")} title={t("svc_title")} subtitle={t("svc_subtitle")} />
        <div className="grid-3">
          {services.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <GlassCard tilt={true} style={{ height: "100%", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                <div style={{ height: 180, position: "relative" }}>
                  <Img src={UNSPLASH_REAL[s.cat] || UNSPLASH[s.cat]} alt={s.title} style={{ borderRadius: "0px", height: "100%" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))",
                  }} />
                  <div style={{
                    position: "absolute", bottom: -20, left: "2rem",
                    width: 50, height: 50, borderRadius: 12,
                    background: `linear-gradient(135deg, ${T.gold}, ${T.gold2})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(201,48,44,0.3)",
                    color: "#fff",
                    zIndex: 3
                  }}>{s.icon}</div>
                </div>
                <div style={{ padding: "2.5rem 2rem 2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", color: T.text, fontWeight: 700, marginBottom: "0.8rem", marginTop: "0.5rem", textAlign: "left" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.88rem", color: T.muted, lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "left" }}>{s.text}</p>
                  </div>
                  <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite obtenir des informations sur le service : "${s.title}".`))} style={{ width: "100%" }}>
                    {t("svc_learn")}
                  </GoldenBtn>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Tourisme & Business Section */}
      <div style={{ background: T.bgSection, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <div className="grid-50-50" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.72rem", color: T.gold, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.8rem" }}>{t("tour_eyebrow")}</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: T.text, lineHeight: 1.2, marginBottom: "1.5rem", fontFamily: "'Syne', sans-serif" }}>
                {t("tour_title")}
              </h2>
              <p style={{ color: T.muted, lineHeight: 1.7, marginBottom: "1.2rem", fontSize: "0.95rem" }}>
                {t("tour_p1")}
              </p>
              <p style={{ color: T.muted, lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.95rem" }}>
                {t("tour_p2")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
                {(t("tour_tags") || []).map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <GlassCard tilt={true} style={{ padding: "2.5rem", textAlign: "center", background: "rgba(201, 48, 44,0.02)" }}>
              <div style={{ height: 250, marginBottom: "2rem", borderRadius: T.radius, overflow: "hidden" }}>
                <Img src="https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=800&h=600&q=80" alt="guangzhou market" style={{ height: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {["🇨🇳 Guangzhou", "🇨🇳 Yiwu", "🇹🇬 Lomé"].map(c => (
                  <CityPill key={c}>{c}</CityPill>
                ))}
              </div>
              <p style={{ color: T.muted, fontSize: "0.8rem", marginTop: "1.5rem", fontStyle: "italic" }}>
                {t("tour_note")}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("hist_eyebrow")} title={t("hist_title")} subtitle={t("hist_subtitle")} />
        <Timeline items={historyItems} />
      </div>

      {/* Testimonials Section */}
      <div style={{ background: T.bgSection, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("test_eyebrow")} title={t("test_title")} subtitle={t("test_subtitle")} />
        <TestimonialCarousel />
      </div>

      {/* Bureaux Section */}
      <div style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("off_eyebrow")} title={t("off_title")} />
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
      <div style={{
        background: `linear-gradient(135deg, ${T.gold} 0%, ${T.gold2} 60%, #b71c1c 100%)`,
        padding: "7rem 2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        zIndex: 2,
      }}>
        {/* Geometric decorations */}
        <div style={{
          position: "absolute", left: "-5%", top: "-30%",
          width: 450, height: 450, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", right: "-5%", bottom: "-30%",
          width: 350, height: 350, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 650, margin: "0 auto" }}>
          <ScrollReveal direction="up" delay={0.1}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "'Syne', sans-serif", color: "#fff" }}>
              {t("cta_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.75, marginBottom: "3rem" }}>
              {t("cta_subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <GoldenBtn variant="white" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour, je souhaite démarrer un projet d'importation/études avec Easy China."))}>
              <TrendingUp size={18} style={{marginRight: 8}}/> {t("cta_btn")}
            </GoldenBtn>
          </ScrollReveal>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: "6rem 2rem", maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("faq_eyebrow")} title={t("faq_title")} subtitle={t("faq_subtitle")} />
        <FAQAccordion />
      </div>

      {/* Formulaire de Contact */}
      <div style={{ background: T.bgSection, borderTop: `1px solid ${T.border}`, padding: "6rem 2rem", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <SectionTitle eyebrow={t("form_eyebrow")} title={t("form_title")} subtitle={t("form_subtitle")} />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

// FAQ Accordion
function FAQAccordion() {
  useLang();
  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {faqs.map((faq, i) => (
        <ScrollReveal key={i} direction="up" delay={i * 0.05}>
          <div style={{
            border: `1px solid ${open === i ? T.gold : T.border}`,
            borderRadius: T.radius,
            overflow: "hidden",
            background: "#fff",
            boxShadow: open === i ? "0 4px 20px rgba(201,48,44,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "all 0.3s ease",
          }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "1.3rem 1.8rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.92rem", color: T.text, paddingRight: "1rem", lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: open === i ? `linear-gradient(135deg, ${T.gold}, ${T.gold2})` : T.bgSection,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease",
              }}>
                <ChevronDown size={16}
                  color={open === i ? "#fff" : T.muted}
                  style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
                />
              </span>
            </button>
            {open === i && (
              <div style={{ padding: "0 1.8rem 1.4rem", animation: "pageEnter 0.25s ease" }}>
                <p style={{ color: T.muted, fontSize: "0.88rem", lineHeight: 1.75, borderTop: `1px solid ${T.border}`, paddingTop: "1rem" }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      ))}
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
  useLang();
  const [f, setF] = useState({ nom: "", email: "", service: "Import & Logistique", msg: "" });
  const [honey, setHoney] = useState("");
  const [isSending, setIsSending] = useState(false);

  const send = () => {
    if (isSending) return;
    if (honey) return;
    if (!f.nom || !f.email || !f.msg) {
      alert(t("form_required"));
      return;
    }
    setIsSending(true);
    const txt = `Bonjour Easy China,\n\nNom: ${sanitize(f.nom)}\nEmail: ${sanitize(f.email)}\nService concerné: ${f.service}\n\nMessage:\n${sanitize(f.msg)}`;
    window.open(waLink(WA_COMMERCIAL, txt));
    setTimeout(() => setIsSending(false), 2000);
  };

  return (
    <GlassCard style={{ padding: "2.5rem", width: "100%", border: `1.5px solid ${T.border}` }}>
      <input type="text" value={honey} onChange={e => setHoney(e.target.value)}
        style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
      <Field label={t("form_name")} value={f.nom} onChange={v => setF(p => ({ ...p, nom: v }))} placeholder={t("form_ph_name")} />
      <Field label={t("form_email")} type="email" value={f.email} onChange={v => setF(p => ({ ...p, email: v }))} placeholder={t("form_ph_email")} />
      <Field label={t("form_service")} value={f.service} onChange={v => setF(p => ({ ...p, service: v }))}
        options={["Import & Logistique", "Université & Études", "Formation Professionnelle", "Assistance Visa", "Tourisme & Business"]} />
      <Field label={t("form_msg")} value={f.msg} onChange={v => setF(p => ({ ...p, msg: v }))} placeholder={t("form_ph_msg")} rows={4} />
      <GoldenBtn variant="solid" onClick={send} disabled={isSending} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
        {isSending ? <Clock size={18} style={{marginRight: 8}}/> : <MessageCircle size={18} style={{marginRight: 8}}/>}
        {isSending ? t("form_sending") : t("form_btn")}
      </GoldenBtn>
    </GlassCard>
  );
}

// ─── PAGE CATALOGUE ──────────────────────────────────────────────────────────
function PageCatalogue({ articles }) {
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
    <div style={{ padding: "8rem 2rem 6rem", maxWidth: 1200, margin: "0 auto" }}>
      <SectionTitle
        eyebrow={t("cat_eyebrow")}
        title={t("cat_title")}
        subtitle={t("cat_subtitle")}
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
                  background: isActive ? `linear-gradient(135deg, ${T.gold}, ${T.gold2})` : T.bgSection,
                  border: `1px solid ${isActive ? T.gold : T.border}`,
                  color: isActive ? "#fff" : T.muted,
                  padding: "0.6rem 1.5rem",
                  borderRadius: 30,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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
  useLang();
  return (
    <div style={{ padding: "8rem 2rem 6rem", maxWidth: 1200, margin: "0 auto" }}>
      <SectionTitle
        eyebrow={t("real_eyebrow")}
        title={t("real_title")}
        subtitle={t("real_subtitle")}
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
                        background: "linear-gradient(to bottom, transparent 30%, rgba(0, 0, 0, 0.7))"
                      }} />
                    </div>
                  )}

                  <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContext: "space-between", marginBottom: "0.8rem", justifyContent: "space-between" }}>
                        <span style={{
                          background: "rgba(201, 48, 44,0.08)",
                          border: `1px solid rgba(201, 48, 44,0.25)`,
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
                        borderTop: `1px solid ${T.border}`,
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
          background: `linear-gradient(135deg, ${T.bgSection}, #fff)`,
          border: `1.5px solid ${T.border}`,
          padding: "3.5rem",
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: 800, color: T.text, marginBottom: "1rem", fontFamily: "'Syne', sans-serif" }}>
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

// ─── PAGE ÉQUIPE ─────────────────────────────────────────────────────────────
function PageEquipe({ equipe }) {
  useLang();
  const DEFAULT_IMG = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&h=600&q=80";

  return (
    <div style={{ padding: "8rem 2rem 6rem" }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${T.gold} 0%, ${T.gold2} 60%, #b71c1c 100%)`,
        borderRadius: T.radius,
        padding: "4rem 3rem",
        textAlign: "center",
        marginBottom: "5rem",
        position: "relative",
        overflow: "hidden",
        maxWidth: 1100,
        margin: "0 auto 5rem",
      }}>
        <div style={{ position: "absolute", left: "-5%", top: "-40%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-40%", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 20, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
            {t("eq_eyebrow")}
            <span style={{ display: "inline-block", width: 20, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: "1rem" }}>
            {t("eq_title")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            {t("eq_subtitle")}
          </p>
        </ScrollReveal>
      </div>

      {/* Team Cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="grid-3">
          {equipe.map((member, i) => {
            const specs = member.specialites ? member.specialites.split(",").map(s => s.trim()).filter(Boolean) : [];
            return (
              <ScrollReveal key={member.id} direction="up" delay={i * 0.1}>
                <GlassCard tilt={true} style={{ padding: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Photo */}
                  <div style={{ height: 300, position: "relative", flexShrink: 0 }}>
                    <Img src={member.image || DEFAULT_IMG} alt={member.nom} style={{ height: "100%", borderRadius: "0px" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.65))" }} />
                    {/* Name overlay on photo */}
                    <div style={{ position: "absolute", bottom: 18, left: 22, right: 22, zIndex: 2 }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>{member.nom}</h3>
                      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.78rem", fontWeight: 600 }}>{member.poste}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.8rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.85rem", color: T.muted, lineHeight: 1.7, marginBottom: "1.2rem" }}>{member.bio}</p>

                      {specs.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
                          {specs.map((s, j) => (
                            <span key={j} style={{
                              background: "rgba(201,48,44,0.06)",
                              border: "1px solid rgba(201,48,44,0.18)",
                              color: T.gold,
                              padding: "0.3rem 0.75rem",
                              borderRadius: 20,
                              fontSize: "0.72rem",
                              fontWeight: 600,
                            }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1.2rem", display: "flex", flexDirection: "column", gap: 10 }}>
                      {member.contact && (
                        <a href={`tel:${member.contact.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 10, color: T.muted, fontSize: "0.82rem", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = T.gold}
                          onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                          <span style={{ width: 30, height: 30, background: "rgba(201,48,44,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Phone size={13} color={T.gold} />
                          </span>
                          {member.contact}
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ display: "flex", alignItems: "center", gap: 10, color: T.muted, fontSize: "0.82rem", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = T.gold}
                          onMouseLeave={e => e.currentTarget.style.color = T.muted}>
                          <span style={{ width: 30, height: 30, background: "rgba(201,48,44,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Mail size={13} color={T.gold} />
                          </span>
                          {member.email}
                        </a>
                      )}
                      <GoldenBtn variant="outline"
                        onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour, je souhaite contacter ${member.nom} (${member.poste}) d'Easy China.`))}
                        style={{ width: "100%", marginTop: 4 }}>
                        <MessageCircle size={14} style={{ marginRight: 6 }}/> {t("eq_contact")}
                      </GoldenBtn>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>

        {equipe.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: T.muted }}>
            <Users size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>L'équipe n'a pas encore été renseignée.</p>
          </div>
        )}
      </div>
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
          border:`2px dashed ${drag?T.gold:T.border}`,
          borderRadius:12, padding:"1rem", textAlign:"center",
          cursor:"pointer", background: drag?"rgba(201,48,44,0.05)":T.bgSection,
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
                Glisse une photo ici ou <span style={{color: T.gold,
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
        style={{width:"100%",marginTop:8,padding:".6rem .9rem",border:`1.5px solid ${T.border}`,
          borderRadius:8,fontSize:".8rem",fontFamily:"inherit",outline:"none", background: T.bgSection, color: T.text}}
      />
    </div>
  );
};

// ─── PAGE ADMIN ──────────────────────────────────────────────────────────────
function PageAdmin({ articles, setArticles, realisations, setRealisations, equipe, setEquipe }) {
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

  // Équipe Form State
  const [memNom, setMemNom] = useState("");
  const [memPoste, setMemPoste] = useState("");
  const [memBio, setMemBio] = useState("");
  const [memContact, setMemContact] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [memSpecialites, setMemSpecialites] = useState("");
  const [memImage, setMemImage] = useState("");
  const [editingMemId, setEditingMemId] = useState(null);

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

  // CRUD Équipe Actions
  const resetMemForm = () => {
    setEditingMemId(null);
    setMemNom(""); setMemPoste(""); setMemBio("");
    setMemContact(""); setMemEmail(""); setMemSpecialites(""); setMemImage("");
  };

  const handleSaveMembre = () => {
    if (!memNom || !memPoste) {
      alert("Le nom et le poste sont obligatoires.");
      return;
    }
    if (memImage && !memImage.startsWith("https://") && !memImage.startsWith("data:")) {
      alert("L'URL de l'image doit commencer par https:// ou être une photo importée.");
      return;
    }
    const cleanNom = sanitize(memNom).slice(0, 100);
    const cleanPoste = sanitize(memPoste).slice(0, 100);
    const cleanBio = sanitize(memBio).slice(0, 800);
    const cleanContact = sanitize(memContact).slice(0, 60);
    const cleanEmail = sanitize(memEmail).slice(0, 120);
    const cleanSpec = sanitize(memSpecialites).slice(0, 300);

    if (editingMemId) {
      setEquipe(prev => prev.map(m => m.id === editingMemId
        ? { ...m, nom: cleanNom, poste: cleanPoste, bio: cleanBio, contact: cleanContact, email: cleanEmail, specialites: cleanSpec, image: memImage }
        : m
      ));
    } else {
      setEquipe(prev => [...prev, {
        id: Date.now().toString(),
        nom: cleanNom, poste: cleanPoste, bio: cleanBio,
        contact: cleanContact, email: cleanEmail,
        specialites: cleanSpec, image: memImage
      }]);
    }
    resetMemForm();
  };

  const handleEditMembre = (m) => {
    setMemNom(m.nom); setMemPoste(m.poste); setMemBio(m.bio || "");
    setMemContact(m.contact || ""); setMemEmail(m.email || "");
    setMemSpecialites(m.specialites || ""); setMemImage(m.image || "");
    setEditingMemId(m.id);
  };

  const handleDeleteMembre = (id) => {
    if (window.confirm("Supprimer ce membre de l'équipe ?")) {
      setEquipe(prev => prev.filter(m => m.id !== id));
      if (editingMemId === id) resetMemForm();
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
              background: "rgba(201,48,44,0.1)",
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

      {/* Important notice about localStorage */}
      <div style={{
        background: "rgba(201,48,44,0.05)", border: `1.5px solid rgba(201,48,44,0.25)`,
        borderRadius: T.radius, padding: "1.2rem 1.6rem", marginBottom: "2.5rem",
        display: "flex", gap: 14, alignItems: "flex-start",
      }}>
        <AlertCircle size={20} color={T.gold} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, color: T.text, fontSize: "0.88rem", marginBottom: "0.3rem" }}>
            ⚠️ Portée des modifications
          </div>
          <p style={{ color: T.muted, fontSize: "0.82rem", lineHeight: 1.6 }}>
            Les modifications effectuées ici sont sauvegardées dans <strong>votre navigateur uniquement</strong> (localStorage). Pour que vos changements soient visibles par tous les visiteurs du site, il faut déployer une nouvelle version du site avec les données mises à jour. Contactez votre développeur ou utilisez le panneau de déploiement Vercel.
          </p>
        </div>
      </div>

      <div className="grid-50-50" style={{ alignItems: "flex-start", gap: "2.5rem" }}>
        {/* CATALOGUE CRUD PANEL */}
        <GlassCard style={{ padding: "2.2rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "1.5rem", textAlign: "left" }}>
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
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "1.5rem", textAlign: "left" }}>
            Produits du Catalogue ({articles.length})
          </h3>
          {articles.length === 0 ? (
            <p style={{ color: T.muted, fontSize: "0.85rem" }}>Aucun produit dans le catalogue.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {articles.map((art) => (
                <div key={art.id} style={{
                  padding: "1rem",
                  background: T.bgSection,
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
                      style={{ background: "rgba(201, 48, 44,0.15)", color: T.gold, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
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
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "1.5rem", textAlign: "left" }}>
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
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "1.5rem", textAlign: "left" }}>
            Réalisations Clients ({realisations.length})
          </h3>
          {realisations.length === 0 ? (
            <p style={{ color: T.muted, fontSize: "0.85rem" }}>Aucune réalisation enregistrée.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {realisations.map((real) => (
                <div key={real.id} style={{
                  padding: "1rem",
                  background: T.bgSection,
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
                      style={{ background: "rgba(201, 48, 44,0.15)", color: T.gold, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
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

      <div style={{ height: "4rem" }} />

      {/* ─── ÉQUIPE CRUD ─── */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "0.4rem" }}>
          👥 Gestion de l'Équipe
        </h3>
        <p style={{ color: T.muted, fontSize: "0.85rem" }}>Ajoutez, modifiez ou retirez des membres de la page Équipe publique.</p>
      </div>

      <div className="grid-50-50" style={{ alignItems: "flex-start", gap: "2.5rem" }}>
        {/* ÉQUIPE FORM */}
        <GlassCard style={{ padding: "2.2rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "1.5rem", textAlign: "left" }}>
            {editingMemId ? "✏️ Modifier le Membre" : "➕ Ajouter un Membre"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Nom Complet *" value={memNom} onChange={setMemNom} placeholder="Ex: Jean Koffi" />
            <Field label="Poste / Rôle *" value={memPoste} onChange={setMemPoste} placeholder="Ex: Directeur Général" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Téléphone" value={memContact} onChange={setMemContact} placeholder="+228 90 00 00 00" />
            <Field label="Email" type="email" value={memEmail} onChange={setMemEmail} placeholder="nom@easychina.com" />
          </div>
          <Field
            label="Spécialités (séparées par des virgules)"
            value={memSpecialites}
            onChange={setMemSpecialites}
            placeholder="Import & Logistique, Visas, Négociation"
          />
          <Field label="Biographie *" value={memBio} onChange={setMemBio} placeholder="Parcours, expertise, années d'expérience..." rows={4} />
          <ImageUpload value={memImage} onChange={setMemImage} />
          <div style={{ display: "flex", gap: "1rem" }}>
            <GoldenBtn variant="solid" onClick={handleSaveMembre} style={{ flex: 1 }}>
              {editingMemId ? "Enregistrer les modifications" : "Ajouter à l'Équipe"}
            </GoldenBtn>
            {editingMemId && (
              <GoldenBtn variant="ghost" onClick={resetMemForm}>Annuler</GoldenBtn>
            )}
          </div>
        </GlassCard>

        {/* ÉQUIPE LIST */}
        <GlassCard style={{ padding: "2.2rem", maxHeight: "650px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: T.text, marginBottom: "1.5rem", textAlign: "left" }}>
            Membres de l'Équipe ({equipe.length})
          </h3>
          {equipe.length === 0 ? (
            <p style={{ color: T.muted, fontSize: "0.85rem" }}>Aucun membre enregistré.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {equipe.map((m) => (
                <div key={m.id} style={{
                  padding: "1rem",
                  background: T.bgSection,
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  {/* Mini photo */}
                  <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: T.border }}>
                    {m.image ? (
                      <img src={m.image} alt={m.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Users size={20} color={T.muted} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: T.text, margin: 0 }}>{m.nom}</h4>
                    <span style={{ fontSize: "0.75rem", color: T.gold, fontWeight: 600 }}>{m.poste}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button aria-label="Modifier" onClick={() => handleEditMembre(m)}
                      style={{ background: "rgba(201,48,44,0.1)", color: T.gold, border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Edit2 size={14}/>
                    </button>
                    <button aria-label="Supprimer" onClick={() => handleDeleteMembre(m.id)}
                      style={{ background: "rgba(180,0,0,0.1)", color: "#e53935", border: "none", borderRadius: 6, padding: "0.4rem 0.6rem", cursor: "pointer", display: "flex", alignItems: "center" }}>
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
  useLang();
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

  const [equipe, setEquipeState] = useState(() => {
    try {
      const stored = localStorage.getItem("ec_equipe");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      }
      return DEFAULT_EQUIPE;
    } catch {
      return DEFAULT_EQUIPE;
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

  const setEquipe = useCallback((v) => {
    setEquipeState((prev) => {
      const val = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem("ec_equipe", JSON.stringify(val)); } catch {}
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
    ["equipe", "Notre Équipe"],
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
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
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

        /* Hero split responsive */
        @media (max-width: 768px) {
          .hero-split {
            grid-template-columns: 1fr !important;
          }
          .hero-image-panel {
            min-height: 50vw !important;
            order: -1;
          }
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
          {page === "equipe" && <PageEquipe equipe={equipe} />}
          {page === "admin" && <PageAdmin articles={articles} setArticles={setArticles} realisations={realisations} setRealisations={setRealisations} equipe={equipe} setEquipe={setEquipe} />}
        </PageTransition>
      </main>

      {/* Footer */}
      <footer style={{
        background: "#1e293b",
        color: "#94a3b8",
        textAlign: "center",
        padding: "4rem 2rem",
        fontSize: "0.85rem",
        borderTop: `3px solid ${T.gold}`,
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.8rem" }}>
          {/* Logo adapted for dark footer */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => goTo("accueil")}>
              <svg width={38} height={38} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="42" height="42" rx="11" fill={T.gold}/>
                <path d="M10 13h10M10 13v16M10 21h8M10 29h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M24 16a7 7 0 1 0 0 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <polygon points="36,6 37.2,9.6 41,9.6 38,11.8 39.2,15.4 36,13.2 32.8,15.4 34,11.8 31,9.6 34.8,9.6" fill="#fff" opacity=".9"/>
              </svg>
              <div style={{ lineHeight: 1.15, textAlign: "left" }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", letterSpacing: "2.5px", fontFamily: "'Syne','Segoe UI',sans-serif" }}>
                  EASY <span style={{ color: T.gold }}>CHINA</span>
                </div>
                <div style={{ color: "#64748b", fontSize: ".46rem", letterSpacing: "3px", marginTop: 2, textTransform: "uppercase" }}>
                  Togo · Réunion · Chine
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.82rem", letterSpacing: "0.3px", color: "#64748b" }}>
            {t("footer_copy")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            {[["accueil","nav_accueil"],["catalogue","nav_catalogue"],["realisations","nav_realisations"],["equipe","nav_equipe"],["admin","nav_admin"]].map(([k, tk]) => (
              <span key={k} style={{ cursor: "pointer", color: "#94a3b8", transition: "color 0.2s", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                onClick={() => goTo(k)}>{t(tk)}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
