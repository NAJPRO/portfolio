/**
 * Adresse publique du site.
 *
 * Aucune valeur n'est codée en dur : un domaine inventé produirait des URL canoniques
 * et un sitemap faux. Sur Vercel, `VERCEL_PROJECT_PRODUCTION_URL` est fourni
 * automatiquement ; `NEXT_PUBLIC_SITE_URL` reste prioritaire pour un domaine propre.
 */
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return new URL(configured);

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return new URL(`https://${vercelDomain}`);

  return new URL('http://localhost:3000');
}
