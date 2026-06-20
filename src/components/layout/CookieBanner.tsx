// @ts-nocheck
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem("ec_cookies");
    if (!choice) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem("ec_cookies", accepted ? "accepted" : "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className={cn(
        "m-4 rounded-2xl overflow-hidden",
        "bg-secondary/90 backdrop-blur-2xl text-white",
        "p-4 md:p-6",
        "border border-white/10"
      )}>
        <div className="max-w-container mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <p className="text-sm text-white/70 leading-relaxed flex-1">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site.
            En continuant à naviguer, vous acceptez notre utilisation des cookies
            conformément à notre politique de confidentialité.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleChoice(false)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold",
                "border border-white/25 text-white/70",
                "hover:border-white/50 hover:text-white",
                "duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer bg-transparent"
              )}
            >
              Refuser
            </button>
            <span className="p-0.5 rounded-full bg-white/10 ring-1 ring-white/20">
              <button
                onClick={() => handleChoice(true)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold text-white",
                  "bg-gradient-to-r from-accent to-accent-strong",
                  "hover:shadow-accent hover:-translate-y-0.5",
                  "duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer border-0"
                )}
              >
                Accepter
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
