// ─── CONSTANTS & CONFIGURATION ───────────────────────────────────────────────

export const WA_COMMERCIAL = "+8619876105148";
export const WA_TRANSITAIRE = "+8619876105148";
export const ADMIN_HASH =
  import.meta.env.VITE_ADMIN_HASH ||
  "6e5349233f2be8ca69d702d25710ca05a515f608ce9f340512774f6c167ec3cb";

export const waLink = (num: string, msg: string): string =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

export const UNSPLASH: Record<string, string> = {
  "Import général":
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&h=400&q=80",
  "Électronique":
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&h=400&q=80",
  "Textile":
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=600&h=400&q=80",
  "Machines":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400&q=80",
  "Alimentaire":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&h=400&q=80",
  "Autre":
    "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=600&h=400&q=80",
};

export const UNSPLASH_REAL: Record<string, string> = {
  "Import":
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&h=400&q=80",
  "Études":
    "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&w=600&h=400&q=80",
  "Visa":
    "https://images.unsplash.com/photo-1436491865332-7a61a109db05?auto=format&fit=crop&w=600&h=400&q=80",
  "Formation":
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&h=400&q=80",
  "Tourisme":
    "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=600&h=400&q=80",
};
