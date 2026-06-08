import type { Dict } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";

const WA_COMMERCIAL = "+22890000001";
const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

// SVG icons inline — no Lucide import needed in Server Component
const ICONS = {
  ship: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 21c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.3.5 4.4 1.61 6"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 9v4"/>
    </svg>
  ),
  graduation: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  wrench: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  passport: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><circle cx="12" cy="13" r="2"/><path d="M9 17a3 3 0 0 1 6 0"/>
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
    </svg>
  ),
  building: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  plane: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.9.5-1.1 1l-.3 1.3c-.1.5.1 1.1.5 1.4L6 13l-2 3.5c-.1.3-.1.6 0 .9l.3.9c.2.5.6.8 1.1.9L7 19l-.5 2.5c-.1.5.2 1.1.6 1.4.4.2.9.2 1.3-.1L12 21l4.2 2c.5.2 1.1.1 1.5-.3.3-.4.4-1 .1-1.5z"/>
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

interface Props { t: Dict }

export function ServicesSection({ t }: Props) {
  const services = [
    { icon: ICONS.ship,       name: t.svc1_name, desc: t.svc1_desc, img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.graduation, name: t.svc2_name, desc: t.svc2_desc, img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.wrench,     name: t.svc3_name, desc: t.svc3_desc, img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.passport,   name: t.svc4_name, desc: t.svc4_desc, img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.globe,      name: t.svc5_name, desc: t.svc5_desc, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.building,   name: t.svc6_name, desc: t.svc6_desc, img: "https://images.unsplash.com/photo-1565715101539-8cca2c24bf0f?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.plane,      name: t.svc7_name, desc: t.svc7_desc, img: "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=600&h=400&q=80" },
    { icon: ICONS.chat,       name: t.svc8_name, desc: t.svc8_desc, img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&h=400&q=80" },
  ];

  return (
    <section className="section-py" aria-labelledby="services-heading">
      <div className="container-base">
        <SectionHeader
          eyebrow={t.svc_eyebrow}
          title={t.svc_title}
          subtitle={t.svc_subtitle}
        />
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
        >
          {services.map((s) => (
            <li key={s.name} className="card overflow-hidden flex flex-col group">
              {/* Image */}
              <div className="h-44 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  aria-hidden
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5))" }}
                  aria-hidden
                />
                {/* Icon badge */}
                <div
                  className="absolute bottom-0 left-6 translate-y-1/2 w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center text-white shadow-[var(--shadow-accent)]"
                  style={{ background: "var(--color-accent)" }}
                >
                  {s.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 pt-9">
                <h3
                  className="font-display font-bold text-[var(--color-text)] mb-2"
                  style={{ fontSize: "var(--text-md)" }}
                >
                  {s.name}
                </h3>
                <p
                  className="text-[var(--color-muted)] flex-1 mb-5"
                  style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-body)" }}
                >
                  {s.desc}
                </p>
                <a
                  href={waLink(WA_COMMERCIAL, `Bonjour Easy China, je souhaite en savoir plus sur : "${s.name}".`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-accent)] font-semibold text-[var(--text-sm)] hover:gap-2 transition-all"
                >
                  {t.svc_learn}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
