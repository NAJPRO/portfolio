import {defineRouting} from 'next-intl/routing';

/**
 * Le préfixe de langue est toujours explicite (/fr, /en) : les URL partagées restent
 * dépourvues d'ambiguïté et les balises hreflang pointent vers des adresses stables,
 * sans page racine qui négocie la langue à chaud.
 *
 * Les chemins sont traduits. Un visiteur francophone lit /fr/projets/rendoc, un
 * anglophone /en/projects/rendoc, et les deux pages sont servies par le même fichier
 * de route. La clé de gauche est l'adresse interne, jamais visible.
 */
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/projects/[slug]': {
      fr: '/projets/[slug]',
      en: '/projects/[slug]'
    }
  }
});

export type Locale = (typeof routing.locales)[number];
