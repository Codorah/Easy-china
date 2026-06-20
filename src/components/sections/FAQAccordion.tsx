// @ts-nocheck
import { t, useLang } from "@/i18n";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQAccordion() {
  useLang();
  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
  ];

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <ScrollReveal key={i} direction="up" delay={i * 0.05}>
          <AccordionItem value={`faq-${i}`} className="border border-border rounded-md bg-white overflow-hidden data-[state=open]:border-accent data-[state=open]:shadow-md">
            <AccordionTrigger className="px-6 py-4 text-base font-bold text-text hover:no-underline [&>svg]:w-5 [&>svg]:h-5 [&>svg]:rounded-full [&>svg]:bg-surface-alt [&>svg]:p-1 data-[state=open]:[&>svg]:bg-gradient-to-br data-[state=open]:[&>svg]:from-accent data-[state=open]:[&>svg]:to-accent-strong data-[state=open]:[&>svg]:text-white">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-sm text-muted leading-relaxed border-t border-border pt-3">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        </ScrollReveal>
      ))}
    </Accordion>
  );
}
