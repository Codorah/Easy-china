import sharp from "sharp";
import { readdir, mkdir, writeFile } from "fs/promises";
import { join, basename, extname } from "path";

const ASSETS_DIR = "public/assets";
const EQUIPE_DIR = "public/equipe";
const WIDTHS = [480, 1024, 1920];
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 55;

async function optimizeDir(dir) {
  const manifest = {};
  let files;
  try {
    files = await readdir(dir);
  } catch {
    return manifest;
  }

  const images = files.filter((f) =>
    /\.(png|jpg|jpeg)$/i.test(f) && !f.includes("_480w") && !f.includes("_1024w") && !f.includes("_1920w")
  );

  for (const file of images) {
    const src = join(dir, file);
    const name = basename(file, extname(file));
    const entry = { avif: {}, webp: {}, fallback: `/${dir}/${file}`, widths: WIDTHS };

    for (const w of WIDTHS) {
      const webpName = `${name}_${w}w.webp`;
      const avifName = `${name}_${w}w.avif`;

      try {
        await sharp(src).resize(w, null, { withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(join(dir, webpName));
        entry.webp[w] = `/${dir}/${webpName}`;
      } catch (e) {
        console.warn(`  WebP ${w}w failed for ${file}:`, e.message);
      }

      try {
        await sharp(src).resize(w, null, { withoutEnlargement: true }).avif({ quality: AVIF_QUALITY }).toFile(join(dir, avifName));
        entry.avif[w] = `/${dir}/${avifName}`;
      } catch (e) {
        console.warn(`  AVIF ${w}w failed for ${file}:`, e.message);
      }
    }

    manifest[`/${dir}/${file}`] = entry;
    console.log(`  ✓ ${file} → ${Object.keys(entry.webp).length} WebP + ${Object.keys(entry.avif).length} AVIF`);
  }

  return manifest;
}

async function main() {
  console.log("Optimizing images...\n");

  const assetsManifest = await optimizeDir(ASSETS_DIR);
  const equipeManifest = await optimizeDir(EQUIPE_DIR);
  const manifest = { ...assetsManifest, ...equipeManifest };

  await writeFile(
    join(ASSETS_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  const count = Object.keys(manifest).length;
  console.log(`\n✅ ${count} images optimized. Manifest written to ${ASSETS_DIR}/manifest.json`);
}

main().catch(console.error);
