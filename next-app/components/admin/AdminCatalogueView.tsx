"use client";
import { useActionState, useState } from "react";
import type { CatalogueItem } from "@/lib/data";

const CATEGORIES = ["Machines", "Ã‰lectronique", "Textile", "Alimentaire", "Import gÃ©nÃ©ral", "Autre"];

interface Props {
  items: CatalogueItem[];
  saveAction:   (_prev: unknown, fd: FormData) => Promise<{ error?: string }>;
  deleteAction: (_prev: unknown, fd: FormData) => Promise<{ error?: string }>;
}

const EMPTY: CatalogueItem = { id: "", name: "", category: "Machines", price: "", unit: "", minOrder: "", image: "", description: "" };

export function AdminCatalogueView({ items, saveAction, deleteAction }: Props) {
  const [editing, setEditing] = useState<CatalogueItem>(EMPTY);
  const [saveState, saveFormAction, saving] = useActionState(saveAction, {});
  const [delState,  delFormAction,  deleting] = useActionState(deleteAction, {});

  const startEdit = (item: CatalogueItem) => setEditing(item);
  const cancel    = () => setEditing(EMPTY);

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h1 className="font-display font-extrabold text-[var(--color-text)] text-[var(--text-2xl)]">Catalogue</h1>
        <p className="text-[var(--color-muted)] text-[var(--text-sm)] mt-1">{items.length} produit{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
        {/* â”€â”€ Item list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section aria-label="Liste des produits">
          {items.length === 0 ? (
            <div className="card p-12 text-center text-[var(--color-muted)]">
              <p className="text-[var(--text-md)] font-semibold mb-2">Aucun produit</p>
              <p className="text-[var(--text-sm)]">Ajoutez votre premier produit avec le formulaire.</p>
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m21 15-5-5L5 21"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-text)] text-[var(--text-sm)] truncate">{item.name}</p>
                    <p className="text-[var(--color-muted)] text-[var(--text-xs)]">{item.category}{item.price ? ` Â· ${item.price}` : ""}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-semibold bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                    >
                      Modifier
                    </button>
                    <form action={delFormAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        disabled={deleting}
                        className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
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

        {/* â”€â”€ Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="card p-6 sticky top-8" aria-label={editing.id ? "Modifier le produit" : "Ajouter un produit"}>
          <h2 className="font-display font-bold text-[var(--color-text)] text-[var(--text-md)] mb-5">
            {editing.id ? "Modifier" : "Ajouter un produit"}
          </h2>

          <form action={saveFormAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={editing.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="cat-name">Nom *</label>
                <input id="cat-name" name="name" required defaultValue={editing.name} key={editing.id + "-name"} className="field-input" placeholder="Nom du produit" />
              </div>

              <div>
                <label className="field-label" htmlFor="cat-cat">CatÃ©gorie</label>
                <select id="cat-cat" name="category" defaultValue={editing.category} key={editing.id + "-cat"} className="field-input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="cat-price">Prix</label>
                <input id="cat-price" name="price" defaultValue={editing.price} key={editing.id + "-price"} className="field-input" placeholder="Ex: 450 USD" />
              </div>

              <div>
                <label className="field-label" htmlFor="cat-unit">UnitÃ©</label>
                <input id="cat-unit" name="unit" defaultValue={editing.unit} key={editing.id + "-unit"} className="field-input" placeholder="Ex: piÃ¨ce, kg" />
              </div>

              <div>
                <label className="field-label" htmlFor="cat-min">Commande min.</label>
                <input id="cat-min" name="minOrder" defaultValue={editing.minOrder} key={editing.id + "-min"} className="field-input" placeholder="Ex: 10 piÃ¨ces" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="cat-image">Image (URL https://)</label>
                <input id="cat-image" name="image" type="url" defaultValue={editing.image} key={editing.id + "-img"} className="field-input" placeholder="https://â€¦" />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="cat-desc">Description</label>
                <textarea id="cat-desc" name="description" rows={3} defaultValue={editing.description} key={editing.id + "-desc"} className="field-input resize-none" placeholder="Description du produit" />
              </div>
            </div>

            {saveState.error && <p className="text-red-600 text-[var(--text-sm)]">{saveState.error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-[var(--text-sm)] shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-strong)] disabled:opacity-60 transition-colors">
                {saving ? "Enregistrementâ€¦" : editing.id ? "Mettre Ã  jour" : "Ajouter"}
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

