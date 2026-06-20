// @ts-nocheck
import { Play, FileText } from "lucide-react";
import { Img } from "@/components/primitives/Img";

// Media type detection helpers (inline for now — will move to @/lib/constants later)
const VIDEO_EXTS = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
const DOC_EXTS   = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

function getMediaType(src) {
  if (!src) return "none";
  const ext = src.split(".").pop().toLowerCase().split("?")[0];
  if (VIDEO_EXTS.includes(ext)) return "video";
  if (DOC_EXTS.includes(ext))   return "doc";
  if (src.startsWith("data:video")) return "video";
  return "image";
}

export function MediaDisplay({ src, alt = "", style = {}, fallback }) {
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
