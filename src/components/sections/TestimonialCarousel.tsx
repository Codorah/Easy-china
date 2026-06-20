// @ts-nocheck
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/i18n";
import { GlassCard } from "@/components/primitives/GlassCard";

function Testimonial({ quote, author, role, stars }) {
  return (
    <GlassCard tilt={true} style={{ padding: "2.2rem 2rem", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: "2.8rem", color: 'var(--accent)', lineHeight: 0.4, opacity: 0.3, marginBottom: "0.8rem", fontFamily: "serif" }}>"</div>
        <p style={{ fontStyle: "italic", fontSize: "var(--text-sm)", color: 'var(--text)', lineHeight: 1.65, marginBottom: "1.8rem" }}>
          {quote}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: `linear-gradient(135deg, var(--accent), var(--accent-strong))`,
          border: `1.5px solid rgba(201, 48, 44, 0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "#fff", fontSize: "var(--text-base)"
        }}>
          {author.charAt(0)}
        </div>
        <div>
          <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: 'var(--text)', margin: 0 }}>{author}</h4>
          <span style={{ fontSize: "var(--text-xs)", color: 'var(--muted)', display: "block", marginTop: 2 }}>{role}</span>
          <div style={{ color: 'var(--accent)', display: "flex", gap: 2, marginTop: 4 }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={14} fill={idx < stars ? "var(--accent)" : "transparent"} color={"var(--accent)"} />
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function TestimonialCarousel() {
  useLang();
  const testimonials = [
    { quote: "Grâce à Easy China, j'ai importé 3 conteneurs de machines textiles sans aucun souci logistique. L'équipe à Lomé et Guangzhou est exceptionnelle.", author: "M. Yao K.", role: "CEO, Africa Textiles", stars: 5 },
    { quote: "L'assistance pour mon admission à l'Université de Wuhan a été rapide et transparente. J'ai même obtenu une bourse complète. Merci infiniment !", author: "Mlle Amivi S.", role: "Étudiante en Master", stars: 5 },
    { quote: "Leur formation sur les machines de pressing industriel en Chine a transformé ma blanchisserie à Lomé. Recommandé à 100% !", author: "M. Kodjo A.", role: "Directeur, Smart Wash", stars: 5 },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div style={{ maxWidth: 650, margin: "0 auto", position: "relative", overflow: "hidden", padding: "1rem" }}>
      <div style={{
        display: "flex",
        transform: `translateX(-${active * 100}%)`,
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{ minWidth: "100%", padding: "0 10px" }}>
            <Testimonial quote={t.quote} author={t.author} role={t.role} stars={t.stars} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "1.5rem" }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              background: active === i ? "var(--accent)" : "var(--border)",
              cursor: "pointer",
              transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
