import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

/**
 * Enveloppes de navigation conscientes de la langue : tout lien interne conserve
 * le préfixe courant sans que les composants aient à le reconstruire.
 */
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
