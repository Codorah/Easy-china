"use client";
import { useActionState } from "react";

interface Props {
  action: (_prev: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
}

export function AdminLoginForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="password" className="block text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-2">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] text-[var(--text-sm)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-[var(--text-sm)] text-red-600 font-medium bg-red-50 px-4 py-2.5 rounded-[var(--radius-md)] border border-red-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 px-6 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-sm)] shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
