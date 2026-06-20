// @ts-nocheck
import { Ship, GraduationCap, Wrench, FileCheck, ArrowRight, Package, TrendingUp, Zap } from "lucide-react";
import { t, useLang } from "@/i18n";
import { WA_COMMERCIAL, UNSPLASH_REAL, UNSPLASH, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { GlassCard } from "@/components/primitives/GlassCard";
import { GoldenBtn } from "@/components/primitives/GoldenBtn";
import { Img } from "@/components/primitives/Img";
import { Tag } from "@/components/primitives/Tag";
import { CityPill } from "@/components/primitives/CityPill";
import { HeroSection } from "@/components/sections/HeroSection";
import { PaysCouverts } from "@/components/sections/PaysCouverts";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
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
    { flag: "\u{1F1F9}\u{1F1EC}", title: "Easy China Lomé", query: "/assets/Gemini_Generated_Image_c0wh7gc0wh7gc0wh.png", lines: ["Lomé, Togo", "WhatsApp: +228 90 61 92 88 / +228 99 51 37 18", "services@easychina.online"] },
    { flag: "\u{1F1E8}\u{1F1F3}", title: "Guangzhou Permanent", query: "/assets/1000073490.jpg", lines: ["Guangzhou CBD & Yiwu City", "Sourcing direct, inspection logistique", "Présence physique permanente"] }
  ];

  return (
    <div>
      <HeroSection goTo={goTo} />

      <PaysCouverts />

      {/* Container Scroll -- port showcase */}
      <ContainerScroll
        titleComponent={
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text">
            Votre import,{" "}
            <span className="bg-gradient-to-r from-accent to-accent-strong bg-clip-text text-transparent">
              de la Chine a l'Afrique
            </span>
          </h2>
        }
      >
        <img
          src="/assets/Gemini_Generated_Image_pi23pcpi23pcpi23.png"
          alt="Port de Guangzhou"
          className="mx-auto rounded-2xl object-cover h-full w-full object-center"
          draggable={false}
        />
      </ContainerScroll>

      {/* Services Grid */}
      <div className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-container mx-auto">
          <SectionTitle eyebrow={t("svc_eyebrow")} title={t("svc_title")} subtitle={t("svc_subtitle")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.08}>
                <GlassCard tilt className="h-full flex flex-col p-0 overflow-hidden">
                  {/* Photo */}
                  <div className="zoom-container h-[200px] relative">
                    <Img src={UNSPLASH_REAL[s.cat] || UNSPLASH[s.cat]} alt={s.title} className="rounded-none h-full zoom-img" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45" />
                  </div>
                  {/* Body */}
                  <div className="p-8 flex-1 flex flex-col gap-4">
                    <div className={cn(
                      "w-11 h-11 rounded-sm",
                      "bg-accent-soft text-accent",
                      "flex items-center justify-center"
                    )}>{s.icon}</div>
                    <h3 className="text-md text-text font-bold leading-tight">{s.title}</h3>
                    <p className="text-sm text-muted leading-relaxed flex-1">{s.text}</p>
                    <GoldenBtn variant="outline" onClick={() => window.open(waLink(WA_COMMERCIAL, s.msg))} className="w-full mt-auto">
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
      <div className="bg-surface-alt border-t border-b border-border py-24 lg:py-32 px-6 lg:px-12 relative z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-container mx-auto">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="text-left">
              <div className="text-xs text-accent tracking-[0.18em] uppercase font-bold mb-3">{t("tour_eyebrow")}</div>
              <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-text leading-tight mb-6 font-display">
                {t("tour_title")}
              </h2>
              <p className="text-muted leading-[1.7] mb-5 text-base">
                {t("tour_p1")}
              </p>
              <p className="text-muted leading-[1.7] mb-8 text-base">
                {t("tour_p2")}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(t("tour_tags") || []).map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              {/* Decorative photos grid */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <div className="rounded-md overflow-hidden h-[120px]">
                  <img src="/assets/1000073489.jpg" alt="Cathédrale de nuit" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-md overflow-hidden h-[120px]">
                  <img src="/assets/1000073491.jpg" alt="Festival de glace" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <GlassCard tilt={true} className="p-10 text-center bg-accent/[0.02]">
              <div className="h-[250px] mb-8 rounded-md overflow-hidden">
                <Img src="/assets/1000073490.jpg" alt="Coucher de soleil en ville" className="h-full" />
              </div>
              <div className="flex justify-center gap-2.5 flex-wrap">
                {["\u{1F1E8}\u{1F1F3} Guangzhou", "\u{1F1E8}\u{1F1F3} Yiwu", "\u{1F1F9}\u{1F1EC} Lomé", "\u{1F1E8}\u{1F1EE} Abidjan", "\u{1F1F8}\u{1F1F3} Dakar"].map(c => (
                  <CityPill key={c}>{c}</CityPill>
                ))}
              </div>
              <p className="text-muted text-sm mt-6 italic">
                {t("tour_note")}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-24 lg:py-32 px-6 lg:px-12 relative z-[2]">
        <SectionTitle eyebrow={t("hist_eyebrow")} title={t("hist_title")} subtitle={t("hist_subtitle")} />
        <Timeline items={historyItems} />
      </div>

      <SecteursSection />

      {/* Testimonials Section */}
      <div className="bg-surface-alt border-t border-b border-border py-24 lg:py-32 px-6 lg:px-12 relative z-[2]">
        <SectionTitle eyebrow={t("test_eyebrow")} title={t("test_title")} subtitle={t("test_subtitle")} />
        <TestimonialCarousel />
      </div>

      <PremiumServices />

      {/* Bureaux Section */}
      <div className="py-24 lg:py-32 px-6 lg:px-12 max-w-container mx-auto relative z-[2]">
        <SectionTitle eyebrow={t("off_eyebrow")} title={t("off_title")} />

        {/* Decorative photo banner */}
        <div className="rounded-lg overflow-hidden mb-10 h-[180px] md:h-[220px] relative">
          <img src="/assets/1000073489.jpg" alt="Nos bureaux" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {officesList.map((b, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <GlassCard tilt={true} className="p-0 overflow-hidden h-full">
                <div className="h-[140px]">
                  <Img src={b.query} alt={b.title} className="rounded-none h-full" />
                </div>
                <div className="p-8 text-left">
                  <h3 className="text-accent mb-4 text-md font-bold flex items-center gap-2">
                    <span>{b.flag}</span> {b.title}
                  </h3>
                  {b.lines.map((l, j) => (
                    <p key={j} className="text-sm text-muted leading-relaxed mb-1">{l}</p>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className={cn(
        "bg-gradient-to-br from-secondary via-[#0f1f40] to-accent-strong",
        "py-32 lg:py-40 px-6 lg:px-12",
        "text-center relative overflow-hidden z-[2]"
      )}>
        {/* Decorative elements */}
        <div className="animate-float absolute -left-[8%] -top-[25%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,48,44,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="animate-float-delay absolute -right-[6%] -bottom-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(201,48,44,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

        <div className="relative z-[3] max-w-[650px] mx-auto">
          <ScrollReveal direction="up" delay={0.1}>
            <div className={cn(
              "inline-flex items-center gap-2",
              "bg-white/[0.08] border border-white/[0.12]",
              "py-1.5 px-4 rounded-full",
              "text-xs text-white/70 font-semibold tracking-[0.12em] uppercase",
              "mb-6"
            )}>
              <Zap size={12} /> Commencez maintenant
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15}>
            <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-6 font-display text-white leading-[1.15]">
              {t("cta_title")}
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-white/65 text-base leading-[1.75] max-w-[50ch] mx-auto mb-10">
              {t("cta_subtitle")}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <div className="flex justify-center gap-3 flex-wrap">
              <GoldenBtn variant="white" onClick={() => window.open(waLink(WA_COMMERCIAL, "Bonjour, je souhaite démarrer un projet d'importation/études avec Easy China."))}>
                <TrendingUp size={18} className="mr-2"/> {t("cta_btn")}
              </GoldenBtn>
              <GoldenBtn variant="outline" onClick={() => goTo("catalogue")} className="border-white/20 text-white">
                <Package size={16} className="mr-1.5"/> Voir le catalogue
              </GoldenBtn>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 lg:py-32 px-6 lg:px-12 max-w-[860px] mx-auto relative z-[2]">
        <SectionTitle eyebrow={t("faq_eyebrow")} title={t("faq_title")} subtitle={t("faq_subtitle")} />
        <FAQAccordion />
      </div>

      {/* Formulaire de Contact */}
      <div className="bg-surface-alt border-t border-border py-24 lg:py-32 px-6 lg:px-12 relative z-[2]">
        <div className="max-w-[580px] mx-auto">
          <SectionTitle eyebrow={t("form_eyebrow")} title={t("form_title")} subtitle={t("form_subtitle")} />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
