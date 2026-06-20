// @ts-nocheck
import { useEffect } from "react";

const SEO_PAGES = {
  accueil: {
    title: "Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone",
    desc: "Easy China : votre agence de référence entre l'Afrique et la Chine. Import direct Guangzhou & Yiwu, inscription université chinoise avec bourses, visa Chine rapide, formation professionnelle, tourisme & affaires. Présents dans 15 pays africains.",
    keywords: "import chine afrique, importation guangzhou afrique, université chine inscription, bourse études chine afrique, visa chine afrique, tourisme voyage chine, voyage affaires chine, formation professionnelle chine, sourcing guangzhou yiwu, easy china lomé, transitaire chine afrique, logistique chine afrique, dédouanement afrique ouest, marché yiwu achat, agent import chine, import chine togo bénin côte d'ivoire sénégal cameroun",
    url: "https://easychina.online/",
  },
  catalogue: {
    title: "Catalogue Import Direct Chine – Machines, Textile, Électronique | Easy China Afrique",
    desc: "Importez directement depuis la Chine au meilleur prix : machines industrielles pressing & blanchisserie, électronique LED, textile soie & lin, équipements solaires, agroalimentaires. Sourcing Guangzhou et Yiwu livré en Afrique.",
    keywords: "catalogue import chine, machines pressing chine, blanchisserie industrielle chine, électronique LED chine afrique, textile soie lin import, machines industrielles afrique, sourcing guangzhou, yiwu marché achat, importateur afrique chine, fournisseur chine direct, prix usine chine",
    url: "https://easychina.online/#catalogue",
  },
  realisations: {
    title: "Réalisations & Témoignages Clients – Easy China | Import, Études, Visa Afrique",
    desc: "Nos succès en images : conteneurs importés depuis Guangzhou livrés en Afrique, étudiants boursiers dans les meilleures universités chinoises, ouvertures de blanchisseries professionnelles, visas obtenus en 10 jours. Témoignages clients Easy China.",
    keywords: "témoignages easy china, réalisations import chine afrique, bourses université chine avis, blanchisserie chine formation, visa chine 10 jours, client easy china afrique, importation réussie chine afrique",
    url: "https://easychina.online/#realisations",
  },
  equipe: {
    title: "Notre Équipe d'Experts Chine-Afrique | Easy China – Lomé & Guangzhou",
    desc: "Rencontrez l'équipe Easy China : directeur général basé à Guangzhou, responsable académique ancienne boursière Wuhan, expert logistique transit maritime. Votre pont humain entre l'Afrique et la Chine.",
    keywords: "équipe easy china, expert import chine afrique, agent universitaire chine afrique, transitaire maritime afrique chine, contact easy china, bureau lomé guangzhou",
    url: "https://easychina.online/#equipe",
  },
};

export function SEOHead({ page }) {
  useEffect(() => {
    const seo = SEO_PAGES[page] || SEO_PAGES.accueil;
    const SITE = "https://easychina.online";
    const OG_IMG = `${SITE}/og-cover.jpg`;

    document.title = seo.title;

    const setMeta = (name, val, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", val);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", href);
    };

    // Standard SEO
    setMeta("description", seo.desc);
    setMeta("keywords", seo.keywords);
    setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("author", "Easy China Services");
    setMeta("language", "French");
    setMeta("geo.region", "TG");
    setMeta("geo.placename", "Lomé, Togo");

    // Canonical
    setLink("canonical", seo.url || SITE);

    // Open Graph
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Easy China Services", true);
    setMeta("og:locale", "fr_FR", true);
    setMeta("og:title", seo.title, true);
    setMeta("og:description", seo.desc, true);
    setMeta("og:url", seo.url || SITE, true);
    setMeta("og:image", OG_IMG, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", "Easy China – Agence Chine-Afrique", true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.desc);
    setMeta("twitter:image", OG_IMG);
    setMeta("twitter:image:alt", "Easy China – Agence Chine-Afrique");

    // JSON-LD Structured Data
    let script = document.getElementById("jsonld-schema");
    if (!script) { script = document.createElement("script"); script.id = "jsonld-schema"; script.type = "application/ld+json"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `${SITE}/#business`,
          "name": "Easy China Services",
          "alternateName": "Easy China",
          "description": "Agence de liaison commerciale et académique internationale spécialisée dans l'import depuis la Chine, l'inscription dans les universités chinoises, l'obtention de visas, la formation professionnelle et le tourisme d'affaires.",
          "url": SITE,
          "logo": `${SITE}/favicon.svg`,
          "image": OG_IMG,
          "telephone": "+8619876105148",
          "email": "services@easychina.online",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Quartier Hédzranawoé",
            "addressLocality": "Lomé",
            "addressCountry": "TG"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": 6.1375, "longitude": 1.2123 },
          "areaServed": [
            { "@type": "Country", "name": "Togo" },
            { "@type": "Country", "name": "Bénin" },
            { "@type": "Country", "name": "Côte d'Ivoire" },
            { "@type": "Country", "name": "Sénégal" },
            { "@type": "Country", "name": "Cameroun" },
            { "@type": "Country", "name": "Gabon" },
            { "@type": "Country", "name": "Congo" },
            { "@type": "Country", "name": "Mali" },
            { "@type": "Country", "name": "Burkina Faso" },
            { "@type": "Country", "name": "Chine" },
            { "@type": "Country", "name": "La Réunion" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Services Easy China",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Import & Logistique depuis la Chine", "description": "Sourcing produits en Chine, inspection qualité usine, transport maritime, dédouanement en Afrique de l'Ouest." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Inscription Université Chinoise & Bourses", "description": "Admission dans les universités chinoises, dossier bourse gouvernementale, accompagnement complet." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Visa Chine", "description": "Obtention visa Chine touristique, affaires, études et travail depuis l'Afrique francophone." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formation Professionnelle en Chine", "description": "Formations techniques en Chine : pressing, blanchisserie industrielle, maintenance machines." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tourisme & Voyage d'Affaires en Chine", "description": "Organisation de voyages d'affaires à Guangzhou et Yiwu, visites d'usines, circuits touristiques." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Traduction & Interprétariat", "description": "Interprétariat en usine et en affaires, traduction de contrats, accompagnement culturel en Chine." } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Consulting Business & Investissement", "description": "Étude de marché en Chine, création de société, mise en conformité légale, analyse d'investissement." } }
            ]
          },
          "sameAs": [],
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        },
        {
          "@type": "WebSite",
          "@id": `${SITE}/#website`,
          "url": SITE,
          "name": "Easy China Services",
          "description": seo.desc,
          "inLanguage": "fr-FR",
          "publisher": { "@id": `${SITE}/#business` }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Comment importer des marchandises depuis la Chine vers le Togo ?", "acceptedAnswer": { "@type": "Answer", "text": "Easy China gère l'intégralité du processus : identification des fournisseurs certifiés, inspection qualité en usine à Guangzhou ou Yiwu, groupage maritime, dédouanement au port de Lomé." } },
            { "@type": "Question", "name": "Quels sont les délais pour obtenir un visa Chine depuis le Togo ?", "acceptedAnswer": { "@type": "Answer", "text": "Avec notre service visa express, vous obtenez votre visa touristique ou d'affaires en 7 à 15 jours ouvrés." } },
            { "@type": "Question", "name": "Comment s'inscrire dans une université chinoise et obtenir une bourse ?", "acceptedAnswer": { "@type": "Answer", "text": "Notre responsable académique vous accompagne de A à Z : choix de l'université, dépôt des dossiers d'admission, demande de bourse gouvernementale CSC, obtention du visa étudiant et installation en Chine." } },
            { "@type": "Question", "name": "Quels produits puis-je importer depuis la Chine avec Easy China ?", "acceptedAnswer": { "@type": "Answer", "text": "Nous importons tous types de marchandises : machines industrielles (pressing, blanchisserie, conditionnement alimentaire), électronique LED, textile, équipements agricoles, mobilier, et bien plus." } },
            { "@type": "Question", "name": "Easy China est-elle réellement présente en Chine ?", "acceptedAnswer": { "@type": "Answer", "text": "Oui, nos équipes sont physiquement implantées à Guangzhou (Guangdong) et à Yiwu (Zhejiang), les deux capitales mondiales du commerce de gros." } }
          ]
        }
      ]
    });
  }, [page]);

  return null;
}
