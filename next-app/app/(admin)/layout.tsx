import type { ReactNode } from "react";
import { destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

export const metadata = {
  title: { default: "Admin | Easy China", template: "%s | Easy China Admin" },
  robots: { index: false, follow: false },
};

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutWrapper logoutAction={logoutAction}>{children}</AdminLayoutWrapper>;
}

