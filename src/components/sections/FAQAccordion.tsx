// @ts-nocheck
import { t, useLang } from "@/i18n";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/primitives/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <Accordion type="single" collapsible className="flex flex-col gap-4">
      {faqs.map((faq, i) => (
        <ScrollReveal key={i} direction="up" delay={i * 0.05}>
          <AccordionItem
            value={`faq-${i}`}
            className={cn(
              "border border-border rounded-xl bg-white overflow-hidden",
              "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
              "data-[state=open]:border-accent data-[state=open]:shadow-lg data-[state=open]:shadow-accent/5"
            )}
          >
            <AccordionTrigger
              className={cn(
                "px-7 py-5 text-[1.05rem] font-bold text-text hover:no-underline",
                "transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:rounded-full",
                "[&>svg]:bg-surface-alt [&>svg]:p-1",
                "[&>svg]:transition-all [&>svg]:duration-700 [&>svg]:ease-[cubic-bezier(0.32,0.72,0,1)]",
                "data-[state=open]:[&>svg]:bg-gradient-to-br data-[state=open]:[&>svg]:from-accent data-[state=open]:[&>svg]:to-accent-strong data-[state=open]:[&>svg]:text-white"
              )}
            >
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="px-7 pb-5 text-sm text-muted leading-relaxed border-t border-border pt-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        </ScrollReveal>
      ))}
    </Accordion>
  );
}
