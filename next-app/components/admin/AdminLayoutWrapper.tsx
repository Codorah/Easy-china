"use client";
import { usePathname } from "next/navigation";
import { AdminShell } from "./AdminShell";

interface Props {
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
}

export function AdminLayoutWrapper({ children, logoutAction }: Props) {
  const pathname = usePathname();
  // Login page gets no sidebar shell
  if (pathname === "/admin/login") return <>{children}</>;
  return <AdminShell logoutAction={logoutAction}>{children}</AdminShell>;
}
