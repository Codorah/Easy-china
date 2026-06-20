// @ts-nocheck
import { Play, FileText } from "lucide-react";
import { Img } from "@/components/primitives/Img";
import { cn } from "@/lib/utils";

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
      <div className="relative w-full h-full bg-black" style={style}>
        <video
          src={effective}
          className="w-full h-full object-cover"
          preload="metadata"
          controls={false}
          muted
          loop
          onMouseEnter={e => e.target.play()}
          onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-white/[0.92] flex items-center justify-center">
            <Play size={18} color={"var(--accent)"} className="ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "doc") {
    return (
      <div
        className="flex flex-col items-center justify-center h-full bg-surface-alt gap-2"
        style={style}
      >
        <FileText size={36} color={"var(--accent)"} />
        <a
          href={effective}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent font-semibold"
        >
          Ouvrir le document
        </a>
      </div>
    );
  }

  return <Img src={effective} alt={alt} style={style} />;
}
