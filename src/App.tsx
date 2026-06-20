// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { t, useLang } from "./i18n";
import { supabase } from "./supabase";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { DEFAULT_ARTICLES, DEFAULT_EQUIPE, DEFAULT_REALISATIONS } from "@/lib/data";

import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { PageTransition } from "@/components/layout/PageTransition";
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
    <div
      style={{
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <SEOHead page={page} />
      <FloatingNav pages={pagesList} activePage={page} setPage={goTo} />

      <main style={{ position: "relative", zIndex: 1 }}>
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
      <footer
        style={{
          background: "var(--secondary)",
          color: "rgba(255,255,255,0.55)",
          padding: "0",
          fontSize: "var(--text-sm)",
          borderTop: "2px solid var(--accent)",
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, var(--accent), var(--accent-strong), var(--accent))",
          }}
        />
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "var(--space-16) var(--gutter) var(--space-8)",
          }}
        >
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr",
              gap: "var(--space-12)",
              marginBottom: "var(--space-12)",
            }}
          >
            <div>
              <img
                src="/logo.png"
                alt="Easy China"
                onClick={() => goTo("accueil")}
                style={{
                  height: 48,
                  width: "auto",
                  objectFit: "contain",
                  cursor: "pointer",
                  filter: "brightness(0) invert(1)",
                  marginBottom: "var(--space-6)",
                }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.7,
                  fontSize: "var(--text-sm)",
                  maxWidth: "36ch",
                  marginBottom: "var(--space-6)",
                }}
              >
                Votre partenaire de confiance pour l'import depuis la Chine, les
                études universitaires et les services de visa.
              </p>
              <a
                href={waLink(WA_COMMERCIAL, "Bonjour Easy China, je souhaite des informations.")}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#25D366",
                  color: "#fff",
                  fontWeight: 600,
                  padding: "0.6rem 1.2rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-xs)",
                  textDecoration: "none",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,211,102,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            <div>
              <h4
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-6)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Navigation
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[
                  ["accueil", "Accueil"],
                  ["catalogue", "Catalogue"],
                  ["realisations", "Réalisations"],
                  ["equipe", "Notre Équipe"],
                ].map(([k, label]) => (
                  <span
                    key={k}
                    style={{
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.5)",
                      transition: "color 0.15s, padding-left 0.15s",
                      fontWeight: 500,
                      paddingLeft: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.paddingLeft = "6px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                    onClick={() => goTo(k)}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4
                style={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "var(--text-sm)",
                  marginBottom: "var(--space-6)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)" }}>
                  <Mail size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>services@easychina.online</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)" }}>
                  <Phone size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>+228 90 61 92 88</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)" }}>
                  <MapPin size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>Guangzhou · Yiwu · Lomé</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "var(--space-6)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-4)",
            }}
          >
            <p style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)", margin: 0 }}>
              {t("footer_copy")}
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              {["🇹🇬", "🇨🇳", "🇨🇮", "🇸🇳", "🇨🇲"].map((f) => (
                <span key={f} style={{ fontSize: "1.1rem" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
