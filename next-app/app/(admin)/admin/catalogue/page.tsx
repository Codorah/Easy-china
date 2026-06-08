import { requireAuth } from "@/lib/auth";
import { getCatalogue, type CatalogueItem } from "@/lib/data";
import { ghCommit } from "@/lib/github";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { AdminCatalogueView } from "@/components/admin/AdminCatalogueView";

export const metadata = { title: "Catalogue | Admin" };

// â”€â”€ File path for local writes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DATA_FILE = path.join(process.cwd(), "public", "data", "catalogue.json");
const GH_PATH   = "next-app/public/data/catalogue.json";

async function writeData(items: CatalogueItem[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  await ghCommit(GH_PATH, items, "chore: update catalogue via admin panel");
  revalidatePath("/[lang]/catalogue", "page");
}

// â”€â”€ Server Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function saveItem(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  "use server";
  await requireAuth();

  const id   = (formData.get("id") as string) || "";
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const category  = (formData.get("category") as string)  || "Machines";
  const price     = (formData.get("price") as string | null)?.trim() ?? "";
  const unit      = (formData.get("unit") as string | null)?.trim() ?? "";
  const minOrder  = (formData.get("minOrder") as string | null)?.trim() ?? "";
  const image     = (formData.get("image") as string | null)?.trim() ?? "";
  const description = (formData.get("description") as string | null)?.trim() ?? "";

  if (!name) return { error: "Le nom du produit est requis." };
  if (image && !image.startsWith("https://")) return { error: "L'image doit Ãªtre une URL https://â€¦" };

  const items = await getCatalogue();

  if (id) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], name, category, price, unit, minOrder, image, description };
    }
  } else {
    items.push({ id: Date.now().toString(), name, category, price, unit, minOrder, image, description });
  }

  await writeData(items);
  return {};
}

async function deleteItem(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  "use server";
  await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return { error: "ID manquant." };

  const items = (await getCatalogue()).filter((i) => i.id !== id);
  await writeData(items);
  return {};
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default async function AdminCataloguePage() {
  await requireAuth();
  const items = await getCatalogue();
  return (
    <AdminCatalogueView
      items={items}
      saveAction={saveItem}
      deleteAction={deleteItem}
    />
  );
}

