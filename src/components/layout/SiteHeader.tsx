import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/layout/Container';
import {LocaleSwitcher} from '@/components/layout/LocaleSwitcher';

const sectionLinks = [
  {href: '#projects', key: 'projects'},
  {href: '#other-work', key: 'otherWork'},
  {href: '#skills', key: 'skills'}
] as const;

/**
 * En-tête plein, sans flou d'arrière-plan : le contraste du texte reste constant quel
 * que soit le contenu qui défile dessous. Sous md, seuls Contact et la langue restent
 * affichés, les ancres de section devenant inutiles sur un écran étroit.
 */
export function SiteHeader() {
  const t = useTranslations('nav');

  return (
    <>
      {/* Premier élément focalisable du document, visible seulement au clavier. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-deep"
      >
        {t('skipToContent')}
      </a>

      <header className="sticky top-0 z-50 border-b border-line bg-deep">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight"
            >
              Audin
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <ul className="hidden items-center gap-1 md:flex">
                {sectionLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-full px-3 py-2 text-sm text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
                    >
                      {t(link.key)}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="rounded-full px-3 py-2 text-sm text-ink transition-colors duration-200 hover:bg-raised"
              >
                {t('contact')}
              </a>
              <LocaleSwitcher />
            </nav>
          </div>
        </Container>
      </header>
    </>
  );
}
