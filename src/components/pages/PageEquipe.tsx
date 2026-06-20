// @ts-nocheck
import { Phone, Mail, Users, MessageCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { Img } from "@/components/primitives/Img";

export function PageEquipe({ equipe }) {
  useLang();
  const DEFAULT_IMG = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&h=600&q=80";

  return (
    <div className="py-24 lg:py-32 px-[clamp(20px,5vw,48px)]">
      {/* Hero Banner */}
      <div className={cn(
        "bg-gradient-to-br from-accent via-accent-strong to-[#b71c1c]",
        "rounded-md px-6 md:px-12 py-16 text-center mb-20",
        "relative overflow-hidden max-w-container mx-auto"
      )}>
        <div className="absolute -left-[5%] -top-[40%] w-[400px] h-[400px] rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="absolute -right-[5%] -bottom-[40%] w-[320px] h-[320px] rounded-full bg-white/[0.07] pointer-events-none" />
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-xs text-white/70 tracking-[0.18em] uppercase font-bold mb-4 flex items-center justify-center gap-2">
            <span className="inline-block w-5 h-0.5 bg-white/50 rounded-sm" />
            {t("eq_eyebrow")}
            <span className="inline-block w-5 h-0.5 bg-white/50 rounded-sm" />
          </div>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold text-white font-display mb-4">
            {t("eq_title")}
          </h1>
          <p className="text-white/80 text-base max-w-[580px] mx-auto leading-[1.75]">
            {t("eq_subtitle")}
          </p>
        </ScrollReveal>
      </div>

      {/* Team Cards */}
      <div className="max-w-container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipe.map((member, i) => {
            const specs = member.specialites ? member.specialites.split(",").map(s => s.trim()).filter(Boolean) : [];
            return (
              <ScrollReveal key={member.id} direction="up" delay={i * 0.1}>
                <GlassCard tilt={true} className="p-0 overflow-hidden h-full flex flex-col">
                  {/* Photo */}
                  <div className="h-[300px] relative shrink-0">
                    <Img src={member.image || DEFAULT_IMG} alt={member.nom} className="h-full rounded-none object-top" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/65" />
                    {/* Name overlay on photo */}
                    <div className="absolute bottom-[18px] left-[22px] right-[22px] z-[2]">
                      <h3 className="text-md font-bold text-white mb-0.5 font-display">{member.nom}</h3>
                      <div className="text-white/85 text-xs font-semibold">{member.poste}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-muted leading-[1.7] mb-5">{member.bio}</p>

                      {specs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {specs.map((s, j) => (
                            <span key={j} className={cn(
                              "bg-accent-soft border border-accent/20",
                              "text-accent px-3 py-1 rounded-full",
                              "text-xs font-semibold"
                            )}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="border-t border-border pt-5 flex flex-col gap-2.5">
                      {member.contact && (
                        <a href={`tel:${member.contact.replace(/\s/g, "")}`}
                          className={cn(
                            "flex items-center gap-2.5 text-muted text-sm no-underline font-medium",
                            "hover:text-accent duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          )}>
                          <span className="w-[30px] h-[30px] bg-accent-soft rounded-sm flex items-center justify-center shrink-0">
                            <Phone size={13} className="text-accent" />
                          </span>
                          {member.contact}
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`}
                          className={cn(
                            "flex items-center gap-2.5 text-muted text-sm no-underline font-medium",
                            "hover:text-accent duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          )}>
                          <span className="w-[30px] h-[30px] bg-accent-soft rounded-sm flex items-center justify-center shrink-0">
                            <Mail size={13} className="text-accent" />
                          </span>
                          {member.email}
                        </a>
                      )}
                      <GoldenBtn variant="outline"
                        onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour, je souhaite contacter ${member.nom} (${member.poste}) d'Easy China.`))}
                        className={cn(
                          "w-full mt-1",
                          "duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                        )}>
                        <MessageCircle size={14} className="mr-1.5" /> {t("eq_contact")}
                      </GoldenBtn>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>

        {equipe.length === 0 && (
          <div className="text-center py-16 px-8 text-muted">
            <Users size={48} className="opacity-30 mb-4 mx-auto" />
            <p>L'équipe n'a pas encore été renseignée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
