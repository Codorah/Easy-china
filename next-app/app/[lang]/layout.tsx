import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { VALID_LANGS, getDictionary, type LangCode } from "@/lib/i18n";
import { Nav } from "@/components/server/Nav";
import { Footer } from "@/components/server/Footer";

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!VALID_LANGS.includes(lang as LangCode)) notFound();

  const t = getDictionary(lang as LangCode);

  return (
    <div className="flex flex-col min-h-screen">
      <Nav t={t} lang={lang as LangCode} />
      {/* Offset content below fixed nav */}
      <main className="flex-1 pt-[68px]">{children}</main>
      <Footer t={t} lang={lang as LangCode} />
    </div>
  );
}
