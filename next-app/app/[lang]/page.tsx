import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, LANGS, type LangCode } from "@/lib/i18n";
import { HeroSection } from "@/components/server/HeroSection";
import { ServicesSection } from "@/components/server/ServicesSection";
import { PremiumSection } from "@/components/server/PremiumSection";
import { ProcessSection } from "@/components/server/ProcessSection";
import { CtaSection } from "@/components/server/CtaSection";

interface Props {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return getStaticLangParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);

  const languages: Record<string, string> = {};
  for (const l of LANGS) {
    languages[l.hreflang] = `https://easychina-services.com/${l.code}`;
  }

  return {
    title: "Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone",
    description: t.hero_desc,
    alternates: {
      canonical: `https://easychina-services.com/${lang}`,
      languages,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);

  return (
    <>
      <HeroSection t={t} lang={lang as LangCode} />
      <ServicesSection t={t} />
      <PremiumSection t={t} />
      <ProcessSection t={t} />
      <CtaSection t={t} />
    </>
  );
}
