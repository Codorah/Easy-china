// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import {
  Lock, LogOut, Plus, Edit2, Trash2, Package,
  ClipboardList, Users, Menu, X, CheckCircle, AlertCircle,
  Settings, ShieldCheck
} from "lucide-react";
import { supabase } from "@/supabase";
import { ADMIN_HASH } from "@/lib/constants";
import { Field } from "@/components/primitives/Field";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { GlassCard } from "@/components/primitives/GlassCard";
import { MediaUpload } from "@/components/primitives/MediaUpload";

// ─── HELPERS ────────────────────────────────────────────────────────────────

const sanitize = s => s.replace(/<[^>]*>/g, '').trim();

const sha256 = async (str) => {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ─── PAGE ADMIN ──────────────────────────────────────────────────────────────
export function PageAdmin({ articles, setArticles, realisations, setRealisations, equipe, setEquipe, deployStatus }) {
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
            const p = pills[deployStatus] || (supabase
              ? { color: "#15803d", bg: "rgba(34,197,94,.1)", label: "Live" }
              : { color: "#b45309", bg: "rgba(234,179,8,.1)", label: "Local" });
            return <span style={{ fontSize: "11px", fontWeight: 700, color: p.color, background: p.bg, padding: "3px 11px", borderRadius: 20, flexShrink: 0 }}>{p.label}</span>;
          })()}
        </header>

        {/* Mobile tab strip -- visible only on small screens */}
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
                        <div style={{ fontWeight: 700, fontSize: "var(--text-base)", color: "var(--text)" }}>{memNom || "--"}</div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--accent)", fontWeight: 600 }}>{memPoste || "--"}</div>
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
