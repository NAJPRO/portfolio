import type {Metadata} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';

type Href = Parameters<typeof getPathname>[0]['href'];

/**
 * Chemins de la même page dans toutes les langues, pour les balises hreflang.
 * Les chemins étant traduits, ils ne se déduisent pas d'un simple préfixe : seul
 * `getPathname` connaît la correspondance.
 */
export function buildAlternates(href: Href, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {};

  for (const candidate of routing.locales) {
    languages[candidate] = getPathname({href, locale: candidate});
  }

  return {
    canonical: getPathname({href, locale}),
    languages: {
      ...languages,
      'x-default': getPathname({href, locale: routing.defaultLocale})
    }
  };
}

/** Métadonnées de partage, identiques pour Open Graph et Twitter. */
export function buildSharing({
  title,
  description,
  locale,
  href
}: {
  title: string;
  description: string;
  locale: Locale;
  href: Href;
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: 'website',
      siteName: 'Audin',
      locale,
      title,
      description,
      url: getPathname({href, locale})
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}
