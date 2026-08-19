import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowUpRight} from '@/components/ui/icons';
import {ProjectShot} from '@/components/project/ProjectShot';
import {TagList} from '@/components/ui/Tag';
import type {FeaturedProject} from '@/content';

/**
 * La carte entière ouvre le produit en ligne : c'est l'action que la page cherche à
 * provoquer. Le lien s'étire sur la carte par pseudo-élément, ce qui garde une seule
 * zone cliquable et un seul arrêt au clavier.
 */
export function ProjectCard({project}: {project: FeaturedProject}) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition duration-200 hover:-translate-y-1 hover:border-ink-muted hover:bg-raised has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
      <ProjectShot project={project} sizes="(min-width: 768px) 45vw, 92vw" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          {project.category[locale]}
        </p>

        <h3 className="mt-2 font-display text-2xl font-bold">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={t('actions.viewProject', {name: project.name})}
            // Le contour de focus est porté par la carte : le lien s'étire dessus,
            // un liseré autour du seul titre indiquerait mal la zone activable.
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {project.name}
          </a>
        </h3>

        <p className="mt-3 text-sm text-ink-muted">{project.summary[locale]}</p>

        <TagList items={project.stack} className="mt-5 mb-5" />

        {/*
          Second lien de la carte, au-dessus du lien étiré : la carte mène au produit,
          celui-ci mène au récit technique. `relative z-20` le garde cliquable.
        */}
        <div className="mt-auto border-t border-line pt-4">
          <Link
            href={{pathname: '/projects/[slug]', params: {slug: project.slug}}}
            className="relative z-20 text-sm text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-accent hover:underline"
          >
            {t('actions.readProject', {name: project.name})}
          </Link>
        </div>
      </div>

      <ArrowUpRight className="pointer-events-none absolute right-4 top-4 size-5 rounded-full bg-deep/70 p-0.5 text-ink-muted opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />
    </li>
  );
}
