import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { VALID_LANGS, type LangCode } from "@/lib/i18n";

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

  return (
    <div className="flex flex-col min-h-screen" lang={lang}>
      {/* Nav will be a Server Component wired here in Phase 2 */}
      <main className="flex-1">{children}</main>
      {/* Footer will be a Server Component wired here in Phase 2 */}
    </div>
  );
}
