import {useLocale, useTranslations} from 'next-intl';
import {Container} from '@/components/layout/Container';
import {ActionLink} from '@/components/ui/ActionLink';
import {ArrowUpRight} from '@/components/ui/icons';
import {site} from '@/content';

/**
 * Le premier écran porte la phrase d'ouverture, les deux actions, et les trois
 * produits en ligne. Le clic vers un produit est l'objectif de la page : il ne doit
 * jamais demander un défilement.
 */
export function Hero() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="border-b border-line">
      <Container className="pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-28">
        <h1 className="font-display max-w-4xl text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[1.05]">
          {site.hero.lead[locale]}
        </h1>
        <p className="mt-6 max-w-xl text-base text-ink-muted sm:text-lg">
          {site.hero.sub[locale]}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionLink href="#projects" variant="primary">
            {t('actions.viewProjects')}
          </ActionLink>
          <ActionLink href="#contact">{t('actions.contactMe')}</ActionLink>
        </div>
        <p className="mt-4 max-w-xl text-base text-ink-muted sm:text-lg">
          {site.hero.meta[locale]}
        </p>

        <div className="mt-14 border-t border-line pt-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            {t('hero.liveProductsLabel')}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {site.liveProducts.map((product) => (
              <li key={product.url}>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3 transition-colors duration-200 hover:border-ink-muted hover:bg-raised"
                >
                  <span>
                    <span className="block font-display text-lg font-bold">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs text-ink-muted">
                      {new URL(product.url).host}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-ink-muted transition-colors duration-200 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
