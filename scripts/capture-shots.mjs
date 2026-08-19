import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import sharp from 'sharp';

/**
 * Produit les captures des produits en ligne.
 *
 * Volontairement hors du build : les images sont versionnées, donc un déploiement
 * ne dépend ni d'un navigateur installé sur le serveur, ni de la disponibilité des
 * trois sites au moment du build. À relancer à la main quand une interface change.
 *
 *   node scripts/capture-shots.mjs
 */

const VIEWPORT = {width: 1440, height: 900};
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'shots');
const NAVIGATION_TIMEOUT = 45_000;

const targets = [
  {name: 'rendoc', url: 'https://rendoc.org/fr'},
  {name: 'propriolink', url: 'https://propriolink.com/fr'},
  {name: 'elyra', url: 'https://elyra.bridge-forms.com'}
];

async function capture(browser, target) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: 'fr-FR'
  });
  const page = await context.newPage();

  try {
    await page.goto(target.url, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT
    });

    // Le silence réseau est souhaitable mais pas exigé : un site qui sonde son
    // serveur en continu ne l'atteint jamais, et l'attendre ferait échouer la capture.
    await page
      .waitForLoadState('networkidle', {timeout: 15_000})
      .catch(() => undefined);

    // Laisse les polices se substituer et les images du premier écran se poser.
    await page.waitForTimeout(1500);

    const png = await page.screenshot({type: 'png'});
    const webp = await sharp(png).webp({quality: 80, effort: 6}).toBuffer();
    const file = path.join(OUTPUT_DIR, `${target.name}.webp`);
    await writeFile(file, webp);

    return {name: target.name, bytes: webp.length};
  } finally {
    await context.close();
  }
}

/**
 * Le Chrome de la machine est privilégié : il évite de télécharger les 150 Mo du
 * Chromium fourni par Playwright, qui ne servent qu'à ce script.
 */
async function launchBrowser() {
  try {
    return await chromium.launch({channel: 'chrome'});
  } catch {
    return await chromium.launch();
  }
}

async function main() {
  // Sans argument, les trois sites. Sinon, seulement ceux nommés :
  //   node scripts/capture-shots.mjs propriolink
  const requested = process.argv.slice(2);
  const selection =
    requested.length > 0
      ? targets.filter((target) => requested.includes(target.name))
      : targets;

  await mkdir(OUTPUT_DIR, {recursive: true});
  const browser = await launchBrowser();
  const failures = [];

  try {
    for (const target of selection) {
      try {
        const result = await capture(browser, target);
        console.log(
          `${String(Math.round(result.bytes / 1024)).padStart(5)} ko  ${result.name}.webp`
        );
      } catch (error) {
        failures.push(target.name);
        console.error(
          `        ${target.name} : capture impossible (${error.message.split('\n')[0]})`
        );
      }
    }
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    console.error(
      `\nCaptures manquantes : ${failures.join(', ')}. Retirer le champ ` +
        `screenshot de ces projets dans src/content/projects.ts : le cadre affichera ` +
        `alors son visuel de remplacement.`
    );
  }
}

await main();
