"use client";
import { useActionState, useState } from "react";
import type { Realisation } from "@/lib/data";

const CATEGORIES = ["Import", "Études", "Visa", "Formation", "Tourisme", "Autre"];

interface Props {
  items:        Realisation[];
  saveAction:   (_prev: unknown, fd: FormData) => Promise<{ error?: string }>;
  deleteAction: (_prev: unknown, fd: FormData) => Promise<{ error?: string }>;
}

const EMPTY: Realisation = { id: "", title: "", category: "Import", description: "", image: "", date: "", tags: [] };

export function AdminRealisationsView({ items, saveAction, deleteAction }: Props) {
  const [editing, setEditing] = useState<Realisation>(EMPTY);
  const [saveState, saveFormAction, saving] = useActionState(saveAction, {});
  const [delState,  delFormAction,  deleting] = useActionState(deleteAction, {});

  const cancel = () => setEditing(EMPTY);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display font-extrabold text-[var(--color-text)] text-[var(--text-2xl)]">Réalisations</h1>
        <p className="text-[var(--color-muted)] text-[var(--text-sm)] mt-1">{items.length} réalisation{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
        {/* List */}
        <section aria-label="Liste des réalisations">
          {items.length === 0 ? (
            <div className="card p-12 text-center text-[var(--color-muted)]">
              <p className="text-[var(--text-md)] font-semibold mb-2">Aucune réalisation</p>
              <p className="text-[var(--text-sm)]">Ajoutez votre première réalisation avec le formulaire.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {items.map((item) => (
                <li key={item.id} className="card p-4 flex items-center gap-4">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" aria-hidden className="w-14 h-14 object-cover rounded-[var(--radius-md)] shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] shrink-0 flex items-center justify-center text-[var(--color-muted)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-text)] text-[var(--text-sm)] truncate">{item.title}</p>
                    <p className="text-[var(--color-muted)] text-[var(--text-xs)]">{item.category}{item.date ? ` · ${item.date}` : ""}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => setEditing(item)} className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-semibold bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors">
                      Modifier
                    </button>
                    <form action={delFormAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" disabled={deleting} className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                        Supprimer
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {delState.error && <p className="mt-3 text-red-600 text-[var(--text-sm)]">{delState.error}</p>}
        </section>

        {/* Form */}
        <section className="card p-6 sticky top-8" aria-label={editing.id ? "Modifier la réalisation" : "Ajouter une réalisation"}>
          <h2 className="font-display font-bold text-[var(--color-text)] text-[var(--text-md)] mb-5">
            {editing.id ? "Modifier" : "Ajouter une réalisation"}
          </h2>

          <form action={saveFormAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={editing.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="r-title">Titre *</label>
                <input id="r-title" name="title" required defaultValue={editing.title} key={editing.id + "-t"} className="field-input" placeholder="Titre de la réalisation" />
              </div>

              <div>
                <label className="field-label" htmlFor="r-cat">Catégorie</label>
                <select id="r-cat" name="category" defaultValue={editing.category} key={editing.id + "-c"} className="field-input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="r-date">Date</label>
                <input id="r-date" name="date" defaultValue={editing.date} key={editing.id + "-d"} className="field-input" placeholder="Ex: Mars 2024" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="r-image">Image (URL https://)</label>
                <input id="r-image" name="image" type="url" defaultValue={editing.image} key={editing.id + "-i"} className="field-input" placeholder="https://…" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="r-desc">Description</label>
                <textarea id="r-desc" name="description" rows={3} defaultValue={editing.description} key={editing.id + "-de"} className="field-input resize-none" placeholder="Description de la réalisation" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="r-tags">Tags (séparés par virgules)</label>
                <input id="r-tags" name="tags" defaultValue={(editing.tags ?? []).join(", ")} key={editing.id + "-tg"} className="field-input" placeholder="Ex: DDP, Guangzhou, Textile" />
              </div>
            </div>

            {saveState.error && <p className="text-red-600 text-[var(--text-sm)]">{saveState.error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-sm)] shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] disabled:opacity-60 transition-colors">
                {saving ? "Enregistrement…" : editing.id ? "Mettre à jour" : "Ajouter"}
              </button>
              {editing.id && (
                <button type="button" onClick={cancel} className="px-5 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--text-sm)] font-semibold text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)] transition-colors">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
