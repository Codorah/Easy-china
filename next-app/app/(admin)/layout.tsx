import type { ReactNode } from "react";

export const metadata = {
  title: { default: "Admin | Easy China", template: "%s | Easy China Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)]">
      {children}
    </div>
  );
}
