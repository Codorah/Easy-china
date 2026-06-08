// Admin home â€” redirects to the catalogue tab by default
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/catalogue");
}

