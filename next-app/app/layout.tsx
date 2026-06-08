import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// ── Self-hosted fonts (downloaded at build time, no Google network call) ──
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

export const metadata: Metadata = {
  metadataBase: new URL("https://easychina-services.com"),
  title: {
    default: "Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone",
    template: "%s | Easy China",
  },
  description:
    "Easy China : votre agence de référence entre l'Afrique et la Chine. Import direct Guangzhou & Yiwu, université, visa, formation. Présents dans 15 pays africains.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang set per-segment in [lang]/layout.tsx; root uses fr fallback
    <html
      lang="fr"
      className={`${syne.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
