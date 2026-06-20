// @ts-nocheck
import { useState } from "react";
import { Image } from "lucide-react";

export function Img({ src, alt, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      {!loaded && !err && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, #f1f5f9 25%, rgba(201,48,44,0.07) 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite linear",
          borderRadius: "inherit"
        }} />
      )}
      {!err
        ? <img src={src} alt={alt} loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErr(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: loaded ? 1 : 0, transition: "opacity .3s", borderRadius: "inherit"
            }} />
        : <div style={{
            width: "100%", height: "100%", background: "#f8fafc",
            border: `1px solid var(--border)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: 'var(--accent)', borderRadius: "inherit"
          }}>
            <Image size={32} />
          </div>
      }
    </div>
  );
}
