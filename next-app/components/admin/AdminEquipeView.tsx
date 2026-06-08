"use client";
import { useActionState, useState } from "react";
import type { TeamMember } from "@/lib/data";

interface Props {
  items:        TeamMember[];
  saveAction:   (_prev: unknown, fd: FormData) => Promise<{ error?: string }>;
  deleteAction: (_prev: unknown, fd: FormData) => Promise<{ error?: string }>;
}

const EMPTY: TeamMember = { id: "", name: "", role: "", bio: "", image: "", whatsapp: "", linkedin: "" };

export function AdminEquipeView({ items, saveAction, deleteAction }: Props) {
  const [editing, setEditing] = useState<TeamMember>(EMPTY);
  const [saveState, saveFormAction, saving] = useActionState(saveAction, {});
  const [delState,  delFormAction,  deleting] = useActionState(deleteAction, {});

  const cancel = () => setEditing(EMPTY);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display font-extrabold text-[var(--color-text)] text-[var(--text-2xl)]">Équipe</h1>
        <p className="text-[var(--color-muted)] text-[var(--text-sm)] mt-1">{items.length} membre{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
        {/* List */}
        <section aria-label="Liste des membres">
          {items.length === 0 ? (
            <div className="card p-12 text-center text-[var(--color-muted)]">
              <p className="text-[var(--text-md)] font-semibold mb-2">Aucun membre</p>
              <p className="text-[var(--text-sm)]">Ajoutez le premier membre de l'équipe.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {items.map((m) => (
                <li key={m.id} className="card p-4 flex items-center gap-4">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image} alt="" aria-hidden className="w-14 h-14 object-cover rounded-full shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[var(--color-accent-soft)] border border-[rgba(201,48,44,0.2)] shrink-0 flex items-center justify-center font-display font-extrabold text-[var(--color-accent)] text-[var(--text-md)]">
                      {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-text)] text-[var(--text-sm)] truncate">{m.name}</p>
                    <p className="text-[var(--color-muted)] text-[var(--text-xs)]">{m.role}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => setEditing(m)} className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-semibold bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors">
                      Modifier
                    </button>
                    <form action={delFormAction}>
                      <input type="hidden" name="id" value={m.id} />
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
        <section className="card p-6 sticky top-8" aria-label={editing.id ? "Modifier le membre" : "Ajouter un membre"}>
          <h2 className="font-display font-bold text-[var(--color-text)] text-[var(--text-md)] mb-5">
            {editing.id ? "Modifier" : "Ajouter un membre"}
          </h2>

          <form action={saveFormAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={editing.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label" htmlFor="m-name">Nom *</label>
                <input id="m-name" name="name" required defaultValue={editing.name} key={editing.id + "-n"} className="field-input" placeholder="Prénom Nom" />
              </div>

              <div>
                <label className="field-label" htmlFor="m-role">Poste *</label>
                <input id="m-role" name="role" required defaultValue={editing.role} key={editing.id + "-r"} className="field-input" placeholder="Ex: Directeur Import" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="m-image">Photo (URL https://)</label>
                <input id="m-image" name="image" type="url" defaultValue={editing.image} key={editing.id + "-i"} className="field-input" placeholder="https://…" />
              </div>

              <div>
                <label className="field-label" htmlFor="m-wa">WhatsApp</label>
                <input id="m-wa" name="whatsapp" defaultValue={editing.whatsapp} key={editing.id + "-w"} className="field-input" placeholder="+22890000001" />
              </div>

              <div>
                <label className="field-label" htmlFor="m-li">LinkedIn (URL)</label>
                <input id="m-li" name="linkedin" type="url" defaultValue={editing.linkedin} key={editing.id + "-l"} className="field-input" placeholder="https://linkedin.com/in/…" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="m-bio">Biographie</label>
                <textarea id="m-bio" name="bio" rows={3} defaultValue={editing.bio} key={editing.id + "-b"} className="field-input resize-none" placeholder="Présentation du membre" />
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
