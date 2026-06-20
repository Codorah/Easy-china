// @ts-nocheck
import { useState } from "react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

export function Img({ src, alt, style = {}, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={style}
    >
      {/* Premium warm shimmer placeholder */}
      {!loaded && !err && (
        <div
          className="absolute inset-0 animate-shimmer rounded-[inherit] bg-[length:200%_100%]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #f3ece3 25%, rgba(201,48,44,0.06) 37%, rgba(250,245,240,0.9) 50%, rgba(201,48,44,0.06) 63%, #f3ece3 75%)",
          }}
        />
      )}
      {!err ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErr(true)}
          className={cn(
            "w-full h-full object-cover rounded-[inherit]",
            "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
          )}
        />
      ) : (
        <div className="w-full h-full bg-surface-alt border border-border/60 flex items-center justify-center text-accent/40 rounded-[inherit]">
          <Image size={32} />
        </div>
      )}
    </div>
  );
}
