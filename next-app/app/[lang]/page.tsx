import type { Metadata } from "next";
import { getDictionary, getStaticLangParams, LANGS, type LangCode } from "@/lib/i18n";
import { HeroSection } from "@/components/server/HeroSection";
import { ServicesSection } from "@/components/server/ServicesSection";
import { PremiumSection } from "@/components/server/PremiumSection";
import { ProcessSection } from "@/components/server/ProcessSection";
import { CtaSection } from "@/components/server/CtaSection";
import { JsonLd } from "@/components/server/JsonLd";

const BASE_URL = "https://easychina-services.com";
const OG_IMAGE = `${BASE_URL}/og.png`;

interface Props { params: Promise<{ lang: string }> }

export function generateStaticParams() { return getStaticLangParams(); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);

  const languages: Record<string, string> = {};
  for (const l of LANGS) {
    languages[l.hreflang] = `${BASE_URL}/${l.code}`;
  }

  const ogLocale = lang === "fr" ? "fr_FR" : lang === "en" ? "en_US" : "zh_CN";
  const altLocales = LANGS.filter((l) => l.code !== lang).map((l) =>
    l.code === "fr" ? "fr_FR" : l.code === "en" ? "en_US" : "zh_CN"
  );

  return {
    title: "Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone",
    description: t.hero_desc,
    alternates: { canonical: `${BASE_URL}/${lang}`, languages },
    openGraph: {
      type: "website",
      url: `${BASE_URL}/${lang}`,
      title: "Easy China – Import, Université, Visa & Tourisme Chine",
      description: t.hero_desc,
      locale: ogLocale,
      alternateLocale: altLocales,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Easy China" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Easy China – Import, Université, Visa & Tourisme Chine",
      description: t.hero_desc,
      images: [OG_IMAGE],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const t = getDictionary(lang as LangCode);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Easy China",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description: t.hero_desc,
    areaServed: "Africa",
    knowsLanguage: ["fr", "zh", "en"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "Chinese", "English"],
    },
    sameAs: [],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/${lang}`,
    url: `${BASE_URL}/${lang}`,
    name: "Easy China – Import, Université, Visa & Tourisme Chine",
    description: t.hero_desc,
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Easy China" },
  };

  return (
    <>
      <JsonLd data={[orgJsonLd, webPageJsonLd]} />
      <HeroSection t={t} lang={lang as LangCode} />
      <ServicesSection t={t} />
      <PremiumSection t={t} />
      <ProcessSection t={t} />
      <CtaSection t={t} />
    </>
  );
}
