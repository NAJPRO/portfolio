import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Container} from '@/components/layout/Container';
import {ActionLink} from '@/components/ui/ActionLink';
import {TagList} from '@/components/ui/Tag';
import {ArrowLeft, ArrowUpRight} from '@/components/ui/icons';
import {ProjectShot} from '@/components/project/ProjectShot';
import type {FeaturedProject} from '@/content';

/**
 * Le récit tient la colonne principale, les faits vérifiables la colonne latérale.
 * Sous lg, la colonne latérale passe sous le récit : le texte reste l'entrée du
 * lecteur, les valeurs techniques le confirment ensuite.
 */
export function ProjectDetail({project}: {project: FeaturedProject}) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <article>
      <Container className="pt-10 pb-12 sm:pt-14">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          {t('actions.backHome')}
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {project.category[locale]}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05]">
            {project.name}
          </h1>
          <p className="mt-5 text-base text-ink-muted sm:text-lg">
            {project.summary[locale]}
          </p>

          <ActionLink
            href={project.url}
            target="_blank"
            rel="noreferrer"
            variant="primary"
            className="mt-8"
          >
            {t('project.openLive', {name: project.name})}
            <ArrowUpRight className="size-4" />
          </ActionLink>
        </header>
      </Container>

      <Container>
        <div className="overflow-hidden rounded-xl border border-line">
          <ProjectShot
            project={project}
            priority
            sizes="(min-width: 1200px) 1088px, 92vw"
          />
        </div>
      </Container>

      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="space-y-5 text-[15px] leading-relaxed sm:text-base">
              {project.narrative[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-accent pl-5">
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                {t('project.angleLabel')}
              </h2>
              <p className="mt-3 text-lg leading-snug">
                {project.angle[locale]}
              </p>
            </div>
          </div>

          <aside className="space-y-8">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                {t('project.roleLabel')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed">
                {project.role[locale]}
              </p>
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                {t('project.stackLabel')}
              </h2>
              <TagList items={project.stack} className="mt-3" />
            </section>

            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                {t('project.factsLabel')}
              </h2>
              <dl className="mt-3 space-y-3">
                {project.facts.map((fact) => (
                  <div
                    key={fact.value}
                    className="rounded-lg border border-line bg-surface px-4 py-3"
                  >
                    <dt className="font-mono text-sm text-accent">
                      {fact.value}
                    </dt>
                    <dd className="mt-1 text-sm text-ink-muted">
                      {fact.label[locale]}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      </Container>
    </article>
  );
}
