// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { useLang, changeLang, LANGS } from "@/i18n";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function LangSwitcher() {
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
    <div ref={ref} className="relative select-none">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold font-body cursor-pointer transition-all duration-150",
          open
            ? "bg-accent/[0.07] border border-accent text-accent"
            : "bg-transparent border border-border text-muted hover:border-accent hover:text-accent"
        )}
      >
        <span className="text-base">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown
          size={13}
          className={cn(
            "transition-transform duration-250",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 bg-white shadow-lg rounded-xl border border-border z-[2000] min-w-[150px] overflow-hidden animate-[pageEnter_0.2s_ease]">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { changeLang(l.code); setOpen(false); }}
              className={cn(
                "w-full text-left flex items-center gap-2.5 px-4 py-2.5 border-none cursor-pointer text-sm font-body transition-colors duration-200",
                lang === l.code
                  ? "bg-accent/[0.06] font-bold text-accent"
                  : "bg-transparent font-medium text-text hover:bg-accent/5 hover:text-accent"
              )}
            >
              <span className="text-md">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
