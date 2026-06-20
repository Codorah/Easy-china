// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { t, useLang } from "./i18n";
import { supabase } from "./supabase";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { DEFAULT_ARTICLES, DEFAULT_EQUIPE, DEFAULT_REALISATIONS } from "@/lib/data";
import { cn } from "@/lib/utils";

import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { PageTransition } from "@/components/layout/PageTransition";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { PageAccueil } from "@/components/pages/PageAccueil";
import { PageCatalogue } from "@/components/pages/PageCatalogue";
import { PageRealisations } from "@/components/pages/PageRealisations";
import { PageEquipe } from "@/components/pages/PageEquipe";
import { PageAdmin } from "@/components/pages/PageAdmin";

export default function App() {
  useLang();
  const [page, setPage] = useState("accueil");

  const [articles, setArticlesState] = useState(DEFAULT_ARTICLES);
  const [realisations, setRealisationsState] = useState(DEFAULT_REALISATIONS);
  const [equipe, setEquipeState] = useState(DEFAULT_EQUIPE);
  const [deployStatus, setDeployStatus] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    const load = async () => {
      try {
        const [ar, rr, er] = await Promise.all([
          supabase.from("articles").select("*").order("id"),
          supabase.from("realisations").select("*").order("id"),
          supabase.from("equipe").select("*").order("id"),
        ]);
        if (ar.data?.length) setArticlesState(ar.data);
        if (rr.data?.length) setRealisationsState(rr.data);
        if (er.data?.length) setEquipeState(er.data);
      } catch {}
    };
    load();
  }, []);

  const sbSync = useCallback(async (table, data) => {
    if (!supabase) return;
    setDeployStatus("saving");
    const ids = data.map((r) => r.id);
    await supabase.from(table).delete().not("id", "in", `(${ids.join(",")})`);
    const { error } = await supabase.from(table).upsert(data, { onConflict: "id" });
    setDeployStatus(error ? "error" : "deploying");
    if (!error) setTimeout(() => setDeployStatus(null), 3000);
  }, []);

  const setArticles = useCallback(
    (v) => {
      let captured;
      setArticlesState((prev) => {
        captured = typeof v === "function" ? v(prev) : v;
        return captured;
      });
      setTimeout(() => {
        if (captured !== undefined) sbSync("articles", captured);
      }, 0);
    },
    [sbSync]
  );

  const setRealisations = useCallback(
    (v) => {
      let captured;
      setRealisationsState((prev) => {
        captured = typeof v === "function" ? v(prev) : v;
        return captured;
      });
      setTimeout(() => {
        if (captured !== undefined) sbSync("realisations", captured);
      }, 0);
    },
    [sbSync]
  );

  const setEquipe = useCallback(
    (v) => {
      let captured;
      setEquipeState((prev) => {
        captured = typeof v === "function" ? v(prev) : v;
        return captured;
      });
      setTimeout(() => {
        if (captured !== undefined) sbSync("equipe", captured);
      }, 0);
    },
    [sbSync]
  );

  useEffect(() => {
    document.documentElement.lang = "fr";
  }, []);

  const pagesList = [
    ["accueil", "Accueil"],
    ["catalogue", "Catalogue"],
    ["realisations", "Réalisations"],
    ["equipe", "Notre Équipe"],
    ["admin", "⚙ Admin"],
  ];

  const goTo = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="font-body min-h-screen bg-bg text-text relative overflow-x-hidden">
      <SEOHead page={page} />
      <FloatingNav pages={pagesList} activePage={page} setPage={goTo} />

      <main className="relative z-[1]">
        <PageTransition pageKey={page}>
          {page === "accueil" && <PageAccueil goTo={goTo} />}
          {page === "catalogue" && <PageCatalogue articles={articles} />}
          {page === "realisations" && <PageRealisations realisations={realisations} />}
          {page === "equipe" && <PageEquipe equipe={equipe} />}
          {page === "admin" && (
            <PageAdmin
              articles={articles}
              setArticles={setArticles}
              realisations={realisations}
              setRealisations={setRealisations}
              equipe={equipe}
              setEquipe={setEquipe}
              deployStatus={deployStatus}
            />
          )}
        </PageTransition>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white/55 text-sm border-t-2 border-accent relative z-[2] overflow-hidden">
        {/* Top gradient line */}
        <div className="h-1 bg-gradient-to-r from-accent via-accent-strong to-accent" />

        <div className="max-w-container mx-auto px-[clamp(20px,5vw,48px)] pt-16 pb-8">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand column */}
            <div>
              <img
                src="/logo.png"
                alt="Easy China"
                onClick={() => goTo("accueil")}
                className="h-12 w-auto object-contain cursor-pointer brightness-0 invert mb-6"
              />
              <p className="text-white/50 leading-[1.7] text-sm max-w-[36ch] mb-6">
                Votre partenaire de confiance pour l'import depuis la Chine, les
                études universitaires et les services de visa.
              </p>
              <a
                href={waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite des informations.")}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2",
                  "bg-[#25D366] text-white font-semibold",
                  "py-2.5 px-5 rounded-full text-xs",
                  "no-underline",
                  "hover:shadow-lg hover:-translate-y-0.5 transition-all"
                )}
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            {/* Navigation column */}
            <div>
              <h4 className="text-white font-bold text-sm mb-6 tracking-[0.08em] uppercase">
                Navigation
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  ["accueil", "Accueil"],
                  ["catalogue", "Catalogue"],
                  ["realisations", "Réalisations"],
                  ["equipe", "Notre Équipe"],
                ].map(([k, label]) => (
                  <span
                    key={k}
                    className="cursor-pointer text-white/50 font-medium hover:text-white hover:pl-1.5 transition-all"
                    onClick={() => goTo(k)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact column */}
            <div>
              <h4 className="text-white font-bold text-sm mb-6 tracking-[0.08em] uppercase">
                Contact
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-white/55">
                  <Mail size={14} className="text-accent shrink-0" />
                  <span>services@easychina.online</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/55">
                  <Phone size={14} className="text-accent shrink-0" />
                  <span>+228 90 61 92 88</span>
                </div>
                <div className="flex items-center gap-2.5 text-white/55">
                  <MapPin size={14} className="text-accent shrink-0" />
                  <span>Guangzhou · Yiwu · Lomé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <h4 className="text-white font-bold text-sm mb-2 tracking-[0.08em] uppercase">
              Newsletter
            </h4>
            <p className="text-white/50 text-sm mb-4">
              Recevez nos offres exclusives
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.querySelector("input");
                if (input?.value) {
                  window.open(waLink(WA_COMMERCIAL, `Bonjour, je souhaite m'inscrire à la newsletter avec l'email : ${input.value}`));
                  input.value = "";
                }
              }}
              className="flex gap-3 max-w-md"
            >
              <input
                type="email"
                placeholder="votre@email.com"
                required
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-full",
                  "bg-white/10 border border-white/15",
                  "text-white text-sm placeholder:text-white/30",
                  "outline-none focus:border-accent/50 focus:bg-white/[0.12]",
                  "transition-all"
                )}
              />
              <button
                type="submit"
                className={cn(
                  "px-5 py-2.5 rounded-full",
                  "bg-gradient-to-r from-accent to-accent-strong",
                  "text-white text-sm font-semibold",
                  "hover:shadow-accent hover:-translate-y-0.5",
                  "transition-all cursor-pointer border-0",
                  "flex items-center gap-2"
                )}
              >
                <Send size={14} /> S'inscrire
              </button>
            </form>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex justify-between items-center flex-wrap gap-4">
            <p className="text-xs text-white/35 m-0">
              {t("footer_copy")}
            </p>
            <div className="flex gap-3 items-center">
              {["\u{1F1F9}\u{1F1EC}", "\u{1F1E8}\u{1F1F3}", "\u{1F1E8}\u{1F1EE}", "\u{1F1F8}\u{1F1F3}", "\u{1F1E8}\u{1F1F2}"].map((f) => (
                <span key={f} className="text-lg">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
