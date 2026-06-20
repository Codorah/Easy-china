// @ts-nocheck
import { Phone, Mail, Users, MessageCircle } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, waLink } from "@/lib/constants";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { Img } from "@/components/primitives/Img";

export function PageEquipe({ equipe }) {
  useLang();
  const DEFAULT_IMG = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&h=600&q=80";

  return (
    <div style={{ padding: "var(--space-section) var(--gutter)" }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 60%, #b71c1c 100%)`,
        borderRadius: "var(--radius-md)",
        padding: "4rem 3rem",
        textAlign: "center",
        marginBottom: "5rem",
        position: "relative",
        overflow: "hidden",
        maxWidth: "var(--container)",
        margin: "0 auto 5rem",
      }}>
        <div style={{ position: "absolute", left: "-5%", top: "-40%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-40%", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <ScrollReveal direction="up" delay={0.1}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 20, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
            {t("eq_eyebrow")}
            <span style={{ display: "inline-block", width: 20, height: 2, background: "rgba(255,255,255,0.5)", borderRadius: 2 }} />
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)", marginBottom: "1rem" }}>
            {t("eq_title")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "var(--text-base)", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>
            {t("eq_subtitle")}
          </p>
        </ScrollReveal>
      </div>

      {/* Team Cards */}
      <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
        <div className="grid-3">
          {equipe.map((member, i) => {
            const specs = member.specialites ? member.specialites.split(",").map(s => s.trim()).filter(Boolean) : [];
            return (
              <ScrollReveal key={member.id} direction="up" delay={i * 0.1}>
                <GlassCard tilt={true} style={{ padding: 0, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Photo */}
                  <div style={{ height: 300, position: "relative", flexShrink: 0 }}>
                    <Img src={member.image || DEFAULT_IMG} alt={member.nom} style={{ height: "100%", borderRadius: "0px" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.65))" }} />
                    {/* Name overlay on photo */}
                    <div style={{ position: "absolute", bottom: 18, left: 22, right: 22, zIndex: 2 }}>
                      <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "#fff", marginBottom: 2, fontFamily: "var(--font-display)" }}>{member.nom}</h3>
                      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "var(--text-xs)", fontWeight: 600 }}>{member.poste}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1.8rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "var(--text-sm)", color: 'var(--muted)', lineHeight: 1.7, marginBottom: "1.2rem" }}>{member.bio}</p>

                      {specs.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
                          {specs.map((s, j) => (
                            <span key={j} style={{
                              background: "rgba(201,48,44,0.06)",
                              border: "1px solid rgba(201,48,44,0.18)",
                              color: 'var(--accent)',
                              padding: "0.3rem 0.75rem",
                              borderRadius: 20,
                              fontSize: "var(--text-xs)",
                              fontWeight: 600,
                            }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact */}
                    <div style={{ borderTop: `1px solid var(--border)`, paddingTop: "1.2rem", display: "flex", flexDirection: "column", gap: 10 }}>
                      {member.contact && (
                        <a href={`tel:${member.contact.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: 10, color: 'var(--muted)', fontSize: "var(--text-sm)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
                          <span style={{ width: 30, height: 30, background: "rgba(201,48,44,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Phone size={13} color={"var(--accent)"} />
                          </span>
                          {member.contact}
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ display: "flex", alignItems: "center", gap: 10, color: 'var(--muted)', fontSize: "var(--text-sm)", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
                          <span style={{ width: 30, height: 30, background: "rgba(201,48,44,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Mail size={13} color={"var(--accent)"} />
                          </span>
                          {member.email}
                        </a>
                      )}
                      <GoldenBtn variant="outline"
                        onClick={() => window.open(waLink(WA_COMMERCIAL, `Bonjour, je souhaite contacter ${member.nom} (${member.poste}) d'Easy China.`))}
                        style={{ width: "100%", marginTop: 4 }}>
                        <MessageCircle size={14} style={{ marginRight: 6 }}/> {t("eq_contact")}
                      </GoldenBtn>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            );
          })}
        </div>

        {equipe.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: 'var(--muted)' }}>
            <Users size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>L'équipe n'a pas encore été renseignée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
