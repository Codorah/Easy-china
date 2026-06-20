// @ts-nocheck
import { useState } from "react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

export function Img({ src, alt, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <div className="relative overflow-hidden" style={style}>
      {!loaded && !err && (
        <div
          className="absolute inset-0 animate-shimmer rounded-[inherit] bg-[length:200%_100%]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #f1f5f9 25%, rgba(201,48,44,0.07) 50%, #f1f5f9 75%)",
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
            "w-full h-full object-cover rounded-[inherit] transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      ) : (
        <div className="w-full h-full bg-slate-50 border border-border flex items-center justify-center text-accent rounded-[inherit]">
          <Image size={32} />
        </div>
      )}
    </div>
  );
}
