// @ts-nocheck
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { t, useLang } from "@/i18n";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";

export function FAQAccordion() {
  useLang();
  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {faqs.map((faq, i) => (
        <ScrollReveal key={i} direction="up" delay={i * 0.05}>
          <div style={{
            border: `1px solid ${open === i ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            background: "#fff",
            boxShadow: open === i ? "0 4px 20px rgba(201,48,44,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
          }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "1.3rem 1.8rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "var(--text-base)", color: 'var(--text)', paddingRight: "1rem", lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: open === i ? `linear-gradient(135deg, var(--accent), var(--accent-strong))` : "var(--surface-alt)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.15s, background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
              }}>
                <ChevronDown size={16}
                  color={open === i ? "#fff" : "var(--muted)"}
                  style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
                />
              </span>
            </button>
            {open === i && (
              <div style={{ padding: "0 1.8rem 1.4rem", animation: "pageEnter 0.25s ease" }}>
                <p style={{ color: 'var(--muted)', fontSize: "var(--text-sm)", lineHeight: 1.75, borderTop: `1px solid var(--border)`, paddingTop: "1rem" }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
