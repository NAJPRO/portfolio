import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {locale as rootLocale} from 'next/root-params';
import {routing} from './routing';

/**
 * Next 16 expose le segment racine [locale] via next/root-params, ce qui remplace
 * le `requestLocale` déprécié de next-intl.
 *
 * L'override explicite garde la priorité : les contextes sans segment racine
 * (route handlers, server actions) passent leur langue à getTranslations({locale}).
 */
export default getRequestConfig(async ({locale: explicitLocale}) => {
  const requested = explicitLocale ?? (await rootLocale());
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
