// ── Server-only data reader ──────────────────────────────────────────────────
// Reads JSON from public/data/ via the filesystem (never via HTTP fetch).
// Only call these in Server Components, Server Actions, or route handlers.

import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data");

async function read<T>(filename: string): Promise<T> {
  const file = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

// ── Shape types ──────────────────────────────────────────────────────────────

export interface CatalogueItem {
  id: string;
  name: string;
  category: string;
  price?: string;
  unit?: string;
  minOrder?: string;
  image?: string;
  description?: string;
  tags?: string[];
}

export interface Realisation {
  id: string;
  title: string;
  category: string;
  description?: string;
  image?: string;
  date?: string;
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  whatsapp?: string;
  linkedin?: string;
}

// ── Public getters ───────────────────────────────────────────────────────────

export const getCatalogue   = () => read<CatalogueItem[]>("catalogue.json");
export const getRealisations = () => read<Realisation[]>("realisations.json");
export const getEquipe      = () => read<TeamMember[]>("equipe.json");
