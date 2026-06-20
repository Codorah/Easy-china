// @ts-nocheck
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { t, useLang } from "@/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Logo } from "@/components/layout/Logo";
import { LangSwitcher } from "@/components/layout/LangSwitcher";
import { NavBtn } from "@/components/layout/NavBtn";

export function FloatingNav({ pages, activePage, setPage }) {
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
