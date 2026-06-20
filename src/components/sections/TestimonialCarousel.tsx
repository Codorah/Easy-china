// @ts-nocheck
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/i18n";
import { GlassCard } from "@/components/primitives/GlassCard";
import { cn } from "@/lib/utils";

function Testimonial({ quote, author, role, stars }) {
  return (
    <GlassCard tilt={true} className="px-8 py-9 flex flex-col h-full justify-between">
      <div>
        <div className="text-[2.8rem] text-accent leading-none opacity-30 mb-3 font-serif">"</div>
        <p className="italic text-sm text-text leading-[1.65] mb-7">
          {quote}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-strong border-[1.5px] border-accent/20 flex items-center justify-center font-bold text-white text-base">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-text m-0">{author}</h4>
          <span className="text-xs text-muted block mt-0.5">{role}</span>
          <div className="text-accent flex gap-0.5 mt-1">
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
    <div className="max-w-[650px] mx-auto relative overflow-hidden p-4">
      <div
        className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {testimonials.map((t, i) => (
          <div key={i} className="min-w-full px-2.5">
            <Testimonial quote={t.quote} author={t.author} role={t.role} stars={t.stars} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 rounded-sm border-none cursor-pointer transition-all duration-150",
              active === i
                ? "w-6 bg-accent"
                : "w-2 bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}
