import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import { LenisProvider } from "@/components/client/LenisProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

const BASE_URL = "https://easychina-services.com";
const OG_IMAGE = `${BASE_URL}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Easy China â€“ Import, UniversitÃ©, Visa & Tourisme Chine | Afrique Francophone",
    template: "%s | Easy China",
  },
  description:
    "Easy China : votre agence de rÃ©fÃ©rence entre l'Afrique et la Chine. Import direct Guangzhou & Yiwu, universitÃ©, visa, formation. PrÃ©sents dans 15 pays africains.",
  keywords: ["import Chine", "Afrique", "visa Chine", "universitÃ© Chine", "Guangzhou", "Yiwu", "Easy China"],
  authors: [{ name: "Easy China" }],
  creator: "Easy China",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Easy China",
    title: "Easy China â€“ Import, UniversitÃ©, Visa & Tourisme Chine",
    description:
      "Votre agence de rÃ©fÃ©rence entre l'Afrique et la Chine. Import direct, universitÃ©, visa, formation. PrÃ©sents dans 15 pays africains.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Easy China" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy China â€“ Import, UniversitÃ©, Visa & Tourisme Chine",
    description:
      "Votre agence de rÃ©fÃ©rence entre l'Afrique et la Chine. Import direct, universitÃ©, visa, formation.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${syne.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        {/* Skip-to-content for keyboard/screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-[var(--radius-md)] focus:bg-[var(--color-accent)] focus:text-white focus:font-bold focus:text-[var(--text-sm)]"
        >
          Aller au contenu
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

