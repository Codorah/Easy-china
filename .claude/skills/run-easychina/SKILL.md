---
name: run-easychina
description: Run, start, launch, screenshot, or verify the Easy China web app. Use when asked to run the app, take a screenshot, test a change, or check that the UI looks correct.
---

# Run Easy China

Easy China is a React + Vite single-page app (French/English/Chinese). It's driven by a Playwright driver at `.claude/skills/run-easychina/driver.mjs`. The dev server runs on `http://localhost:5173`.

## Prerequisites

```bash
# playwright must be installed (it's in devDependencies)
npm install
```

Playwright's Chromium browser is installed automatically when first needed. If missing, run:

```bash
npx playwright install chromium
```

## Build

No separate build step needed for local dev. The dev server serves source files directly via Vite.

## Run (agent path)

### 1. Start the dev server (background)

```bash
npm run dev -- --port 5173 &
# Wait ~3s for it to be ready, then verify:
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
# Expect: 200
```

### 2. Drive with the Playwright driver

All paths are relative to the repo root.

```bash
# Smoke-check all sections load correctly
node .claude/skills/run-easychina/driver.mjs check

# Viewport screenshot (saved to /tmp/easychina.png)
node .claude/skills/run-easychina/driver.mjs screenshot

# Full-page screenshot
node .claude/skills/run-easychina/driver.mjs full /tmp/easychina-full.png

# Navigate to a section and screenshot
node .claude/skills/run-easychina/driver.mjs navigate catalogue /tmp/cat.png
node .claude/skills/run-easychina/driver.mjs navigate admin /tmp/admin.png
node .claude/skills/run-easychina/driver.mjs navigate realisations /tmp/real.png
node .claude/skills/run-easychina/driver.mjs navigate equipe /tmp/equipe.png

# Switch language (fr | en | zh)
node .claude/skills/run-easychina/driver.mjs lang en
```

**Driver command reference:**

| Command | Args | Effect |
|---|---|---|
| `check` | — | Navigates all sections, prints headings, exits 0 if OK |
| `screenshot` | `[out.png]` | Viewport screenshot |
| `full` | `[out.png]` | Full-page screenshot |
| `navigate` | `<section> [out.png]` | Click nav item, screenshot. Sections: `accueil`, `catalogue`, `realisations`, `equipe`, `admin` |
| `lang` | `fr\|en\|zh` | Switch language dropdown |

Set `EASYCHINA_URL=http://localhost:5173` env var to override the base URL.

## Run (human path)

```bash
npm run dev
# Opens browser at http://localhost:5173
# Ctrl-C to stop
```

## Test

No automated test suite. The `check` driver command is the smoke test:

```bash
node .claude/skills/run-easychina/driver.mjs check
```

Expected output:
```
Title: Easy China – Import, Université, Visa & Tourisme Chine | Afrique Francophone
H1: EASY CHINAVotre Pont Afrique–Chine
catalogue: Catalogue d'Importation
realisations: Réalisations & Projets
equipe: Nos Experts Chine-Afrique
Smoke check passed.
```

## Gotchas

- **Admin section is password-protected.** The admin login (`⚙ Admin` nav) shows a password form. The default hash is in `src/App.jsx:32` as `ADMIN_HASH`. No bypass needed for UI testing — navigate to other sections instead.
- **GitHub sync requires env vars.** `VITE_GITHUB_TOKEN` and `VITE_ADMIN_HASH` are optional; the app runs fine without them (localStorage-only mode).
- **`playwright` is in devDependencies.** Run `npm install` first or the driver will fail with `Cannot find module 'playwright'`.
- **Screenshot paths on Windows/WSL.** The driver outputs Windows-normalized paths in WSL (e.g., `C:/Users/.../AppData/Local/Temp/...`). The file is accessible at that path.
- **Language switcher is a dropdown button.** The `lang` command clicks the visible language button (e.g., "Français"), then selects the target from the dropdown. If the dropdown is already open this may double-toggle — wrap in `navigate accueil` first if needed.
- **`networkidle` wait is needed.** React + framer-motion animations fire after DOM load. Without `waitUntil: 'networkidle'`, screenshots may catch blank frames.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module 'playwright'` | Run `npm install` in repo root |
| `curl` returns non-200 | Dev server not started; run `npm run dev &` and wait 3–5 s |
| Screenshot is blank/white | Add `await page.waitForTimeout(1500)` before screenshot in driver |
| `Error: net::ERR_CONNECTION_REFUSED` | Dev server crashed; restart with `npm run dev &` |
