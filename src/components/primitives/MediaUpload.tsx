// @ts-nocheck
import { useState, useRef } from "react";
import { Image, Film, FileText, X } from "lucide-react";
import { supabase } from "@/supabase";

// ─── HELPERS ────────────────────────────────────────────────────────────────

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

async function sbUploadMedia(file) {
  if (!supabase) return null;
  const ext = file.name.split(".").pop().toLowerCase();
  const slug = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const filename = `${slug}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(filename, file);
  if (error) return null;
  const { data } = supabase.storage.from("media").getPublicUrl(filename);
  return data?.publicUrl || null;
}

// ─── COMPOSANT MEDIAUPLOAD ──────────────────────────────────────────────────

export const MediaUpload = ({ value, onChange, label = "Photo / Vidéo" }) => {
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

    if (supabase) {
      setUploading(true);
      const publicUrl = await sbUploadMedia(file);
      setUploading(false);
      if (publicUrl) {
        setPreview(publicUrl);
        onChange(publicUrl);
      } else {
        setUploadErr("Erreur d'upload. Vérifiez la configuration Supabase.");
        setObjectUrl("");
      }
    } else if (isImage) {
      const reader = new FileReader();
      reader.onload = e => { setPreview(e.target.result); onChange(e.target.result); };
      reader.readAsDataURL(file);
    } else {
      setUploadErr("Configurez VITE_SUPABASE_ANON_KEY dans Vercel → Settings → Environment Variables.");
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
            <p style={{ fontSize: ".8rem", color: 'var(--muted)', margin: 0 }}>Upload en cours…</p>
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
                ✓ Fichier uploadé avec succès
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
