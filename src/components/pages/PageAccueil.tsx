// @ts-nocheck
import { Ship, GraduationCap, Wrench, FileCheck, ArrowRight, Package, TrendingUp, Zap } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, UNSPLASH_REAL, UNSPLASH, waLink } from "@/lib/constants";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { Img } from "@/components/primitives/Img";
import { Tag } from "@/components/primitives/Tag";
import { CityPill } from "@/components/primitives/CityPill";
import { HeroSection } from "@/components/sections/HeroSection";
import { PaysCouverts } from "@/components/sections/PaysCouverts";
import { ProcessusSection } from "@/components/sections/ProcessusSection";
import { ServicesComplementaires } from "@/components/sections/ServicesComplementaires";
import { SecteursSection } from "@/components/sections/SecteursSection";
import { PremiumServices } from "@/components/sections/PremiumServices";
import { Timeline } from "@/components/sections/Timeline";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { ContactForm } from "@/components/sections/ContactForm";

export function PageAccueil({ goTo }) {
  useLang();
  const services = [
    { icon: <Ship size={22}/>,         cat: "Import",    title: t("svc1_name"), text: t("svc1_desc"), cta: "Démarrer un import",      msg: "Bonjour Easy China, je souhaite démarrer un import depuis la Chine." },
    { icon: <GraduationCap size={22}/>, cat: "Études",   title: t("svc2_name"), text: t("svc2_desc"), cta: "Explorer les formations",  msg: "Bonjour Easy China, je souhaite des informations sur les études en Chine." },
    { icon: <Wrench size={22}/>,        cat: "Formation", title: t("svc3_name"), text: t("svc3_desc"), cta: "Voir le programme",        msg: "Bonjour Easy China, je souhaite des informations sur la formation professionnelle." },
    { icon: <FileCheck size={22}/>,     cat: "Visa",      title: t("svc4_name"), text: t("svc4_desc"), cta: "Commencer ma demande",     msg: "Bonjour Easy China, je souhaite des informations sur la procédure de visa." },
  ];

  const historyItems = [
    { year: "2017", title: "Fondation d'Easy China", desc: "Création de l'agence à Lomé, Togo avec pour mission de simplifier la liaison commerciale et académique entre l'Afrique de l'Ouest et la Chine." },
    { year: "2019", title: "Ouverture du Bureau en Chine", desc: "Établissement de nos bureaux permanents à Guangzhou et Yiwu pour assurer une inspection qualité physique en usine et un accompagnement local des étudiants." },
    { year: "2021", title: "Expansion de l'Offre Universitaire", desc: "Signature de partenariats exclusifs avec plus de 30 grandes universités chinoises, garantissant l'accès à des bourses gouvernementales d'excellence." },
    { year: "2024", title: "Digitalisation & Transitaire", desc: "Lancement de notre service de suivi logistique automatisé et renforcement de notre flotte transitaire maritime pour des imports 100% sécurisés." }
  ];

  const officesList = [
    { flag: "\u{1F1F9}\u{1F1EC}", title: "Easy China Lomé", query: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Lomé, Togo", "WhatsApp: +228 90 61 92 88 / +228 99 51 37 18", "services@easychina.online"] },
    { flag: "\u{1F1E8}\u{1F1F3}", title: "Guangzhou Permanent", query: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=800&h=400&q=80", lines: ["Guangzhou CBD & Yiwu City", "Sourcing direct, inspection logistique", "Présence physique permanente"] }
  ];

  return (
    <div>
      <HeroSection goTo={goTo} />

      <PaysCouverts />

      {/* Services Grid */}
      <div style={{ padding: "var(--space-section) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <SectionTitle eyebrow={t("svc_eyebrow")} title={t("svc_title")} subtitle={t("svc_subtitle")} />
          <div className="grid-3">
            {services.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08}>
                <GlassCard tilt style={{ height: "100%", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
                  {/* Photo */}
                  <div className="zoom-container" style={{ height: 200, position: "relative" }}>
                    <Img src={UNSPLASH_REAL[s.cat] || UNSPLASH[s.cat]} alt={s.title} style={{ borderRadius: 0, height: "100%" }} className="zoom-img" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45))" }} />
                  </div>
                  {/* Body */}
                  <div style={{ padding: "var(--space-8)", flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius-sm)",
                      background: "var(--accent-soft)", color: "var(--accent)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{s.icon}</div>
                    <h3 style={{ fontSize: "var(--text-md)", color: "var(--text)", fontWeight: 700, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--muted)", lineHeight: 1.65, flex: 1 }}>{s.text}</p>
                    <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))} style={{ width: "100%", marginTop: "auto" }}>
                      {s.cta} <ArrowRight size={14}/>
                    </GoldenBtn>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <ProcessusSection />

      <ServicesComplementaires />

      {/* Tourisme & Business Section */}
      <div style={{ background: 'var(--surface-alt)', borderTop: `1px solid var(--border)`, borderBottom: `1px solid var(--border)`, padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <div className="grid-50-50" style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <ScrollReveal direction="left" delay={0.1}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "var(--text-xs)", color: 'var(--accent)', letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.8rem" }}>{t("tour_eyebrow")}</div>
              <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
                {t("tour_title")}
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: "1.2rem", fontSize: "var(--text-base)" }}>
                {t("tour_p1")}
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: "2rem", fontSize: "var(--text-base)" }}>
                {t("tour_p2")}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
                {(t("tour_tags") || []).map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <GlassCard tilt={true} style={{ padding: "2.5rem", textAlign: "center", background: "rgba(201, 48, 44,0.02)" }}>
              <div style={{ height: 250, marginBottom: "2rem", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <Img src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=800&h=600&q=80" alt="Canton Tower Guangzhou" style={{ height: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {["\u{1F1E8}\u{1F1F3} Guangzhou", "\u{1F1E8}\u{1F1F3} Yiwu", "\u{1F1F9}\u{1F1EC} Lomé", "\u{1F1E8}\u{1F1EE} Abidjan", "\u{1F1F8}\u{1F1F3} Dakar"].map(c => (
                  <CityPill key={c}>{c}</CityPill>
                ))}
              </div>
              <p style={{ color: 'var(--muted)', fontSize: "var(--text-sm)", marginTop: "1.5rem", fontStyle: "italic" }}>
                {t("tour_note")}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      {/* Timeline Section */}
      <div style={{ padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("hist_eyebrow")} title={t("hist_title")} subtitle={t("hist_subtitle")} />
        <Timeline items={historyItems} />
      </div>

      <SecteursSection />

      {/* Testimonials Section */}
      <div style={{ background: 'var(--surface-alt)', borderTop: `1px solid var(--border)`, borderBottom: `1px solid var(--border)`, padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("test_eyebrow")} title={t("test_title")} subtitle={t("test_subtitle")} />
        <TestimonialCarousel />
      </div>

      <PremiumServices />

      {/* Bureaux Section */}
      <div style={{ padding: "var(--space-section) var(--gutter)", maxWidth: "var(--container)", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("off_eyebrow")} title={t("off_title")} />
        <div className="grid-3" style={{justifyContent: "center"}}>
          {officesList.map((b, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <GlassCard tilt={true} style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                <div style={{ height: 140 }}>
                  <Img src={b.query} alt={b.title} style={{ borderRadius: "0px", height: "100%" }} />
                </div>
                <div style={{ padding: "2rem", textAlign: "left" }}>
                  <h3 style={{ color: 'var(--accent)', marginBottom: "1rem", fontSize: "var(--text-md)", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{b.flag}</span> {b.title}
                  </h3>
                  {b.lines.map((l, j) => (
                    <p key={j} style={{ fontSize: "var(--text-sm)", color: 'var(--muted)', lineHeight: 1.6, marginBottom: 4 }}>{l}</p>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div style={{
        background: `linear-gradient(135deg, var(--secondary) 0%, #0f1f40 50%, var(--accent-strong) 100%)`,
        padding: "var(--space-section) var(--gutter)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        zIndex: 2,
      }}>
        {/* Decorative elements */}
        <div className="animate-float" style={{
          position: "absolute", left: "-8%", top: "-25%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,48,44,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="animate-float-delay" style={{
          position: "absolute", right: "-6%", bottom: "-20%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,48,44,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 650, margin: "0 auto" }}>
          <ScrollReveal direction="up" delay={0.1}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              padding: "0.4rem 1rem", borderRadius: "var(--radius-full)",
              fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.7)",
              fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
              marginBottom: "var(--space-6)",
            }}>
              <Zap size={12} /> Commencez maintenant
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, marginBottom: "1.5rem", fontFamily: "var(--font-display)", color: "#fff", lineHeight: 1.15 }}>
              {t("cta_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "var(--text-base)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "50ch", margin: "0 auto 2.5rem" }}>
              {t("cta_subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <GoldenBtn variant="white" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour, je souhaite démarrer un projet d'importation/études avec Easy China."))}>
                <TrendingUp size={18} style={{marginRight: 8}}/> {t("cta_btn")}
              </GoldenBtn>
              <GoldenBtn variant="outline" onClick={() => goTo("catalogue")} style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}>
                <Package size={16} style={{marginRight: 6}}/> Voir le catalogue
              </GoldenBtn>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ padding: "var(--space-section) var(--gutter)", maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionTitle eyebrow={t("faq_eyebrow")} title={t("faq_title")} subtitle={t("faq_subtitle")} />
        <FAQAccordion />
      </div>

      {/* Formulaire de Contact */}
      <div style={{ background: 'var(--surface-alt)', borderTop: `1px solid var(--border)`, padding: "var(--space-section) var(--gutter)", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <SectionTitle eyebrow={t("form_eyebrow")} title={t("form_title")} subtitle={t("form_subtitle")} />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
