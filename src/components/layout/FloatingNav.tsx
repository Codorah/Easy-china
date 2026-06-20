// @ts-nocheck
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t, useLang } from "@/i18n";
import { Logo } from "@/components/layout/Logo";
import { LangSwitcher } from "@/components/layout/LangSwitcher";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1];

export function FloatingNav({ pages, activePage, setPage }) {
  useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const NAV_KEYS = {
    accueil: "nav_accueil",
    catalogue: "nav_catalogue",
    realisations: "nav_realisations",
    equipe: "nav_equipe",
    admin: "nav_admin",
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Floating Glass Pill Nav */}
      <motion.nav
        initial={false}
        animate={{
          scale: isScrolled ? 0.97 : 1,
          y: isScrolled ? 0 : 0,
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-[1000]",
          "w-[calc(100%-2rem)] max-w-[1100px]",
          "rounded-full px-2 py-1.5",
          "flex items-center justify-between",
          "border border-white/40 shadow-lg",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isScrolled
            ? "bg-white/80 backdrop-blur-3xl shadow-xl"
            : "bg-white/70 backdrop-blur-2xl"
        )}
      >
        {/* Logo -- left */}
        <div className="shrink-0 pl-2">
          <Logo
            size="sm"
            onClick={() => {
              setPage("accueil");
              setIsOpen(false);
            }}
          />
        </div>

        {/* Desktop nav links -- center */}
        <div className="hidden md:flex items-center gap-1">
          {pages.map(([k]) => (
            <button
              key={k}
              onClick={() => setPage(k)}
              className={cn(
                "relative border-none bg-transparent cursor-pointer",
                "px-4 py-2 rounded-full",
                "text-sm font-medium tracking-wide font-body",
                "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "min-h-[40px]",
                activePage === k
                  ? "text-accent font-semibold"
                  : "text-text/70 hover:text-accent"
              )}
            >
              {t(NAV_KEYS[k] || k)}
            </button>
          ))}
        </div>

        {/* Lang switcher -- right (desktop) */}
        <div className="hidden md:flex items-center pr-2">
          <LangSwitcher />
        </div>

        {/* Mobile hamburger -- morphing icon */}
        <button
          aria-label={isOpen ? "Fermer le menu" : t("nav_open")}
          className="flex md:hidden items-center justify-center relative z-[1002] w-10 h-10 bg-transparent border-none cursor-pointer mr-1"
          onClick={() => setIsOpen((o) => !o)}
        >
          <div className="relative w-5 h-5 flex flex-col justify-center items-center">
            <span
              className={cn(
                "absolute h-[2px] w-5 bg-text rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isOpen ? "rotate-45 top-[9px]" : "rotate-0 top-1"
              )}
            />
            <span
              className={cn(
                "absolute h-[2px] w-5 bg-text rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100 top-[9px]"
              )}
            />
            <span
              className={cn(
                "absolute h-[2px] w-5 bg-text rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isOpen ? "-rotate-45 top-[9px]" : "rotate-0 top-4"
              )}
            />
          </div>
        </button>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[999] flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6">
              {pages.map(([k], i) => (
                <motion.button
                  key={k}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: EASE,
                  }}
                  onClick={() => {
                    setPage(k);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "bg-transparent border-none cursor-pointer",
                    "text-2xl font-display font-bold tracking-wide",
                    "transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    activePage === k
                      ? "text-accent font-semibold"
                      : "text-text/70 hover:text-accent"
                  )}
                >
                  {t(NAV_KEYS[k] || k)}
                </motion.button>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: pages.length * 0.05 + 0.05, ease: EASE }}
              className="mt-10"
            >
              <LangSwitcher />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
