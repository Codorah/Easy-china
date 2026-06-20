// @ts-nocheck
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { t, useLang } from "@/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Logo } from "@/components/layout/Logo";
import { LangSwitcher } from "@/components/layout/LangSwitcher";
import { NavBtn } from "@/components/layout/NavBtn";
import { cn } from "@/lib/utils";

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
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-accent to-accent-strong z-[1003] transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <nav
        className={cn(
          "fixed z-[1000] max-w-[1400px] mx-auto h-[68px] px-8 flex items-center justify-between backdrop-blur-[20px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isScrolled
            ? "top-3 left-[4%] right-[4%] w-[92%] bg-[rgba(253,252,248,0.97)] border border-border rounded-lg shadow-[0_6px_28px_rgba(26,20,16,0.1),0_1px_4px_rgba(26,20,16,0.06)]"
            : "top-0 left-0 right-0 w-full bg-[rgba(253,252,248,0.92)] border border-[rgba(230,223,210,0.5)] rounded-none shadow-[0_1px_0_rgba(26,20,16,0.06)]"
        )}
      >
        <Logo onClick={() => { setPage("accueil"); setIsOpen(false); }} />

        {/* Desktop menu */}
        <div className="nav-desktop-menu hidden md:flex gap-1 items-center">
          {pages.map(([k]) => (
            <NavBtn key={k} label={t(NAV_KEYS[k] || k)} active={activePage === k} onClick={() => setPage(k)} />
          ))}
          <div className="ml-2"><LangSwitcher /></div>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={t("nav_open")}
          className="nav-mobile-trigger flex md:hidden flex-col justify-center items-center relative z-[1002] w-[30px] h-[30px] bg-transparent border-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} className="text-text" /> : <Menu size={24} className="text-text" />}
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/[0.98] backdrop-blur-[20px] z-[999] flex flex-col items-center justify-center gap-8 animate-[pageEnter_0.3s_ease]">
          {pages.map(([k]) => (
            <button
              key={k}
              onClick={() => { setPage(k); setIsOpen(false); }}
              className={cn(
                "bg-transparent border-none text-lg font-bold cursor-pointer tracking-[0.06em] font-display transition-colors duration-150",
                activePage === k ? "text-accent" : "text-text"
              )}
            >
              {t(NAV_KEYS[k] || k)}
            </button>
          ))}
          <div className="mt-4"><LangSwitcher /></div>
        </div>
      )}
    </>
  );
}
