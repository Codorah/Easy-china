import type React from "react";

export interface Article {
  id: string;
  titre: string;
  prix: string;
  desc: string;
  cat: string;
  image: string;
}

export interface Realisation {
  id: string;
  titre: string;
  desc: string;
  cat: string;
  client: string;
  temoignage: string;
  stars: string;
  image: string;
}

export interface EquipeMember {
  id: string;
  nom: string;
  poste: string;
  bio: string;
  contact: string;
  email: string;
  specialites: string;
  image: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

export interface Service {
  icon: React.ReactNode;
  cat: string;
  title: string;
  text: string;
  cta: string;
  msg: string;
}
