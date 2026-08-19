import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

/**
 * Depuis Next 16, le middleware s'appelle proxy. Sa seule responsabilité ici est
 * la redirection vers la langue : toute autre logique resterait hors du chemin critique.
 */
export const proxy = createMiddleware(routing);

export const config = {
  // Ignore les routes API, les artefacts de build et tout fichier statique (extension présente).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
