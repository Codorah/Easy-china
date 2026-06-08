import { redirect } from "next/navigation";
import { checkPassword, createSession, getSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Connexion | Admin Easy China",
  robots: { index: false, follow: false },
};

async function loginAction(_prev: { error?: string }, formData: FormData) {
  "use server";
  const password = (formData.get("password") as string) ?? "";

  if (!password) return { error: "Mot de passe requis." };

  const ok = checkPassword(password);
  if (!ok) return { error: "Mot de passe incorrect." };

  await createSession();
  redirect("/admin/catalogue");
}

export default async function LoginPage() {
  // Already authenticated → skip login
  const session = await getSession();
  if (session) redirect("/admin/catalogue");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo / header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--color-accent)] text-white mb-5 shadow-[var(--shadow-accent)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-[var(--color-text)] text-[var(--text-xl)]">Administration</h1>
          <p className="text-[var(--color-muted)] text-[var(--text-sm)] mt-1">Easy China — accès sécurisé</p>
        </div>

        <div className="card p-8">
          <AdminLoginForm action={loginAction} />
        </div>
      </div>
    </div>
  );
}
