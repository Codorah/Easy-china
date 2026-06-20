import type { Article, EquipeMember, Realisation } from "@/types";

// ─── SEED DEFAULT DATA ───────────────────────────────────────────────────────

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: "1",
    titre: "Machines de Pressing Industriel",
    prix: "À partir de 1,200 USD",
    desc: "Sourcing et livraison de lignes de lavage, séchage et repassage haut de gamme.",
    cat: "Machines",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "2",
    titre: "Lignes d'Éclairage LED Connectées",
    prix: "À partir de 450 USD",
    desc: "Matériel d'éclairage LED haute puissance et basse consommation pour chantiers professionnels.",
    cat: "Électronique",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "3",
    titre: "Textile de Lin & Soie Premium",
    prix: "À partir de 3 USD / m",
    desc: "Importation directe de rouleaux de textiles nobles depuis les meilleurs tisseurs de Zhejiang.",
    cat: "Textile",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "4",
    titre: "Automates de Conditionnement Alimentaire",
    prix: "À partir de 2,400 USD",
    desc: "Machines de scellage, emballage et étiquetage de précision pour le secteur agroalimentaire.",
    cat: "Machines",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "5",
    titre: "Pompes Solaires Agricoles Haute Efficacité",
    prix: "À partir de 800 USD",
    desc: "Systèmes d'irrigation alimentés par énergie solaire, idéaux pour les exploitations agricoles.",
    cat: "Import général",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&h=400&q=80",
  },
];

export const DEFAULT_EQUIPE: EquipeMember[] = [
  {
    id: "1",
    nom: "David",
    poste: "Fondateur & Responsable Pôle Afrique de l'Ouest",
    bio: "Passionné par les échanges sino-africains depuis plus de 10 ans, David a fondé Easy China après plusieurs années passées à Guangzhou. Il supervise les opérations commerciales, les partenariats stratégiques et les négociations directes avec les usines chinoises. Présent aussi bien en Chine qu'au Togo, il assure la liaison permanente entre les deux continents.",
    contact: "+86 198 7610 5148 / +228 93 85 90 60",
    email: "services@easychina.online",
    specialites:
      "Import & Logistique,Partenariats Chine,Négociations B2B,Coordination Afrique-Chine",
    image: "/equipe/david fondateur et responsable pole afrique.jpg",
  },
  {
    id: "2",
    nom: "Cici",
    poste: "Responsable Logistique",
    bio: "Basée à Guangzhou, Cici gère l'ensemble de la chaîne logistique depuis les ports de Guangzhou et Yiwu jusqu'au port de Lomé. Elle supervise le sourcing, l'inspection qualité en usine, le groupage maritime et le dédouanement. Sa maîtrise du mandarin et du français assure une communication fluide avec les fournisseurs chinois.",
    contact: "+86 136 1786 5572",
    email: "services@easychina.online",
    specialites:
      "Fret Maritime,Dédouanement,Inspection Qualité,Sourcing Usines",
    image: "/equipe/cici reponsable logistique.jpg",
  },
];

export const DEFAULT_REALISATIONS: Realisation[] = [
  {
    id: "1",
    titre: "Importation de 12 Tonnes de Textile",
    cat: "Import",
    desc: "Sourcing minutieux, contrôle qualité en usine et acheminement maritime sécurisé jusqu'au port de Lomé.",
    client: "Mme Ablavi T.",
    temoignage:
      "Easy China a pris en charge toute la chaîne logistique et les douanes. Zéro tracas, service parfait !",
    stars: "5",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "2",
    titre: "15 Bourses Complètes en Ingénierie",
    cat: "Études",
    desc: "Accompagnement administratif, dépôt de dossier consulaire et admission de 15 brillants étudiants à Pékin.",
    client: "M. Koffi L.",
    temoignage:
      "Grâce à leur expertise, mon fils a intégré Tsinghua avec une bourse d'excellence gouvernementale.",
    stars: "5",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "3",
    titre: "Lancement d'une Blanchisserie Moderne",
    cat: "Formation",
    desc: "Livraison, configuration technique de pressing industriel et cycle complet de formation des équipes à Lomé.",
    client: "M. Kodjo A.",
    temoignage:
      "Les machines importées sont d'une efficacité incroyable. Le support technique est irréprochable.",
    stars: "5",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&h=400&q=80",
  },
  {
    id: "4",
    titre: "Délégation d'Affaires - Visas Express",
    cat: "Visa",
    desc: "Montage des dossiers consulaires et obtention accélérée de visas d'affaires pour une visite d'usine à Guangzhou.",
    client: "M. Yao K.",
    temoignage:
      "Visa obtenu en moins de 10 jours ouvrés. Notre mission commerciale en Chine a été une réussite totale.",
    stars: "5",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109db05?auto=format&fit=crop&w=600&h=400&q=80",
  },
];
