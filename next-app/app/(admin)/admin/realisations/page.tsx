import { requireAuth } from "@/lib/auth";
import { getRealisations, type Realisation } from "@/lib/data";
import { ghCommit } from "@/lib/github";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { AdminRealisationsView } from "@/components/admin/AdminRealisationsView";

export const metadata = { title: "Réalisations | Admin" };

const DATA_FILE = path.join(process.cwd(), "public", "data", "realisations.json");
const GH_PATH   = "next-app/public/data/realisations.json";

async function writeData(items: Realisation[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  await ghCommit(GH_PATH, items, "chore: update realisations via admin panel");
  revalidatePath("/[lang]/realisations", "page");
}

async function saveItem(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  "use server";
  await requireAuth();

  const id          = (formData.get("id") as string) || "";
  const title       = (formData.get("title") as string | null)?.trim() ?? "";
  const category    = (formData.get("category") as string) || "Import";
  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const image       = (formData.get("image") as string | null)?.trim() ?? "";
  const date        = (formData.get("date") as string | null)?.trim() ?? "";
  const tagsRaw     = (formData.get("tags") as string | null)?.trim() ?? "";

  if (!title) return { error: "Le titre est requis." };
  if (image && !image.startsWith("https://")) return { error: "L'image doit être une URL https://…" };

  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const items = await getRealisations();

  if (id) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], title, category, description, image, date, tags };
  } else {
    items.push({ id: Date.now().toString(), title, category, description, image, date, tags });
  }

  await writeData(items);
  return {};
}

async function deleteItem(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  "use server";
  await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { error: "ID manquant." };
  const items = (await getRealisations()).filter((i) => i.id !== id);
  await writeData(items);
  return {};
}

export default async function AdminRealisationsPage() {
  await requireAuth();
  const items = await getRealisations();
  return <AdminRealisationsView items={items} saveAction={saveItem} deleteAction={deleteItem} />;
}
