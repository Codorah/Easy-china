import { requireAuth } from "@/lib/auth";
import { getEquipe, type TeamMember } from "@/lib/data";
import { ghCommit } from "@/lib/github";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { AdminEquipeView } from "@/components/admin/AdminEquipeView";

export const metadata = { title: "Ã‰quipe | Admin" };

const DATA_FILE = path.join(process.cwd(), "public", "data", "equipe.json");
const GH_PATH   = "next-app/public/data/equipe.json";

async function writeData(items: TeamMember[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  await ghCommit(GH_PATH, items, "chore: update equipe via admin panel");
  revalidatePath("/[lang]/equipe", "page");
}

async function saveItem(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  "use server";
  await requireAuth();

  const id       = (formData.get("id") as string) || "";
  const name     = (formData.get("name") as string | null)?.trim() ?? "";
  const role     = (formData.get("role") as string | null)?.trim() ?? "";
  const bio      = (formData.get("bio") as string | null)?.trim() ?? "";
  const image    = (formData.get("image") as string | null)?.trim() ?? "";
  const whatsapp = (formData.get("whatsapp") as string | null)?.trim() ?? "";
  const linkedin = (formData.get("linkedin") as string | null)?.trim() ?? "";

  if (!name) return { error: "Le nom est requis." };
  if (!role) return { error: "Le poste est requis." };
  if (image && !image.startsWith("https://")) return { error: "L'image doit Ãªtre une URL https://â€¦" };

  const items = await getEquipe();

  if (id) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], name, role, bio, image, whatsapp, linkedin };
  } else {
    items.push({ id: Date.now().toString(), name, role, bio, image, whatsapp, linkedin });
  }

  await writeData(items);
  return {};
}

async function deleteItem(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  "use server";
  await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { error: "ID manquant." };
  const items = (await getEquipe()).filter((i) => i.id !== id);
  await writeData(items);
  return {};
}

export default async function AdminEquipePage() {
  await requireAuth();
  const members = await getEquipe();
  return <AdminEquipeView items={members} saveAction={saveItem} deleteAction={deleteItem} />;
}

