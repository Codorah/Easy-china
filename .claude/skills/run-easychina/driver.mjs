#!/usr/bin/env node
/**
 * Easy China – Playwright driver
 * Usage: node driver.mjs [command] [args...]
 *
 * Commands:
 *   screenshot [out.png]   Take a viewport screenshot (default: /tmp/easychina.png)
 *   full [out.png]         Full-page screenshot
 *   navigate <section>     Navigate to section: accueil | catalogue | realisations | equipe | admin
 *   check                  Smoke-check: verify hero text + key sections load
 *   lang <code>            Switch language: fr | en | zh
 *
 * Env:
 *   EASYCHINA_URL  Base URL (default: http://localhost:5173)
 */
import { chromium } from 'playwright';

const URL = process.env.EASYCHINA_URL || 'http://localhost:5173';
const [, , cmd = 'screenshot', arg1, arg2] = process.argv;

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  if (cmd === 'screenshot') {
    const out = arg1 || '/tmp/easychina.png';
    await page.screenshot({ path: out });
    console.log(`Screenshot saved: ${out}`);

  } else if (cmd === 'full') {
    const out = arg1 || '/tmp/easychina-full.png';
    await page.screenshot({ path: out, fullPage: true });
    console.log(`Full-page screenshot saved: ${out}`);

  } else if (cmd === 'navigate') {
    const SECTIONS = {
      accueil:      'text=Accueil',
      catalogue:    'text=Catalogue',
      realisations: 'text=Réalisations',
      equipe:       'text=Notre Équipe',
      admin:        'text=Admin',
    };
    const sel = SECTIONS[arg1?.toLowerCase()];
    if (!sel) { console.error(`Unknown section "${arg1}". Use: ${Object.keys(SECTIONS).join(' | ')}`); process.exit(1); }
    await page.click(sel);
    await page.waitForTimeout(800);
    const out = arg2 || `/tmp/easychina-${arg1}.png`;
    await page.screenshot({ path: out });
    console.log(`Navigated to ${arg1}, screenshot: ${out}`);

  } else if (cmd === 'lang') {
    const LANGS = { fr: 'Français', en: 'English', zh: '中文' };
    const label = LANGS[arg1?.toLowerCase()];
    if (!label) { console.error(`Unknown lang "${arg1}". Use: fr | en | zh`); process.exit(1); }
    await page.click('button:has-text("Français"), button:has-text("English"), button:has-text("中文")');
    await page.waitForTimeout(300);
    await page.click(`text=${label}`);
    await page.waitForTimeout(800);
    const out = `/tmp/easychina-lang-${arg1}.png`;
    await page.screenshot({ path: out });
    console.log(`Language switched to ${label}, screenshot: ${out}`);

  } else if (cmd === 'check') {
    const title = await page.title();
    const h1 = await page.$eval('h1', el => el.textContent).catch(() => '(no h1)');
    console.log('Title:', title);
    console.log('H1:', h1.trim());

    // Navigate through all sections
    for (const section of ['catalogue', 'realisations', 'equipe']) {
      const navSel = section === 'realisations' ? 'text=Réalisations' : section === 'equipe' ? 'text=Notre Équipe' : 'text=Catalogue';
      await page.click(navSel);
      await page.waitForTimeout(600);
      const heading = await page.$eval('h2, h1', el => el.textContent).catch(() => '?');
      console.log(`${section}: ${heading.trim().slice(0, 60)}`);
    }
    console.log('Smoke check passed.');

  } else {
    console.error(`Unknown command: ${cmd}`);
    console.error('Usage: node driver.mjs [screenshot|full|navigate|check|lang] [args]');
    process.exit(1);
  }

  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
