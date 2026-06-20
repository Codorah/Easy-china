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
    "/assets/Gemini_Generated_Image_xwx9mvxwx9mvxwx9.png",
  "Électronique":
    "/assets/Gemini_Generated_Image_d3s4kfd3s4kfd3s4.png",
  "Textile":
    "/assets/Gemini_Generated_Image_w9yn2pw9yn2pw9yn.png",
  "Machines":
    "/assets/Gemini_Generated_Image_pi23pcpi23pcpi23.png",
  "Alimentaire":
    "/assets/Gemini_Generated_Image_xmd7nxxmd7nxxmd7.png",
  "Autre":
    "/assets/Gemini_Generated_Image_g3jhl3g3jhl3g3jh.png",
};

export const UNSPLASH_REAL: Record<string, string> = {
  "Import":
    "/assets/Gemini_Generated_Image_pi23pcpi23pcpi23.png",
  "Études":
    "/assets/Gemini_Generated_Image_k2dyogk2dyogk2dy.png",
  "Visa":
    "/assets/Gemini_Generated_Image_wfcn48wfcn48wfcn.png",
  "Formation":
    "/assets/Gemini_Generated_Image_tkorddtkorddtkor.png",
  "Tourisme":
    "/assets/Gemini_Generated_Image_73jgmh73jgmh73jg.png",
};
