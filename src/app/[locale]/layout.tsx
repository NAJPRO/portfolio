import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Bricolage_Grotesque, JetBrains_Mono} from 'next/font/google';
import localFont from 'next/font/local';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {buildAlternates, buildSharing} from '@/lib/metadata';
import {getSiteUrl} from '@/lib/site-url';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SiteFooter} from '@/components/layout/SiteFooter';
import {ScrollReveals} from '@/components/motion/ScrollReveals';
import '../globals.css';

/**
 * Trois familles variables, sous-ensemble latin, `display: swap` : le texte reste
 * lisible avant la fin du téléchargement, ce qui compte sur les connexions visées.
 *
 * Bricolage ne demande que l'axe de chasse. Ajouter l'axe optique faisait passer le
 * fichier de 76 à 128 ko, pour un écart invisible aux tailles employées ici.
 */
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-bricolage',
  display: 'swap'
});

/**
 * Geist est servi depuis les fichiers du dépôt, réduits au sous-ensemble latin et
 * convertis en woff2 (32 ko pour toute la plage de graisses). Le fichier vit hors de
 * `public/` pour que seule la version empreintée par next/font soit accessible.
 */
const body = localFont({
  src: '../../fonts/geist-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-geist',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({locale, namespace: 'meta.home'});
  const title = t('title');
  const description = t('description');

  return {
    // Sert de base aux URL relatives des métadonnées : canonique, hreflang, images.
    metadataBase: getSiteUrl(),
    title,
    description,
    alternates: buildAlternates('/', locale),
    ...buildSharing({title, description, locale, href: '/'})
  };
}

export default async function LocaleLayout({
  children,
  params
}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;

  // Le segment [locale] capte aussi les chemins inconnus : on refuse ici plutôt que
  // de servir la page dans une langue de repli silencieuse.
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      // Next 16 ne neutralise plus le défilement doux pendant une navigation :
      // l'attribut le lui redemande, pour que les ancres restent douces et les
      // changements de page instantanés.
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-deep text-ink">
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <ScrollReveals />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
