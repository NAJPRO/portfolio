import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {site} from '@/content';
import {
  ogImageContentType,
  ogImageSize,
  renderOgImage
} from '@/lib/og-image';

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = 'Audin';

/** Sans cela, l'image serait rendue à chaque passage d'un robot d'indexation. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({locale: active, namespace: 'hero'});

  return renderOgImage({
    title: 'Audin',
    subtitle: `${site.role[active]}. ${site.location[active]}.`,
    footerLabel: t('liveProductsLabel'),
    footerItems: site.liveProducts.map((product) => new URL(product.url).host)
  });
}
