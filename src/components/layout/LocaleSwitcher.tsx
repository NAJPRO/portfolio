'use client';

import type {ComponentProps} from 'react';
import {useParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

/**
 * Seul composant client de la mise en page : il lui faut le chemin courant pour
 * proposer la même page dans l'autre langue, ce qu'un composant serveur ne sait pas lire.
 */
export function LocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('nav');
  const otherLocale =
    routing.locales.find((candidate) => candidate !== locale) ??
    routing.defaultLocale;

  // `usePathname` rend le gabarit interne (par exemple /projects/[slug]) et
  // `useParams` les valeurs qui le remplissent. TypeScript ne sait pas corréler les
  // deux ; la conversion est sûre puisqu'ils proviennent du même rendu.
  const href = {pathname, params} as ComponentProps<typeof Link>['href'];

  return (
    <Link
      href={href}
      locale={otherLocale}
      hrefLang={otherLocale}
      aria-label={t('switchTo')}
      className="rounded-full border border-line px-3 py-1.5 font-mono text-xs uppercase text-ink-muted transition-colors duration-200 hover:border-ink-muted hover:text-ink"
    >
      {otherLocale}
    </Link>
  );
}
