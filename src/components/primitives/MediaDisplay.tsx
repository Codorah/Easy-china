// @ts-nocheck
import { Play, FileText } from "lucide-react";
import { Img } from "@/components/primitives/Img";
import { cn } from "@/lib/utils";

// Media type detection helpers (inline for now — will move to @/lib/constants later)
const VIDEO_EXTS = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
const DOC_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

function getMediaType(src) {
  if (!src) return "none";
  const ext = src.split(".").pop().toLowerCase().split("?")[0];
  if (VIDEO_EXTS.includes(ext)) return "video";
  if (DOC_EXTS.includes(ext)) return "doc";
  if (src.startsWith("data:video")) return "video";
  return "image";
}

export function MediaDisplay({ src, alt = "", style = {}, fallback, className = "" }) {
  const type = getMediaType(src || fallback);
  const effective = src || fallback;
  if (!effective) return null;

  if (type === "video") {
    return (
      <div
        className={cn(
          "relative w-full h-full overflow-hidden rounded-xl bg-black group",
          className
        )}
        style={style}
      >
        <video
          src={effective}
          className="w-full h-full object-cover rounded-[inherit] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
          preload="metadata"
          controls={false}
          muted
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
          }}
        />
        {/* Premium video overlay with play button */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-[inherit] transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-0">
          {/* Button-in-Button play icon */}
          <div className="p-1 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
            <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-[0_8px_30px_rgba(26,20,16,0.08)]">
              <Play
                size={18}
                color={"var(--accent)"}
                className="ml-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "doc") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full rounded-xl bg-surface-alt gap-3",
          "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          className
        )}
        style={style}
      >
        <div className="p-1 rounded-2xl bg-accent/[0.06] ring-1 ring-accent/10">
          <div className="w-14 h-14 rounded-[calc(1rem-0.25rem)] bg-accent/[0.04] flex items-center justify-center">
            <FileText size={28} color={"var(--accent)"} />
          </div>
        </div>
        <a
          href={effective}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-accent font-semibold hover:underline underline-offset-2 transition-colors duration-300"
        >
          Ouvrir le document
        </a>
      </div>
    );
  }

  return <Img src={effective} alt={alt} style={style} className={className} />;
}
