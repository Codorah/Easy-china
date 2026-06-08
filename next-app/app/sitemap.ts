import type { MetadataRoute } from "next";
import { VALID_LANGS } from "@/lib/i18n";

const BASE = "https://easychina-services.com";

const ROUTES = ["", "/catalogue", "/realisations", "/equipe"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of VALID_LANGS) {
    for (const route of ROUTES) {
      entries.push({
        url:              `${BASE}/${lang}${route}`,
        lastModified:     new Date(),
        changeFrequency:  route === "" ? "weekly" : "monthly",
        priority:         route === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            VALID_LANGS.map((l) => [l, `${BASE}/${l}${route}`]),
          ),
        },
      });
    }
  }

  return entries;
}
