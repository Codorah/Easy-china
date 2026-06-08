import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, useLang, changeLang, LANGS } from "./i18n";
import {
  Ship, GraduationCap, Wrench, FileCheck, Globe, MapPin,
  Phone, Mail, ArrowRight, Send, Lock, LogOut, Plus,
  Edit2, Trash2, ChevronDown, Menu, X, Star, Package,
  Building2, Plane, Users, Award, TrendingUp, Clock,
  MessageCircle, CheckCircle, AlertCircle, Upload, Image,
  Search, Filter, ShieldCheck, Settings, Film, FileText, Play,
  Leaf, Zap, Hammer, Heart, Shirt, Smartphone, UtensilsCrossed, Wind,
  CalendarCheck, ClipboardList
} from "lucide-react";

// ─── DESIGN TOKEN BRIDGE ─────────────────────────────────────────────────────
// CSS vars are the source of truth (src/tokens.css).
// T gives JSX access to those vars as strings — no hardcoded hex here.
const T = {
  bg:           "var(--bg)",
  surface:      "var(--surface)",
  surfaceAlt:   "var(--surface-alt)",
  accentSoft:   "var(--accent-soft)",
  accent:       "var(--accent)",
  accentStrong: "var(--accent-strong)",
  secondary:    "var(--secondary)",
  border:       "var(--border)",
  text:         "var(--text)",
  muted:        "var(--muted)",
  pink:         "var(--danger)",
  radius:       12,
};

// ─── CONSTANTS & CONFIGURATION ───────────────────────────────────────────────
const WA_COMMERCIAL = "+8619876105148";
const WA_TRANSITAIRE = "+8619876105148";
const ADMIN_HASH = import.meta.env.VITE_ADMIN_HASH || "6e5349233f2be8ca69d702d25710ca05a515f608ce9f340512774f6c167ec3cb";

const GH_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GH_OWNER = "Codorah";
const GH_REPO  = "Easy-china";

function toBase64Unicode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

async function ghCommit(filepath, data) {
  if (!GH_TOKEN) return false;
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filepath}`;
  const headers = {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  const getRes = await fetch(url, { headers });
  if (!getRes.ok) return false;
  const { sha } = await getRes.json();
  const putRes = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `data: update ${filepath.split("/").pop()} via admin`,
      content: toBase64Unicode(JSON.stringify(data, null, 2)),
      sha,
    }),
  });
  return putRes.ok;
}

async function ghUploadMedia(file) {
  if (!GH_TOKEN) return null;
  const ext = file.name.split(".").pop().toLowerCase();
  const slug = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const filename = `${slug}.${ext}`;
  const filepath = `public/media/${filename}`;
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filepath}`;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target.result.split(",")[1];
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GH_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `media: upload ${file.name}`,
          content: b64,
        }),
      });
      resolve(res.ok ? `/media/${filename}` : null);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

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
    contact: "+86 198 7610 5148",
    email: "services@easychina.online",
    specialites: "Import & Logistique,Partenariats Chine,Négociations B2B",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=600&q=80"
  },
  {
    id: "2",
    nom: "Amivi Sénamé",
    poste: "Responsable Académique & Visas",
    bio: "Ancienne boursière à l'Université de Wuhan, Amivi dirige depuis 2019 le pôle universitaire d'Easy China. Elle accompagne personnellement chaque étudiant dans ses démarches d'inscription, d'obtention de bourses gouvernementales et de visa d'études.",
    contact: "+86 198 7610 5148",
    email: "services@easychina.online",
    specialites: "Admissions Universitaires,Bourses Gouvernementales,Visas Études",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&h=600&q=80"
  },
  {
    id: "3",
    nom: "Kwame Agbodjan",
    poste: "Responsable Logistique & Transit",
    bio: "Expert en transit international et dédouanement avec 8 ans d'expérience dans le fret maritime, Kwame gère l'ensemble de la chaîne logistique depuis les ports de Guangzhou et Yiwu jusqu'au port de Lomé. Il garantit la sécurité et la conformité de chaque cargaison.",
    contact: "+86 198 7610 5148",
    email: "services@easychina.online",
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

// ─── MEDIA HELPERS ───────────────────────────────────────────────────────────
const VIDEO_EXTS = ["mp4","mov","webm","avi","mkv","m4v","ogv"];
const DOC_EXTS   = ["pdf","doc","docx","xls","xlsx","ppt","pptx"];

function getMediaType(src) {
  if (!src) return "none";
  const ext = src.split(".").pop().toLowerCase().split("?")[0];
  if (VIDEO_EXTS.includes(ext)) return "video";
  if (DOC_EXTS.includes(ext))   return "doc";
  if (src.startsWith("data:video")) return "video";
  return "image";
}

// Affiche image, vidéo ou document selon la source
function MediaDisplay({ src, alt = "", style = {}, fallback }) {
  const type = getMediaType(src || fallback);
  const effective = src || fallback;
  if (!effective) return null;

  if (type === "video") {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", background: "#000", ...style }}>
        <video
          src={effective}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          preload="metadata"
          controls={false}
          muted
          loop
          onMouseEnter={e => e.target.play()}
          onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
        />
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.25)", pointerEvents: "none",
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Play size={18} color={"var(--accent)"} style={{ marginLeft: 3 }} />
          </div>
        </div>
      </div>
    );
  }
  if (type === "doc") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: 'var(--surface-alt)', gap: 8, ...style }}>
        <FileText size={36} color={"var(--accent)"} />
        <a href={effective} target="_blank" rel="noopener noreferrer" style={{ fontSize: ".78rem", color: 'var(--accent)', fontWeight: 600 }}>Ouvrir le document</a>
      </div>
    );
  }
  return <Img src={effective} alt={alt} style={style} />;
}

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
            border:`1px solid var(--border)`,
            display:"flex",alignItems:"center",justifyContent:"center",
            color: 'var(--accent)',borderRadius:"inherit"}}>
            <Image size={32}/>
          </div>
      }
    </div>
  );
};

// 2. Bouton Réutilisable
function GoldenBtn({ children, variant = "solid", onClick, style = {}, disabled = false, ariaLabel }) {
  const [isHovered, setIsHovered] = useState(false);

  const base = {
    border: "none",
    borderRadius: "var(--radius-full)",
    padding: "0.75rem 2rem",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    fontFamily: "var(--font-body)",
    letterSpacing: "0.02em",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "background 0.15s, box-shadow 0.15s, transform 0.15s",
    transform: isHovered && !disabled ? "translateY(-1px)" : "translateY(0)",
    opacity: disabled ? 0.55 : 1,
    outline: "none",
    userSelect: "none",
  };

  let variantStyle = {};
  if (variant === "solid" || variant === "glow") {
    variantStyle = {
      background: isHovered && !disabled ? "var(--accent-strong)" : "var(--accent)",
      color: "#fff",
      boxShadow: isHovered && !disabled ? "var(--shadow-accent)" : "var(--shadow-sm)",
    };
  } else if (variant === "outline") {
    variantStyle = {
      background: "transparent",
      color: "var(--accent)",
      border: "2px solid var(--accent)",
    };
  } else if (variant === "ghost") {
    variantStyle = {
      background: "transparent",
      color: "var(--text)",
    };
  } else if (variant === "white") {
    variantStyle = {
      background: "#ffffff",
      color: "var(--accent)",
      boxShadow: "var(--shadow-sm)",
    };
  }

  return (
    <button
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variantStyle, ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// 3. Card — consistent surface with token-based hover lift
function GlassCard({ children, tilt = true, style = {}, className = "" }) {
  return (
    <motion.div
      className={className}
      whileHover={tilt ? {
        y: -3,
        boxShadow: "0 12px 32px rgba(26,20,16,0.12), 0 4px 8px rgba(26,20,16,0.06)",
        borderColor: "rgba(201,48,44,0.18)",
      } : {}}
      transition={{ duration: 0.15, ease: "easeOut" }}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        padding: "var(--space-8)",
        boxShadow: "var(--shadow-sm)",
        cursor: "default",
        ...style,
      }}
    >
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </motion.div>
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

// 5. Scroll Reveal — fade + 14px translate, once, reduced-motion safe
function ScrollReveal({ children, delay = 0, direction = "up", duration = 0.5, style = {}, className = "" }) {
  const [ref, isVisible] = useScrollReveal({ once: true, threshold: 0.1 });

  const dist = 14;
  const hidden = {
    up:    `translateY(${dist}px)`,
    down:  `translateY(-${dist}px)`,
    left:  `translateX(${dist}px)`,
    right: `translateX(-${dist}px)`,
  }[direction] || `translateY(${dist}px)`;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0,0)" : hidden,
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}


// 7. SectionTitle
function SectionTitle({ eyebrow, title, subtitle, centered = true }) {
  return (
    <ScrollReveal direction="up" delay={0}>
      <div style={{ textAlign: centered ? "center" : "left", marginBottom: "var(--space-12)" }}>
        {eyebrow && (
          <div style={{
            fontSize: "var(--text-xs)",
            color: "var(--accent)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "var(--space-3)",
            fontFamily: "var(--font-body)",
          }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)",
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.2,
          marginBottom: subtitle ? "var(--space-4)" : 0,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{
            color: "var(--muted)",
            fontSize: "var(--text-base)",
            maxWidth: "56ch",
            margin: centered ? "0 auto" : "0",
            lineHeight: 1.7,
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
              background: "var(--accent)",
              border: `3px solid #fff`,
              transform: "translateX(-50%)",
              boxShadow: `0 0 0 3px rgba(201, 48, 44, 0.15)`,
              zIndex: 3,
            }} />

            <div className="timeline-card-wrapper" style={{ width: "45%" }}>
              <ScrollReveal direction={isLeft ? "left" : "right"} delay={index * 0.08}>
                <GlassCard tilt={true} style={{ padding: "1.8rem" }}>
                  <span style={{
                    fontSize: "var(--text-md)",
                    fontWeight: 700,
                    color: 'var(--accent)',
                    display: "block",
                    marginBottom: "0.4rem",
                    fontFamily: "var(--font-display)"
                  }}>
                    {item.year}
                  </span>
                  <h4 style={{
                    color: 'var(--text)',
                    fontSize: "var(--text-base)",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    color: 'var(--muted)',
                    fontSize: "var(--text-sm)",
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
        <div style={{ fontSize: "2.8rem", color: 'var(--accent)', lineHeight: 0.4, opacity: 0.3, marginBottom: "0.8rem", fontFamily: "serif" }}>“</div>
        <p style={{ fontStyle: "italic", fontSize: "var(--text-sm)", color: 'var(--text)', lineHeight: 1.65, marginBottom: "1.8rem" }}>
          {quote}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `linear-gradient(135deg, var(--accent), var(--accent-strong))`,
          border: `1.5px solid rgba(201, 48, 44, 0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "#fff", fontSize: "var(--text-base)"
        }}>
          {author.charAt(0)}
        </div>
        <div>
          <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: 'var(--text)', margin: 0 }}>{author}</h4>
          <span style={{ fontSize: "var(--text-xs)", color: 'var(--muted)', display: "block", marginTop: 2 }}>{role}</span>
          <div style={{ color: 'var(--accent)', display: "flex", gap: 2, marginTop: 4 }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={14} fill={idx < stars ? "var(--accent)" : "transparent"} color={"var(--accent)"} />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// 10. Carrousel Témoignages
function TestimonialCarousel() {
  useLang();
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
              background: active === i ? "var(--accent)" : "var(--border)",
              cursor: "pointer",
              transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── LOGO ────────────────────────────────────────────────────────────────────
const Logo = ({ onClick, size="md" }) => {
  const h = size === "sm" ? 64 : 88;
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ cursor:"pointer", userSelect:"none", display:"flex", alignItems:"center" }}
    >
      <img src="/logo.png" alt="Easy China" style={{ height: h, width: "auto", objectFit: "contain", display: "block" }} />
    </motion.div>
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
          border: `1px solid ${open ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, padding: "0.4rem 0.85rem",
          fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
          color: open ? "var(--accent)" : "var(--muted)", transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
          fontFamily: "var(--font-body)",
        }}
      >
        <span style={{ fontSize: "var(--text-base)" }}>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown size={13} style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "#fff", border: `1px solid var(--border)`,
          borderRadius: "var(--radius-md)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
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
                fontSize: "var(--text-sm)", fontWeight: lang === l.code ? 700 : 500,
                color: lang === l.code ? "var(--accent)" : "var(--text)",
                fontFamily: "var(--font-body)", transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "var(--text-md)" }}>{l.flag}</span>
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
        background: `linear-gradient(to right, var(--accent), var(--accent-strong))`,
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
        background: isScrolled ? "rgba(253,252,248,0.97)" : "rgba(253,252,248,0.92)",
        backdropFilter: "blur(20px)",
        border: isScrolled ? `1px solid var(--border)` : `1px solid rgba(230,223,210,0.5)`,
        borderRadius: isScrolled ? "var(--radius-lg)" : 0,
        height: 68,
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: isScrolled
          ? "0 6px 28px rgba(26,20,16,0.1), 0 1px 4px rgba(26,20,16,0.06)"
          : "0 1px 0 rgba(26,20,16,0.06)",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s cubic-bezier(0.16,1,0.3,1)",
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
          {isOpen ? <X size={24} color={"var(--text)"}/> : <Menu size={24} color={"var(--text)"}/>}
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
                background: "none", border: "none", fontSize: "var(--text-lg)",
                fontWeight: 700, color: activePage === k ? "var(--accent)" : "var(--text)",
                cursor: "pointer", transition: "color 0.15s, background 0.15s, transform 0.15s",
                letterSpacing: "0.06em", fontFamily: "var(--font-display)"
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
        background: active ? "var(--accent-soft)" : hov ? "rgba(26,20,16,0.04)" : "none",
        border: "none",
        color: active ? "var(--accent)" : hov ? "var(--text)" : "var(--muted)",
        cursor: "pointer",
        padding: "0.5rem 1rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        fontFamily: "var(--font-body)",
        transition: "color 0.15s, background 0.15s",
        position: "relative",
        minHeight: 44,
        minWidth: 44,
      }}
    >
      {label}
      {/* Underline — scaleX draw, GPU-composited */}
      <span style={{
        position: "absolute",
        bottom: 6,
        left: "10%",
        width: "80%",
        height: 2,
        background: "var(--accent)",
        borderRadius: 2,
        transform: active || hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 0.18s ease",
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
        color: 'var(--accent)',
        border: `1px solid rgba(201, 48, 44, ${hov ? 0.35 : 0.18})`,
        padding: "0.45rem 1rem",
        borderRadius: 20,
        fontSize: "var(--text-xs)",
        fontWeight: 600,
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
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
        background: hov ? "rgba(201, 48, 44, 0.07)" : "var(--surface-alt)",
        border: `1px solid ${hov ? "var(--accent)" : "var(--border)"}`,
        padding: "0.45rem 1.25rem",
        borderRadius: 30,
        fontSize: "var(--text-sm)",
        fontWeight: 600,
        color: hov ? "var(--accent)" : "var(--text)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 4px 15px rgba(201,48,44,0.1)" : "none",
        transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
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
    border: `1.5px solid ${foc ? "var(--accent)" : "var(--border)"}`,
    borderRadius: 10,
    fontSize: "var(--text-sm)",
    background: foc ? "#fff" : "var(--surface-alt)",
    color: 'var(--text)',
    fontFamily: "var(--font-body)",
    outline: "none",
    boxShadow: foc ? `0 0 0 3px rgba(201, 48, 44, 0.1)` : "none",
    transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ marginBottom: "1.4rem", textAlign: "left" }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: "var(--text-sm)",
          color: 'var(--accent)',
          marginBottom: 6,
          fontWeight: 600,
          letterSpacing: "0.03em"
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
            <option key={o} value={o} style={{ background: "#fff", color: 'var(--text)' }}>
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
  const lang = useLang();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey + lang}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// 🔍 COMPOSANT SEOHEAD DYNAMIQUE ────────────────────────────────────────────────
const SEO_PAGES = {
  accueil: {
    title: "Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone",
    desc: "Easy China : votre agence de référence entre l'Afrique et la Chine. Import direct Guangzhou & Yiwu, inscription université chinoise avec bourses, visa Chine rapide, formation professionnelle, tourisme & affaires. Présents dans 15 pays africains.",
    keywords: "import chine afrique, importation guangzhou afrique, université chine inscription, bourse études chine afrique, visa chine afrique, tourisme voyage chine, voyage affaires chine, formation professionnelle chine, sourcing guangzhou yiwu, easy china lomé, transitaire chine afrique, logistique chine afrique, dédouanement afrique ouest, marché yiwu achat, agent import chine, import chine togo bénin côte d'ivoire sénégal cameroun",
    url: "https://easychina.online/",
  },
  catalogue: {
    title: "Catalogue Import Direct Chine – Machines, Textile, Électronique | Easy China Afrique",
    desc: "Importez directement depuis la Chine au meilleur prix : machines industrielles pressing & blanchisserie, électronique LED, textile soie & lin, équipements solaires, agroalimentaires. Sourcing Guangzhou et Yiwu livré en Afrique.",
    keywords: "catalogue import chine, machines pressing chine, blanchisserie industrielle chine, électronique LED chine afrique, textile soie lin import, machines industrielles afrique, sourcing guangzhou, yiwu marché achat, importateur afrique chine, fournisseur chine direct, prix usine chine",
    url: "https://easychina.online/#catalogue",
  },
  realisations: {
    title: "Réalisations & Témoignages Clients – Easy China | Import, Études, Visa Afrique",
    desc: "Nos succès en images : conteneurs importés depuis Guangzhou livrés en Afrique, étudiants boursiers dans les meilleures universités chinoises, ouvertures de blanchisseries professionnelles, visas obtenus en 10 jours. Témoignages clients Easy China.",
    keywords: "témoignages easy china, réalisations import chine afrique, bourses université chine avis, blanchisserie chine formation, visa chine 10 jours, client easy china afrique, importation réussie chine afrique",
    url: "https://easychina.online/#realisations",
  },
  equipe: {
    title: "Notre Équipe d'Experts Chine-Afrique | Easy China – Lomé & Guangzhou",
    desc: "Rencontrez l'équipe Easy China : directeur général basé à Guangzhou, responsable académique ancienne boursière Wuhan, expert logistique transit maritime. Votre pont humain entre l'Afrique et la Chine.",
    keywords: "équipe easy china, expert import chine afrique, agent universitaire chine afrique, transitaire maritime afrique chine, contact easy china, bureau lomé guangzhou",
    url: "https://easychina.online/#equipe",
  },
};

function SEOHead({ page }) {
  useEffect(() => {
    const seo = SEO_PAGES[page] || SEO_PAGES.accueil;
    const SITE = "https://easychina.online";
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
    setMeta("og:image:alt", "Easy China – Agence Chine-Afrique", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.desc);
    setMeta("twitter:image", OG_IMG);
    setMeta("twitter:image:alt", "Easy China – Agence Chine-Afrique");

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
          "telephone": "+8619876105148",
          "email": "services@easychina.online",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Quartier Hédzranawoé",
            "addressLocality": "Lomé",
            "addressCountry": "TG"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": 6.1375, "longitude": 1.2123 },
          "areaServed": [
            { "@type": "Country", "name": "Togo" },
            { "@type": "Country", "name": "Bénin" },
            { "@type": "Country", "name": "Côte d'Ivoire" },
            { "@type": "Country", "name": "Sénégal" },
            { "@type": "Country", "name": "Cameroun" },
            { "@type": "Country", "name": "Gabon" },
            { "@type": "Country", "name": "Congo" },
            { "@type": "Country", "name": "Mali" },
            { "@type": "Country", "name": "Burkina Faso" },
            { "@type": "Country", "name": "Chine" },
            { "@type": "Country", "name": "La Réunion" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services Easy China",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Import & Logistique depuis la Chine", "description": "Sourcing produits en Chine, inspection qualité usine, transport maritime, dédouanement en Afrique de l'Ouest." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Inscription Université Chinoise & Bourses", "description": "Admission dans les universités chinoises, dossier bourse gouvernementale, accompagnement complet." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Visa Chine", "description": "Obtention visa Chine touristique, affaires, études et travail depuis l'Afrique francophone." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formation Professionnelle en Chine", "description": "Formations techniques en Chine : pressing, blanchisserie industrielle, maintenance machines." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tourisme & Voyage d'Affaires en Chine", "description": "Organisation de voyages d'affaires à Guangzhou et Yiwu, visites d'usines, circuits touristiques." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Traduction & Interprétariat", "description": "Interprétariat en usine et en affaires, traduction de contrats, accompagnement culturel en Chine." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Consulting Business & Investissement", "description": "Étude de marché en Chine, création de société, mise en conformité légale, analyse d'investissement." } }
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

// 1. Section Hero — Split Layout
function HeroSection({ goTo }) {
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
      {/* Left — Text Content */}
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
          <GoldenBtn variant="solid" onClick={() => goTo("catalogue")}>
            <Package size={16}/> {t("hero_cta1")}
          </GoldenBtn>
          <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite obtenir des informations sur vos services."))}>
            <MessageCircle size={16}/> {t("hero_cta2")}
          </GoldenBtn>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.58, duration: 0.6 }}
          style={{
            display: "flex",
            gap: "var(--space-12)",
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--border)",
            flexWrap: "wrap",
          }}
        >
          {heroStats.map((s, i) => (
            <div key={i}>
              <div style={{
                fontSize: "var(--text-xl)",
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
                marginTop: "var(--space-1)",
              }}>
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — Image Panel */}
      <div className="hero-image-panel" style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
        <Img
          src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1200&h=1400&q=80"
          alt="Shanghai skyline"
          style={{ borderRadius: 0, height: "100%", width: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(253,252,248,0.12) 0%, rgba(0,0,0,0.18) 100%)",
          zIndex: 1,
        }} />
      </div>
    </div>
  );
}

// 2. Page d'Accueil Principale
function PageAccueil({ goTo }) {
  useLang();
  const services = [
    { icon: <Ship size={22}/>,         cat: "Import",    title: t("svc1_name"), text: t("svc1_desc"), cta: "Démarrer un import",      msg: "Bonjour Easy China, je souhaite démarrer un import depuis la Chine." },
    { icon: <GraduationCap size={22}/>, cat: "Études",   title: t("svc2_name"), text: t("svc2_desc"), cta: "Explorer les formations",  msg: "Bonjour Easy China, je souhaite des informations sur les études en Chine." },
    { icon: <Wrench size={22}/>,        cat: "Formation", title: t("svc3_name"), text: t("svc3_desc"), cta: "Voir le programme",        msg: "Bonjour Easy China, je souhaite des informations sur la formation professionnelle." },
    { icon: <FileCheck size={22}/>,     cat: "Visa",      title: t("svc4_name"), text: t("svc4_desc"), cta: "Commencer ma demande",     msg: "Bonjour Easy China, je souhaite des informations sur la procédure de visa." },
  ];

  const historyItems = [
    { year: "2017", title: "Fondation d'Easy China", desc: "Création de l'agence à Lomé, Togo avec pour mission de simplifier la liaison commerciale et académique entre l'Afrique de l'Ouest et la Chine." },
    { year: "2019", title: "Ouverture du Bureau en Chine", desc: "Établissement de nos bureaux permanents à Guangzhou et Yiwu pour assurer une inspection qualité physique en usine et un accompagnement local des étudiants." },
    { year: "2021", title: "Expansion de l'Offre Universitaire", desc: "Signature de partenariats exclusifs avec plus de 30 grandes universités chinoises, garantissant l'accès à des bourses gouvernementales d'excellence." },
    { year: "2024", title: "Digitalisation & Transitaire", desc: "Lancement de notre service de suivi logistique automatisé et renforcement de notre flotte transitaire maritime pour des imports 100% sécurisés." }
  ];

  const officesList = [
    { flag: "🇹🇬", title: "Easy China Lomé", query: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Quartier Hédzranawoé, Lomé, Togo", "services@easychina.online", "+86 198 7610 5148"] },
    { flag: "🇨🇳", title: "Guangzhou Permanent", query: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Guangzhou CBD & Yiwu City", "Sourcing direct, inspection logistique", "Présence physique permanente"] }
  ];

  return (
    <div>
      <HeroSection goTo={goTo} />

      <PaysCouverts />

      {/* Services Grid */}
      <div style={{ padding: "var(--space-section) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <SectionTitle eyebrow={t("svc_eyebrow")} title={t("svc_title")} subtitle={t("svc_subtitle")} />
          <div className="grid-3">
            {services.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08}>
                <GlassCard tilt style={{ height: "100%", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                  {/* Photo */}
                  <div className="zoom-container" style={{ height: 200, position: "relative" }}>
                    <Img src={UNSPLASH_REAL[s.cat] || UNSPLASH[s.cat]} alt={s.title} style={{ borderRadius: 0, height: "100%" }} className="zoom-img" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45))" }} />
                  </div>
                  {/* Body */}
                  <div style={{ padding: "var(--space-8)", flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-sm)",
                      background: "var(--accent-soft)", color: "var(--accent)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{s.icon}</div>
                    <h3 style={{ fontSize: "var(--text-md)", color: "var(--text)", fontWeight: 700, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.65, flex: 1 }}>{s.text}</p>
                    <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))} style={{ width: "100%", marginTop: "auto" }}>
                      {s.cta} <ArrowRight size={14}/>
                    </GoldenBtn>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <ProcessusSection />

      <ServicesComplementaires />

      {/* Tourisme & Business Section */}
      <div style={{ background: 'var(--surface-alt)', borderTop: `1px solid var(--border)`, borderBottom: `1px solid var(--border)`, padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <div className="grid-50-50" style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "var(--text-xs)", color: 'var(--accent)', letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.8rem" }}>{t("tour_eyebrow")}</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
                {t("tour_title")}
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: "1.2rem", fontSize: "var(--text-base)" }}>
                {t("tour_p1")}
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: "2rem", fontSize: "var(--text-base)" }}>
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
              <div style={{ height: 250, marginBottom: "2rem", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <Img src="https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=800&h=600&q=80" alt="guangzhou market" style={{ height: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {["🇨🇳 Guangzhou", "🇨🇳 Yiwu", "🇹🇬 Lomé", "🇨🇮 Abidjan", "🇸🇳 Dakar"].map(c => (
                  <CityPill key={c}>{c}</CityPill>
                ))}
              </div>
              <p style={{ color: 'var(--muted)', fontSize: "var(--text-sm)", marginTop: "1.5rem", fontStyle: "italic" }}>
                {t("tour_note")}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("hist_eyebrow")} title={t("hist_title")} subtitle={t("hist_subtitle")} />
        <Timeline items={historyItems} />
      </div>

      <SecteursSection />

      {/* Testimonials Section */}
      <div style={{ background: 'var(--surface-alt)', borderTop: `1px solid var(--border)`, borderBottom: `1px solid var(--border)`, padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("test_eyebrow")} title={t("test_title")} subtitle={t("test_subtitle")} />
        <TestimonialCarousel />
      </div>

      <PremiumServices />

      {/* Bureaux Section */}
      <div style={{ padding: "var(--space-section) var(--gutter)", maxWidth: "var(--container)", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("off_eyebrow")} title={t("off_title")} />
        <div className="grid-3" style={{justifyContent: "center"}}>
          {officesList.map((b, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <GlassCard tilt={true} style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                <div style={{ height: 140 }}>
                  <Img src={b.query} alt={b.title} style={{ borderRadius: "0px", height: "100%" }} />
                </div>
                <div style={{ padding: "2rem", textAlign: "left" }}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: "1rem", fontSize: "var(--text-md)", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{b.flag}</span> {b.title}
                  </h3>
                  {b.lines.map((l, j) => (
                    <p key={j} style={{ fontSize: "var(--text-sm)", color: 'var(--muted)', lineHeight: 1.6, marginBottom: 4 }}>{l}</p>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div style={{
        background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 60%, #b71c1c 100%)`,
        padding: "var(--space-section) var(--gutter)",
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
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-display)", color: "#fff" }}>
              {t("cta_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "var(--text-base)", lineHeight: 1.75, marginBottom: "3rem" }}>
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
      <div style={{ padding: "var(--space-section) var(--gutter)", maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("faq_eyebrow")} title={t("faq_title")} subtitle={t("faq_subtitle")} />
        <FAQAccordion />
      </div>

      {/* Formulaire de Contact */}
      <div style={{ background: 'var(--surface-alt)', borderTop: `1px solid var(--border)`, padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <SectionTitle eyebrow={t("form_eyebrow")} title={t("form_title")} subtitle={t("form_subtitle")} />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

// ─── PAYS COUVERTS ────────────────────────────────────────────────────────────
const PAYS_AFRIQUE = [
  { flag:"🇹🇬", name:"Togo" },        { flag:"🇧🇯", name:"Bénin" },
  { flag:"🇨🇮", name:"Côte d'Ivoire" },{ flag:"🇸🇳", name:"Sénégal" },
  { flag:"🇨🇲", name:"Cameroun" },    { flag:"🇬🇦", name:"Gabon" },
  { flag:"🇨🇬", name:"Congo" },       { flag:"🇨🇩", name:"RD Congo" },
  { flag:"🇲🇱", name:"Mali" },        { flag:"🇧🇫", name:"Burkina Faso" },
  { flag:"🇳🇪", name:"Niger" },       { flag:"🇬🇳", name:"Guinée" },
  { flag:"🇲🇬", name:"Madagascar" },  { flag:"🇷🇪", name:"La Réunion" },
  { flag:"🇲🇦", name:"Maroc" },
];

function PaysCouverts() {
  useLang();
  return (
    <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <SectionTitle eyebrow={t("pays_eyebrow")} title={t("pays_title")} subtitle={t("pays_subtitle")} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", justifyContent: "center", maxWidth: "var(--container)", margin: "0 auto" }}>
        {PAYS_AFRIQUE.map((p) => (
          <div key={p.name} style={{
            display:"flex", alignItems:"center", gap:8,
            background:"#fff", border:`1px solid var(--border)`,
            borderRadius:40, padding:"0.55rem 1.2rem",
            boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
            fontSize:"0.82rem", fontWeight:600, color:"var(--text)",
            transition:"color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 6px 20px rgba(201,48,44,0.12)`; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)"; }}
          >
            <span style={{fontSize:"1.2rem"}}>{p.flag}</span>
            {p.name}
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,48,44,0.06)", border:`1px solid rgba(201,48,44,0.2)`, color:"var(--accent)", borderRadius:30, padding:"0.5rem 1.4rem", fontSize:"0.8rem", fontWeight:700 }}>
          <Globe size={14}/> +15 pays · Livraison porte-à-porte
        </div>
      </div>
    </div>
  );
}

// ─── PROCESSUS 4 ÉTAPES — Horizontal timeline ────────────────────────────────
function ProcessusSection() {
  useLang();
  const steps = [
    { num: "01", icon: <MessageCircle size={24}/>, title: t("proc1_title"), desc: t("proc1_desc") },
    { num: "02", icon: <Search size={24}/>,        title: t("proc2_title"), desc: t("proc2_desc") },
    { num: "03", icon: <Ship size={24}/>,          title: t("proc3_title"), desc: t("proc3_desc") },
    { num: "04", icon: <Package size={24}/>,       title: t("proc4_title"), desc: t("proc4_desc") },
  ];

  return (
    <div style={{ padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("proc_eyebrow")} title={t("proc_title")} subtitle={t("proc_subtitle")} />

        {/* Timeline track */}
        <div style={{ position: "relative" }}>
          {/* Connecting line */}
          <div className="processus-line" style={{
            position: "absolute",
            top: 36,
            left: "calc(12.5% + 36px)",
            right: "calc(12.5% + 36px)",
            height: 1,
            background: "var(--border)",
            zIndex: 0,
          }} />

          <div className="processus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
            {steps.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 var(--space-3)" }}>
                  {/* Circle */}
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "var(--surface)",
                    border: "2px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--accent)",
                    position: "relative", zIndex: 1,
                    marginBottom: "var(--space-6)",
                    boxShadow: "var(--shadow-sm)",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}>
                    {s.icon}
                    {/* Step badge */}
                    <div style={{
                      position: "absolute", top: -8, right: -8,
                      background: "var(--accent)", color: "#fff",
                      borderRadius: "var(--radius-full)",
                      width: 22, height: 22,
                      fontSize: "var(--text-xs)", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      letterSpacing: "0.03em",
                    }}>{s.num}</div>
                  </div>
                  <h3 style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "var(--space-2)",
                    lineHeight: 1.3,
                  }}>
                    {s.title}
                  </h3>
                  <p style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    maxWidth: "22ch",
                  }}>
                    {s.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTEURS D'ACTIVITÉ ──────────────────────────────────────────────────────
const SECTEURS = [
  { icon: <Leaf size={20}/>,             name: "Agriculture & Irrigation",   desc: "Pompes solaires, systèmes d'irrigation, équipements agricoles de haute précision." },
  { icon: <Zap size={20}/>,              name: "Énergie Solaire",             desc: "Panneaux photovoltaïques, onduleurs, batteries, systèmes off-grid pour l'Afrique." },
  { icon: <Hammer size={20}/>,           name: "Construction & BTP",          desc: "Matériaux de construction, outillage professionnel, équipements de chantier." },
  { icon: <Heart size={20}/>,            name: "Santé & Médical",             desc: "Équipements médicaux, matériel de laboratoire, consommables hospitaliers certifiés." },
  { icon: <Shirt size={20}/>,            name: "Mode & Textile",              desc: "Tissus, prêt-à-porter, accessoires de mode directement des ateliers de Guangzhou." },
  { icon: <Smartphone size={20}/>,       name: "Électronique & Tech",         desc: "Téléphones, ordinateurs, LED, composants électroniques à prix usine." },
  { icon: <UtensilsCrossed size={20}/>,  name: "Agroalimentaire",             desc: "Machines d'emballage, de conditionnement, de transformation alimentaire industrielle." },
  { icon: <Wind size={20}/>,             name: "Pressing & Blanchisserie",    desc: "Lignes complètes de lavage, séchage, repassage industriel et formation technique." },
];

function SecteursSection() {
  useLang();
  return (
    <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("sec_eyebrow")} title={t("sec_title")} subtitle={t("sec_subtitle")} centered={false} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-3)" }}>
          {SECTEURS.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={Math.floor(i / 2) * 0.08}>
              <div style={{
                display: "flex", gap: "var(--space-4)", alignItems: "flex-start",
                padding: "var(--space-6)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-sm)",
                  background: "var(--accent-soft)", color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>{s.icon}</div>
                <div>
                  <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)", marginBottom: "var(--space-1)", lineHeight: 1.3 }}>{s.name}</h4>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SERVICES PREMIUM ─────────────────────────────────────────────────────────
function PremiumServices() {
  useLang();
  const items = [
    { icon: <ShieldCheck size={24}/>, tag: t("prem1_tag"), title: t("prem1_title"), desc: t("prem1_desc") },
    { icon: <Award size={24}/>,       tag: t("prem2_tag"), title: t("prem2_title"), desc: t("prem2_desc") },
    { icon: <Globe size={24}/>,       tag: t("prem3_tag"), title: t("prem3_title"), desc: t("prem3_desc") },
    { icon: <Plane size={24}/>,       tag: t("prem4_tag"), title: t("prem4_title"), desc: t("prem4_desc") },
  ];

  return (
    <div style={{ padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("prem_eyebrow")} title={t("prem_title")} subtitle={t("prem_subtitle")} centered={false} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-6)" }}>
          {items.map((item, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.09}>
              <GlassCard tilt style={{ height: "100%" }}>
                {/* Category tag */}
                <div style={{
                  display: "inline-block",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                  padding: "0.2rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "var(--space-6)",
                }}>{item.tag}</div>

                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-sm)",
                  background: "var(--accent-soft)", color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "var(--space-4)",
                }}>{item.icon}</div>

                <h3 style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                  fontFamily: "var(--font-display)",
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.7, flex: 1 }}>
                  {item.desc}
                </p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
        <div style={{ marginTop: "var(--space-12)" }}>
          <GoldenBtn variant="solid" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour Easy China, je suis intéressé par vos services premium (DDP, Marque Privée, Visite d'usine)."))}>
            <TrendingUp size={16}/> Discuter de mes besoins spécifiques
          </GoldenBtn>
        </div>
      </div>
    </div>
  );
}

// ─── SERVICES COMPLÉMENTAIRES ─────────────────────────────────────────────────
function ServicesComplementaires() {
  useLang();
  const extras = [
    {
      icon: <MessageCircle size={22}/>,
      name: t("svc5_name"),
      desc: t("svc5_desc"),
      features: [t("svc5_f1"), t("svc5_f2"), t("svc5_f3"), t("svc5_f4")],
      cta: "Suivre ma commande",
      msg: "Bonjour Easy China, je souhaite des informations sur votre service de messagerie et suivi.",
    },
    {
      icon: <Ship size={22}/>,
      name: t("svc6_name"),
      desc: t("svc6_desc"),
      features: [t("svc6_f1"), t("svc6_f2"), t("svc6_f3"), t("svc6_f4")],
      cta: "Demander un devis fret",
      msg: "Bonjour Easy China, je souhaite un devis pour le transit maritime depuis la Chine.",
    },
    {
      icon: <FileCheck size={22}/>,
      name: t("svc7_name"),
      desc: t("svc7_desc"),
      features: [t("svc7_f1"), t("svc7_f2"), t("svc7_f3"), t("svc7_f4")],
      cta: "Commencer ma demande de visa",
      msg: "Bonjour Easy China, je souhaite des informations sur les visas et démarches administratives.",
    },
    {
      icon: <GraduationCap size={22}/>,
      name: t("svc8_name"),
      desc: t("svc8_desc"),
      features: [t("svc8_f1"), t("svc8_f2"), t("svc8_f3"), t("svc8_f4")],
      cta: "Explorer les universités",
      msg: "Bonjour Easy China, je souhaite des informations sur l'inscription dans les universités chinoises.",
    },
  ];

  return (
    <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <SectionTitle eyebrow={t("svc_extra_eyebrow")} title={t("svc_extra_title")} subtitle={t("svc_extra_subtitle")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-6)" }}>
          {extras.map((s, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.08}>
              <GlassCard tilt style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-sm)",
                  background: "var(--accent-soft)", color: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "var(--space-4)",
                }}>{s.icon}</div>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)", marginBottom: "var(--space-2)", fontFamily: "var(--font-display)" }}>{s.name}</h3>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--muted)", lineHeight: 1.65, marginBottom: "var(--space-4)", flex: 1 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 var(--space-6)" }}>
                  {s.features.map((f, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "var(--text-xs)", color: "var(--muted)", marginBottom: "var(--space-2)" }}>
                      <CheckCircle size={13} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))} style={{ width: "100%" }}>
                  {s.cta}
                </GoldenBtn>
              </GlassCard>
            </ScrollReveal>
          ))}
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
            border: `1px solid ${open === i ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            background: "#fff",
            boxShadow: open === i ? "0 4px 20px rgba(201,48,44,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
          }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "1.3rem 1.8rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "var(--text-base)", color: 'var(--text)', paddingRight: "1rem", lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: open === i ? `linear-gradient(135deg, var(--accent), var(--accent-strong))` : "var(--surface-alt)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
              }}>
                <ChevronDown size={16}
                  color={open === i ? "#fff" : "var(--muted)"}
                  style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
                />
              </span>
            </button>
            {open === i && (
              <div style={{ padding: "0 1.8rem 1.4rem", animation: "pageEnter 0.25s ease" }}>
                <p style={{ color: 'var(--muted)', fontSize: "var(--text-sm)", lineHeight: 1.75, borderTop: `1px solid var(--border)`, paddingTop: "1rem" }}>
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
    <GlassCard style={{ padding: "2.5rem", width: "100%", border: `1.5px solid var(--border)` }}>
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
    <div style={{ padding: "var(--space-section) var(--gutter)", maxWidth: "var(--container)", margin: "0 auto" }}>
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
          <ScrollReveal key={a.id} direction="up" delay={i * 0.05}>
            <GlassCard style={{ height: "100%", padding: 0, overflow: "hidden" }}>
              <div className="zoom-container" style={{ height: 200, position: "relative" }}>
                <MediaDisplay
                  src={a.image}
                  fallback={UNSPLASH[a.cat] || UNSPLASH["Autre"]}
                  alt={a.titre}
                  style={{ height: "100%", borderRadius: "0px" }}
                />
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: `linear-gradient(135deg, var(--accent), var(--accent-strong))`,
                  color: "var(--bg)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
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
                  border: `1.5px solid var(--accent)`,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: 'var(--accent)'
                }}>
                  <Package size={18}/>
                </div>
              </div>

              <div style={{ padding: "1.8rem", display: "flex", flexDirection: "column", height: "calc(100% - 200px)", justifyContent: "space-between" }}>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: 'var(--text)', marginBottom: "0.5rem" }}>
                    {a.titre}
                  </h3>
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: "var(--text-base)", marginBottom: "0.8rem" }}>
                    {a.prix}
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: 'var(--muted)', lineHeight: 1.5, marginBottom: "1.8rem" }}>
                    {a.desc}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <GoldenBtn
                    variant="solid"
                    onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite passer commande pour le produit "${a.titre}" au prix de "${a.prix}".`))}
                    style={{ width: "100%" }}
                  >
                    <Package size={18} style={{marginRight: 8}}/> Commander
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
    <div style={{ padding: "var(--space-section) var(--gutter)", maxWidth: "var(--container)", margin: "0 auto" }}>
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
                      <MediaDisplay
                        src={r.image}
                        fallback={UNSPLASH_REAL[r.cat] || UNSPLASH_REAL["Tourisme"]}
                        alt={r.titre}
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
                          color: 'var(--accent)',
                          fontSize: "var(--text-xs)",
                          fontWeight: 700,
                          padding: "0.25rem 0.75rem",
                          borderRadius: 20,
                          textTransform: "uppercase",
                          letterSpacing: "0.03em"
                        }}>
                          {r.cat}
                        </span>
                        <span style={{ color: 'var(--accent)' }}>
                          {r.cat === "Import" ? <Ship size={20}/> :
                           r.cat === "Études" ? <GraduationCap size={20}/> :
                           r.cat === "Formation" ? <Wrench size={20}/> :
                           <FileCheck size={20}/>}
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: isLarge ? "1.3rem" : "1.05rem",
                        fontWeight: 700,
                        color: 'var(--text)',
                        lineHeight: 1.25,
                        marginBottom: "0.6rem",
                        fontFamily: "var(--font-display)",
                        textAlign: "left"
                      }}>
                        {r.titre}
                      </h3>
                      <p style={{ fontSize: "var(--text-sm)", color: 'var(--muted)', lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "left" }}>
                        {r.desc}
                      </p>
                    </div>

                    {/* Testimonial Quote inside Bento Box */}
                    {r.temoignage && (
                      <div style={{
                        borderTop: `1px solid var(--border)`,
                        paddingTop: "1.2rem",
                        marginTop: "1rem"
                      }}>
                        <div style={{ color: 'var(--accent)', fontSize: "1.8rem", height: 16, lineHeight: 0.1, fontFamily: "serif", opacity: 0.3, marginBottom: "0.4rem", textAlign: "left" }}>“</div>
                        <p style={{ fontStyle: "italic", fontSize: "var(--text-sm)", color: 'var(--text)', lineHeight: 1.5, marginBottom: "0.8rem", textAlign: "left" }}>
                          {r.temoignage}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: 'var(--accent)' }}>{r.client}</span>
                          <span style={{ color: 'var(--accent)', display: "flex", gap: 1 }}>
                            {Array.from({ length: Number(r.stars || 5) }).map((_, stIdx) => (
                              <Star key={stIdx} size={11} fill={"var(--accent)"} color={"var(--accent)"} />
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
    <div style={{ padding: "var(--space-section) var(--gutter)" }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 60%, #b71c1c 100%)`,
        borderRadius: "var(--radius-md)",
        padding: "4rem 3rem",
        textAlign: "center",
        marginBottom: "5rem",
        position: "relative",
        overflow: "hidden",
        maxWidth: "var(--container)",
        margin: "0 auto 5rem",
      }}>
        <div style={{ position: "absolute", left: "-5%", top: "-40%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-40%", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 20, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
            {t("eq_eyebrow")}
            <span style={{ display: "inline-block", width: 20, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)", marginBottom: "1rem" }}>
            {t("eq_title")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "var(--text-base)", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            {t("eq_subtitle")}
          </p>
        </ScrollReveal>
      </div>

      {/* Team Cards */}
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
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
                      <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "#fff", marginBottom: 2, fontFamily: "var(--font-display)" }}>{member.nom}</h3>
                      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "var(--text-xs)", fontWeight: 600 }}>{member.poste}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.8rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "var(--text-sm)", color: 'var(--muted)', lineHeight: 1.7, marginBottom: "1.2rem" }}>{member.bio}</p>

                      {specs.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
                          {specs.map((s, j) => (
                            <span key={j} style={{
                              background: "rgba(201,48,44,0.06)",
                              border: "1px solid rgba(201,48,44,0.18)",
                              color: 'var(--accent)',
                              padding: "0.3rem 0.75rem",
                              borderRadius: 20,
                              fontSize: "var(--text-xs)",
                              fontWeight: 600,
                            }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div style={{ borderTop: `1px solid var(--border)`, paddingTop: "1.2rem", display: "flex", flexDirection: "column", gap: 10 }}>
                      {member.contact && (
                        <a href={`tel:${member.contact.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 10, color: 'var(--muted)', fontSize: "var(--text-sm)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
                          <span style={{ width: 30, height: 30, background: "rgba(201,48,44,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Phone size={13} color={"var(--accent)"} />
                          </span>
                          {member.contact}
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ display: "flex", alignItems: "center", gap: 10, color: 'var(--muted)', fontSize: "var(--text-sm)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
                          <span style={{ width: 30, height: 30, background: "rgba(201,48,44,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Mail size={13} color={"var(--accent)"} />
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
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: 'var(--muted)' }}>
            <Users size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>L'équipe n'a pas encore été renseignée.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPOSANT IMAGEUPLOAD EN BASE64 ──────────────────────────────────────────
const MediaUpload = ({ value, onChange, label = "Photo / Vidéo" }) => {
  const ref = useRef();
  const [preview, setPreview] = useState(value || "");
  const [objectUrl, setObjectUrl] = useState("");   // local blob URL for immediate preview
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const type = getMediaType(objectUrl || preview);

  const handleFile = async (file) => {
    if (!file) return;
    setUploadErr("");
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    const maxBytes = isVideo ? 50 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadErr(`Fichier trop lourd (max ${isVideo ? "50" : "8"}MB)`);
      return;
    }

    // Immediate local preview via object URL
    const blob = URL.createObjectURL(file);
    setObjectUrl(blob);

    if (GH_TOKEN) {
      setUploading(true);
      const ghUrl = await ghUploadMedia(file);
      setUploading(false);
      if (ghUrl) {
        setPreview(ghUrl);
        onChange(ghUrl);
      } else {
        setUploadErr("Erreur d'upload GitHub. Vérifiez le token dans Vercel.");
        setObjectUrl("");
      }
    } else if (isImage) {
      // Fallback: base64 for images only when no token
      const reader = new FileReader();
      reader.onload = e => { setPreview(e.target.result); onChange(e.target.result); };
      reader.readAsDataURL(file);
    } else {
      setUploadErr("Pour les vidéos et fichiers, configurez VITE_GITHUB_TOKEN dans Vercel → Settings → Environment Variables.");
      setObjectUrl("");
    }
  };

  const clear = (e) => {
    e.stopPropagation();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(""); setPreview(""); onChange(""); setUploadErr("");
  };

  const displaySrc = objectUrl || preview;

  return (
    <div style={{ marginBottom: "1.1rem", textAlign: "left" }}>
      <label style={{ fontSize: ".78rem", color: 'var(--accent)', fontWeight: 600, display: "block", marginBottom: 6 }}>
        {label}
      </label>
      <div
        onClick={() => !uploading && ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${drag ? "var(--accent)" : uploadErr ? "#e53935" : "var(--border)"}`,
          borderRadius: 12, padding: "1rem", textAlign: "center",
          cursor: uploading ? "wait" : "pointer",
          background: drag ? "rgba(201,48,44,0.05)" : "var(--surface-alt)",
          transition: "color 0.15s, background 0.15s, transform 0.15s", position: "relative", minHeight: 120,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 8,
        }}
      >
        {uploading ? (
          <>
            <div style={{ width: 30, height: 30, border: `3px solid var(--border)`, borderTop: `3px solid var(--accent)`, borderRadius: "50%", animation: "spin .75s linear infinite" }} />
            <p style={{ fontSize: ".8rem", color: 'var(--muted)', margin: 0 }}>Upload GitHub en cours…</p>
          </>
        ) : displaySrc ? (
          <>
            {type === "video" ? (
              <video src={displaySrc} controls style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8 }} preload="metadata" />
            ) : type === "doc" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <FileText size={32} color={"var(--accent)"} />
                <a href={displaySrc} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: ".78rem", color: 'var(--accent)' }}>Ouvrir le fichier</a>
              </div>
            ) : (
              <img src={displaySrc} alt="preview" style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }} />
            )}
            {uploading === false && objectUrl && (
              <p style={{ fontSize: ".65rem", color: 'var(--secondary)', margin: 0 }}>
                ✓ Déployé sur GitHub — visible après le prochain redéploiement Vercel (~2 min)
              </p>
            )}
            <button type="button" onClick={clear}
              style={{ position: "absolute", top: 8, right: 8, background: "#e53935", border: "none", borderRadius: 6, color: "#fff", padding: "2px 8px", cursor: "pointer", fontSize: ".72rem", display: "flex", alignItems: "center", gap: 3 }}>
              <X size={11} /> Supprimer
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
              <Image size={22} color={"var(--accent)"} opacity={0.7} />
              <Film size={22} color={"var(--accent)"} opacity={0.7} />
              <FileText size={22} color={"var(--accent)"} opacity={0.7} />
            </div>
            <p style={{ fontSize: ".8rem", color: "#aaa", margin: 0 }}>
              Glisse un fichier ici ou <span style={{ color: 'var(--accent)', fontWeight: 600 }}>clique pour choisir</span>
            </p>
            <p style={{ fontSize: ".7rem", color: "#bbb", margin: 0 }}>
              Images · Vidéos MP4/MOV/WEBM · PDF · Tous formats
            </p>
            <p style={{ fontSize: ".65rem", color: "#ccc", margin: 0 }}>Photos max 8MB · Vidéos max 50MB</p>
          </>
        )}
        {uploadErr && (
          <p style={{ fontSize: ".72rem", color: "#e53935", margin: 0, textAlign: "center", padding: "0 8px" }}>{uploadErr}</p>
        )}
        <input ref={ref} type="file" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
      </div>
      <input
        type="text"
        value={preview.startsWith("data:") ? "" : preview}
        onChange={e => { setObjectUrl(""); setPreview(e.target.value); onChange(e.target.value); }}
        placeholder="Ou colle une URL (image, vidéo YouTube, lien…)"
        style={{ width: "100%", marginTop: 8, padding: ".6rem .9rem", border: `1.5px solid var(--border)`, borderRadius: 8, fontSize: ".8rem", fontFamily: "inherit", outline: "none", background: 'var(--surface-alt)', color: 'var(--text)' }}
      />
    </div>
  );
};

// ─── PAGE ADMIN ──────────────────────────────────────────────────────────────
function PageAdmin({ articles, setArticles, realisations, setRealisations, equipe, setEquipe, deployStatus }) {
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

  // Dashboard shell state
  const [activeTab, setActiveTab] = useState("catalogue");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

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
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    if (artImage && !artImage.startsWith("https://") && !artImage.startsWith("data:")) {
      showToast("L'URL de l'image doit commencer par https:// ou être une photo importée.", "error");
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
    showToast("Produit sauvegardé");
  };

  const handleEditArticle = (art) => {
    setArtNom(art.titre);
    setArtPrix(art.prix);
    setArtDesc(art.desc);
    setArtCat(art.cat);
    setArtImage(art.image || "");
    setEditingArtId(art.id);
  };

  const handleDeleteArticle = (art) => {
    setDeleteModal({ type: "article", id: art.id, label: art.titre });
  };

  // CRUD Realisations Actions
  const handleSaveRealisation = () => {
    if (!realNom || !realDesc) {
      showToast("Veuillez remplir les champs obligatoires.", "error");
      return;
    }

    if (realImage && !realImage.startsWith("https://") && !realImage.startsWith("data:")) {
      showToast("L'URL de l'image doit commencer par https:// ou être une photo importée.", "error");
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
    showToast("Réalisation sauvegardée");
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

  const handleDeleteRealisation = (real) => {
    setDeleteModal({ type: "realisation", id: real.id, label: real.titre });
  };

  const confirmDelete = useCallback(() => {
    if (!deleteModal) return;
    const { type, id } = deleteModal;
    if (type === "article") {
      setArticles(prev => prev.filter(a => a.id !== id));
      if (editingArtId === id) { setEditingArtId(null); setArtNom(""); setArtPrix(""); setArtDesc(""); setArtImage(""); }
    } else if (type === "realisation") {
      setRealisations(prev => prev.filter(r => r.id !== id));
      if (editingRealId === id) {
        setEditingRealId(null);
        setRealNom(""); setRealDesc(""); setRealClient(""); setRealTemoignage(""); setRealImage("");
      }
    } else if (type === "membre") {
      setEquipe(prev => prev.filter(m => m.id !== id));
      if (editingMemId === id) resetMemForm();
    }
    setDeleteModal(null);
    showToast("Supprimé avec succès");
  }, [deleteModal, editingArtId, editingRealId, editingMemId, showToast]);

  // CRUD Équipe Actions
  const resetMemForm = () => {
    setEditingMemId(null);
    setMemNom(""); setMemPoste(""); setMemBio("");
    setMemContact(""); setMemEmail(""); setMemSpecialites(""); setMemImage("");
  };

  const handleSaveMembre = () => {
    if (!memNom || !memPoste) {
      showToast("Le nom et le poste sont obligatoires.", "error");
      return;
    }
    if (memImage && !memImage.startsWith("https://") && !memImage.startsWith("data:")) {
      showToast("L'URL de l'image doit commencer par https:// ou être une photo importée.", "error");
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
    showToast("Membre sauvegardé");
  };

  const handleEditMembre = (m) => {
    setMemNom(m.nom); setMemPoste(m.poste); setMemBio(m.bio || "");
    setMemContact(m.contact || ""); setMemEmail(m.email || "");
    setMemSpecialites(m.specialites || ""); setMemImage(m.image || "");
    setEditingMemId(m.id);
  };

  const handleDeleteMembre = (membre) => {
    setDeleteModal({ type: "membre", id: membre.id, label: membre.nom });
  };

  if (!isAuthenticated) {
    const isLocked = lockoutTime > Date.now();
    return (
      <div style={{ padding: "10rem 2rem 8rem", display: "flex", justifyContent: "center" }}>
        <GlassCard style={{ maxWidth: 450, width: "100%", padding: "3rem 2.5rem", border: `1.5px solid var(--accent)` }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "rgba(201,48,44,0.1)",
              border: `1px solid var(--border)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem", color: 'var(--accent)'
            }}>
              <Lock size={26}/>
            </div>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginTop: "1rem", fontFamily: "var(--font-display)" }}>
              Accès Administration
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: "var(--text-sm)", marginTop: "0.5rem" }}>
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
              <p style={{ color: 'var(--danger)', fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "1rem", textAlign: "left" }}>
                ⚠️ {errorMsg}
              </p>
            )}
            {isLocked && (
              <p style={{ color: 'var(--danger)', fontSize: "var(--text-sm)", fontWeight: 700, marginBottom: "1rem", textAlign: "left" }}>
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
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", position: "relative" }}>
      <style>{`
        .adm-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0; width: 210px;
          background: var(--surface); border-right: 1px solid var(--border);
          display: flex; flex-direction: column; z-index: 50;
        }
        .adm-main { margin-left: 210px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
        .adm-tab-strip { display: none; }
        @media (max-width: 767px) {
          .adm-sidebar { display: none; }
          .adm-main { margin-left: 0; }
          .adm-tab-strip {
            display: flex; border-bottom: 1px solid var(--border);
            background: var(--surface); overflow-x: auto; flex-shrink: 0;
          }
        }
        .adm-nav-btn {
          display: flex; align-items: center; gap: 10px;
          padding: .65rem 1.1rem; border: none; background: transparent;
          cursor: pointer; color: var(--muted); font-size: var(--text-sm);
          font-weight: 600; border-radius: 8px; width: 100%; text-align: left;
          transition: background .15s, color .15s;
        }
        .adm-nav-btn:hover { background: var(--surface-alt); color: var(--text); }
        .adm-nav-btn.active { background: rgba(201,48,44,.12); color: var(--accent); }
        .adm-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.8rem; }
        .adm-split { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        @media (max-width: 900px) { .adm-split { grid-template-columns: 1fr; } }
        .adm-list-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .85rem 1rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); }
        .adm-icon-btn { border: none; border-radius: 6px; padding: .38rem .55rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: opacity .15s; }
        .adm-icon-btn:hover { opacity: .72; }
        .adm-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .adm-modal { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 2rem; max-width: 420px; width: 100%; }
        .adm-toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 300; padding: .85rem 1.4rem; border-radius: 10px; font-size: var(--text-sm); font-weight: 600; box-shadow: 0 4px 24px rgba(0,0,0,.2); display: flex; align-items: center; gap: 8px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar">
        <div style={{ padding: "1.3rem 1.1rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldCheck size={15} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text)", lineHeight: 1.1 }}>Easy China</div>
              <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: 2 }}>Administration</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: ".9rem .65rem", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { id: "catalogue",    icon: <Package size={15}/>,       label: "Catalogue" },
            { id: "realisations", icon: <ClipboardList size={15}/>, label: "Réalisations" },
            { id: "equipe",       icon: <Users size={15}/>,         label: "Équipe" },
          ].map(({ id, icon, label }) => (
            <button key={id} className={`adm-nav-btn${activeTab === id ? " active" : ""}`}
              onClick={() => setActiveTab(id)}>
              {icon} {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: ".8rem .65rem 1.2rem", borderTop: "1px solid var(--border)" }}>
          <button className="adm-nav-btn" onClick={handleLogout} style={{ color: "var(--accent)" }}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="adm-main">
        {/* Top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: ".8rem 1.6rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ flex: 1, fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)" }}>
            {activeTab === "catalogue" ? "Catalogue" : activeTab === "realisations" ? "Réalisations" : "Équipe"}
          </div>
          {(() => {
            const pills = {
              saving:    { color: "#b45309", bg: "rgba(234,179,8,.12)",  label: "Envoi…" },
              deploying: { color: "#15803d", bg: "rgba(34,197,94,.12)",  label: "Déployé ✓" },
              error:     { color: "var(--accent)", bg: "rgba(201,48,44,.1)", label: "Erreur" },
            };
            const p = pills[deployStatus] || (GH_TOKEN
              ? { color: "#15803d", bg: "rgba(34,197,94,.1)", label: "Live" }
              : { color: "#b45309", bg: "rgba(234,179,8,.1)", label: "Local" });
            return <span style={{ fontSize: "11px", fontWeight: 700, color: p.color, background: p.bg, padding: "3px 11px", borderRadius: 20, flexShrink: 0 }}>{p.label}</span>;
          })()}
        </header>

        {/* Mobile tab strip — visible only on small screens */}
        <div className="adm-tab-strip" style={{ display: "none" }}>
          {[
            { id: "catalogue",    icon: <Package size={14}/>,       label: "Catalogue" },
            { id: "realisations", icon: <ClipboardList size={14}/>, label: "Réalisations" },
            { id: "equipe",       icon: <Users size={14}/>,         label: "Équipe" },
          ].map(({ id, icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: ".7rem .5rem", border: "none", cursor: "pointer",
              background: activeTab === id ? "rgba(201,48,44,.08)" : "transparent",
              borderBottom: activeTab === id ? "2.5px solid var(--accent)" : "2.5px solid transparent",
              color: activeTab === id ? "var(--accent)" : "var(--muted)",
              fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap",
            }}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main style={{ padding: "2rem", maxWidth: 1100, width: "100%", margin: "0 auto" }}>

          {/* ── CATALOGUE ── */}
          {activeTab === "catalogue" && (
            <div className="adm-split">
              <div className="adm-card">
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "1.4rem" }}>
                  {editingArtId ? "Modifier le Produit" : "Ajouter au Catalogue"}
                </h3>
                <Field label="Titre du Produit *" value={artNom} onChange={setArtNom} placeholder="Ex: Machine de Presse à Vapeur" />
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Prix *" value={artPrix} onChange={setArtPrix} placeholder="À partir de 1 200 USD" />
                  <Field label="Catégorie" value={artCat} onChange={setArtCat} options={["Machines", "Électronique", "Textile", "Import général", "Alimentaire", "Autre"]} />
                </div>
                <MediaUpload value={artImage} onChange={setArtImage} label="Photo / Vidéo du produit" />
                <Field label="Description & Spécifications *" value={artDesc} onChange={setArtDesc} placeholder="Détails, capacité, dimensions..." rows={3} />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <GoldenBtn variant="solid" onClick={handleSaveArticle} style={{ flex: 1 }}>
                    {editingArtId ? "Enregistrer" : "Ajouter le Produit"}
                  </GoldenBtn>
                  {editingArtId && (
                    <GoldenBtn variant="ghost" onClick={() => { setEditingArtId(null); setArtNom(""); setArtPrix(""); setArtDesc(""); setArtImage(""); }}>
                      Annuler
                    </GoldenBtn>
                  )}
                </div>
              </div>
              <div className="adm-card" style={{ maxHeight: 620, overflowY: "auto" }}>
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "1.4rem" }}>
                  Produits ({articles.length})
                </h3>
                {articles.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--muted)" }}>
                    <Package size={38} style={{ opacity: .25, marginBottom: "1rem", display: "block", margin: "0 auto 1rem" }} />
                    <p style={{ fontSize: "var(--text-sm)" }}>Aucun produit. Commencez par en ajouter un.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
                    {articles.map((art) => (
                      <div key={art.id} className="adm-list-item">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art.titre}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontWeight: 600, marginTop: 2 }}>{art.prix} · {art.cat}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <button className="adm-icon-btn" aria-label="Modifier" onClick={() => handleEditArticle(art)} style={{ background: "rgba(201,48,44,.12)", color: "var(--accent)" }}><Edit2 size={13}/></button>
                          <button className="adm-icon-btn" aria-label="Supprimer" onClick={() => handleDeleteArticle(art)} style={{ background: "rgba(180,0,0,.1)", color: "#e53935" }}><Trash2 size={13}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── RÉALISATIONS ── */}
          {activeTab === "realisations" && (
            <div className="adm-split">
              <div className="adm-card">
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "1.4rem" }}>
                  {editingRealId ? "Modifier la Réalisation" : "Ajouter une Réalisation"}
                </h3>
                <Field label="Titre de la Réalisation *" value={realNom} onChange={setRealNom} placeholder="Ex: Livraison d'un Conteneur de 40 pieds" />
                <Field label="Nom Client / Fonction" value={realClient} onChange={setRealClient} placeholder="Ex: Mme Ablavi T., Importatrice" />
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Catégorie" value={realCat} onChange={setRealCat} options={["Import", "Études", "Formation", "Visa", "Tourisme"]} />
                  <Field label="Note Étoiles" value={realStars} onChange={setRealStars} options={["5", "4", "3", "2", "1"]} />
                </div>
                <MediaUpload value={realImage} onChange={setRealImage} label="Photo / Vidéo de la réalisation" />
                <Field label="Descriptif / Récit *" value={realDesc} onChange={setRealDesc} placeholder="Comment cela a été réalisé..." rows={2} />
                <Field label="Témoignage Client" value={realTemoignage} onChange={setRealTemoignage} placeholder="Citation directe du client..." rows={2} />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <GoldenBtn variant="solid" onClick={handleSaveRealisation} style={{ flex: 1 }}>
                    {editingRealId ? "Enregistrer" : "Ajouter la Réalisation"}
                  </GoldenBtn>
                  {editingRealId && (
                    <GoldenBtn variant="ghost" onClick={() => { setEditingRealId(null); setRealNom(""); setRealDesc(""); setRealClient(""); setRealTemoignage(""); setRealImage(""); }}>
                      Annuler
                    </GoldenBtn>
                  )}
                </div>
              </div>
              <div className="adm-card" style={{ maxHeight: 620, overflowY: "auto" }}>
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "1.4rem" }}>
                  Réalisations ({realisations.length})
                </h3>
                {realisations.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--muted)" }}>
                    <ClipboardList size={38} style={{ opacity: .25, display: "block", margin: "0 auto 1rem" }} />
                    <p style={{ fontSize: "var(--text-sm)" }}>Aucune réalisation. Ajoutez-en une.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
                    {realisations.map((real) => (
                      <div key={real.id} className="adm-list-item">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{real.titre}</div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontWeight: 600, marginTop: 2 }}>{real.cat} · {real.client || "Client Anonyme"} · {real.stars || 5} ★</div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                          <button className="adm-icon-btn" aria-label="Modifier" onClick={() => handleEditRealisation(real)} style={{ background: "rgba(201,48,44,.12)", color: "var(--accent)" }}><Edit2 size={13}/></button>
                          <button className="adm-icon-btn" aria-label="Supprimer" onClick={() => handleDeleteRealisation(real)} style={{ background: "rgba(180,0,0,.1)", color: "#e53935" }}><Trash2 size={13}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ÉQUIPE ── */}
          {activeTab === "equipe" && (
            <div className="adm-split">
              <div className="adm-card">
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "1.4rem" }}>
                  {editingMemId ? "Modifier le Membre" : "Ajouter un Membre"}
                </h3>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Nom Complet *" value={memNom} onChange={setMemNom} placeholder="Ex: Jean Koffi" />
                  <Field label="Poste / Rôle *" value={memPoste} onChange={setMemPoste} placeholder="Ex: Directeur Général" />
                </div>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Téléphone" value={memContact} onChange={setMemContact} placeholder="+228 90 00 00 00" />
                  <Field label="Email" type="email" value={memEmail} onChange={setMemEmail} placeholder="nom@easychina.com" />
                </div>
                <Field label="Spécialités (séparées par des virgules)" value={memSpecialites} onChange={setMemSpecialites} placeholder="Import & Logistique, Visas, Négociation" />
                <Field label="Biographie" value={memBio} onChange={setMemBio} placeholder="Parcours, expertise, années d'expérience..." rows={3} />
                <MediaUpload value={memImage} onChange={setMemImage} label="Photo du membre" />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <GoldenBtn variant="solid" onClick={handleSaveMembre} style={{ flex: 1 }}>
                    {editingMemId ? "Enregistrer les modifications" : "Ajouter à l'Équipe"}
                  </GoldenBtn>
                  {editingMemId && <GoldenBtn variant="ghost" onClick={resetMemForm}>Annuler</GoldenBtn>}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {editingMemId && (memNom || memPoste) && (
                  <div className="adm-card" style={{ background: "rgba(201,48,44,.04)", border: "1.5px solid rgba(201,48,44,.2)" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: ".8rem" }}>Aperçu</div>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "var(--border)" }}>
                        {memImage
                          ? <img src={memImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={20} color="var(--muted)" /></div>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text)" }}>{memNom || "—"}</div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--accent)", fontWeight: 600 }}>{memPoste || "—"}</div>
                        {memBio && <div style={{ fontSize: "var(--text-xs)", color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{memBio.slice(0, 120)}{memBio.length > 120 ? "…" : ""}</div>}
                      </div>
                    </div>
                  </div>
                )}
                <div className="adm-card" style={{ maxHeight: 560, overflowY: "auto" }}>
                  <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "1.4rem" }}>
                    Membres ({equipe.length})
                  </h3>
                  {equipe.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--muted)" }}>
                      <Users size={38} style={{ opacity: .25, display: "block", margin: "0 auto 1rem" }} />
                      <p style={{ fontSize: "var(--text-sm)" }}>Aucun membre. Ajoutez-en un.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>
                      {equipe.map((m) => (
                        <div key={m.id} className="adm-list-item">
                          <div style={{ width: 38, height: 38, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--border)" }}>
                            {m.image
                              ? <img src={m.image} alt={m.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={16} color="var(--muted)" /></div>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text)" }}>{m.nom}</div>
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontWeight: 600, marginTop: 2 }}>{m.poste}</div>
                          </div>
                          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                            <button className="adm-icon-btn" aria-label="Modifier" onClick={() => handleEditMembre(m)} style={{ background: "rgba(201,48,44,.12)", color: "var(--accent)" }}><Edit2 size={13}/></button>
                            <button className="adm-icon-btn" aria-label="Supprimer" onClick={() => handleDeleteMembre(m)} style={{ background: "rgba(180,0,0,.1)", color: "#e53935" }}><Trash2 size={13}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── DELETE MODAL ── */}
      {deleteModal && (
        <div className="adm-modal-backdrop" onClick={() => setDeleteModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.2rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(201,48,44,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text)" }}>Confirmer la suppression</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--muted)", marginTop: 3 }}>Cette action est irréversible.</div>
              </div>
            </div>
            <div style={{ background: "var(--surface-alt)", borderRadius: 8, padding: ".7rem 1rem", marginBottom: "1.5rem", fontSize: "var(--text-sm)", color: "var(--text)", fontWeight: 600, border: "1px solid var(--border)" }}>
              {deleteModal.label}
            </div>
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
              <GoldenBtn variant="ghost" onClick={() => setDeleteModal(null)}>Annuler</GoldenBtn>
              <GoldenBtn variant="solid" onClick={confirmDelete} style={{ background: "rgba(201,48,44,.9)", borderColor: "transparent" }}>
                Supprimer
              </GoldenBtn>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="adm-toast" style={{ background: toast.type === "error" ? "rgba(180,0,0,.95)" : "rgba(22,163,74,.95)", color: "#fff" }}>
          {toast.type === "error" ? <AlertCircle size={15}/> : <CheckCircle size={15}/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── GLOBAL APP ROOT ─────────────────────────────────────────────────────────
export default function App() {
  useLang();
  const [page, setPage] = useState("accueil");
  
  const [articles,     setArticlesState]     = useState(DEFAULT_ARTICLES);
  const [realisations, setRealisationsState] = useState(DEFAULT_REALISATIONS);
  const [equipe,       setEquipeState]       = useState(DEFAULT_EQUIPE);
  const [deployStatus, setDeployStatus]      = useState(null); // null | 'saving' | 'deploying' | 'error'

  // Load live data from /public/data JSON files served by Vercel
  useEffect(() => {
    const load = async () => {
      try {
        const [cr, rr, er] = await Promise.all([
          fetch(`/data/catalogue.json?t=${Date.now()}`),
          fetch(`/data/realisations.json?t=${Date.now()}`),
          fetch(`/data/equipe.json?t=${Date.now()}`),
        ]);
        if (cr.ok) { const d = await cr.json(); if (d?.length) setArticlesState(d); }
        if (rr.ok) { const d = await rr.json(); if (d?.length) setRealisationsState(d); }
        if (er.ok) { const d = await er.json(); if (d?.length) setEquipeState(d); }
      } catch {}
    };
    load();
  }, []);

  const doGhSave = useCallback(async (filepath, data) => {
    if (!GH_TOKEN) return;
    setDeployStatus("saving");
    const ok = await ghCommit(filepath, data);
    setDeployStatus(ok ? "deploying" : "error");
    if (ok) setTimeout(() => setDeployStatus(null), 150000);
  }, []);

  const setArticles = useCallback((v) => {
    let captured;
    setArticlesState((prev) => {
      captured = typeof v === "function" ? v(prev) : v;
      return captured;
    });
    setTimeout(() => { if (captured !== undefined) doGhSave("public/data/catalogue.json", captured); }, 0);
  }, [doGhSave]);

  const setRealisations = useCallback((v) => {
    let captured;
    setRealisationsState((prev) => {
      captured = typeof v === "function" ? v(prev) : v;
      return captured;
    });
    setTimeout(() => { if (captured !== undefined) doGhSave("public/data/realisations.json", captured); }, 0);
  }, [doGhSave]);

  const setEquipe = useCallback((v) => {
    let captured;
    setEquipeState((prev) => {
      captured = typeof v === "function" ? v(prev) : v;
      return captured;
    });
    setTimeout(() => { if (captured !== undefined) doGhSave("public/data/equipe.json", captured); }, 0);
  }, [doGhSave]);

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
      fontFamily: "var(--font-body)",
      minHeight: "100vh",
      background: 'var(--bg)',
      color: 'var(--text)',
      position: "relative",
      overflowX: "hidden"
    }}>
      <SEOHead page={page} />


      {/* Global CSS Stylesheet Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::selection {
          background: rgba(201,48,44,0.18);
          color: var(--text);
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--surface-alt); }
        ::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent-strong); }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Layout utilities ── */
        .section-wrap {
          padding-top: var(--space-section);
          padding-bottom: var(--space-section);
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }

        .section-inner {
          max-width: var(--container);
          margin: 0 auto;
        }

        /* ── Grid system ── */
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-8);
        }

        .grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-6);
        }

        .grid-50-50 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: center;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-8);
          grid-auto-flow: dense;
        }

        .zoom-container {
          overflow: hidden;
          position: relative;
        }

        .zoom-container:hover .zoom-img {
          transform: scale(1.04) !important;
          transition: transform 0.5s ease !important;
        }

        .zoom-img {
          transition: transform 0.5s ease !important;
        }

        /* ── Nav link underline draw ── */
        .nav-link-underline {
          position: absolute;
          bottom: 4px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: var(--accent);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.18s ease;
        }
        .nav-link-active .nav-link-underline,
        .nav-link:hover .nav-link-underline {
          transform: scaleX(1);
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
            gap: var(--space-8) !important;
          }
          .processus-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .processus-line {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .nav-desktop-menu {
            display: none !important;
          }
          .nav-mobile-trigger {
            display: flex !important;
          }
          .hero-text-panel {
            padding: var(--space-16) var(--gutter) var(--space-12) !important;
          }
        }

        @media (max-width: 640px) {
          .grid-50-50 {
            grid-template-columns: 1fr !important;
          }
          .bento-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-card {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
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

        @media (max-width: 480px) {
          .processus-grid {
            grid-template-columns: 1fr !important;
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
          {page === "admin" && <PageAdmin articles={articles} setArticles={setArticles} realisations={realisations} setRealisations={setRealisations} equipe={equipe} setEquipe={setEquipe} deployStatus={deployStatus} />}
        </PageTransition>
      </main>

      {/* Footer */}
      <footer style={{
        background: "var(--secondary)",
        color: "rgba(255,255,255,0.55)",
        textAlign: "center",
        padding: "var(--space-16) var(--gutter)",
        fontSize: "var(--text-sm)",
        borderTop: `2px solid var(--accent)`,
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src="/logo.png"
              alt="Easy China"
              onClick={() => goTo("accueil")}
              style={{ height: 44, width: "auto", objectFit: "contain", cursor: "pointer", filter: "brightness(0) invert(1)" }}
            />
          </div>
          <p style={{ fontSize: "var(--text-xs)", letterSpacing: "0.02em", color: "rgba(255,255,255,0.4)" }}>
            {t("footer_copy")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-8)", flexWrap: "wrap" }}>
            {[["accueil","nav_accueil"],["catalogue","nav_catalogue"],["realisations","nav_realisations"],["equipe","nav_equipe"]].map(([k, tk]) => (
              <span key={k}
                style={{ cursor: "pointer", color: "rgba(255,255,255,0.55)", transition: "color 0.15s", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                onClick={() => goTo(k)}>{t(tk)}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}










