import type {routing} from '@/i18n/routing';
import type messages from '../../messages/fr.json';

/**
 * Le catalogue français fait référence : une clé absente de la traduction anglaise
 * devient une erreur de compilation plutôt qu'un texte manquant en production.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
