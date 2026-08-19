import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {featuredProjects, findFeaturedProject} from '@/content';
import {ProjectDetail} from '@/components/project/ProjectDetail';
import {buildAlternates, buildSharing} from '@/lib/metadata';

/**
 * Les deux projets détaillés sont connus à la compilation : les quatre pages
 * (deux projets, deux langues) sont produites statiquement.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    featuredProjects.map((project) => ({locale, slug: project.slug}))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const project = findFeaturedProject(slug);
  if (!project) notFound();

  const t = await getTranslations({locale, namespace: 'meta.project'});
  const title = t('titleTemplate', {name: project.name});
  const description = project.summary[locale];
  const href = {pathname: '/projects/[slug]', params: {slug: project.slug}} as const;

  return {
    title,
    description,
    alternates: buildAlternates(href, locale),
    ...buildSharing({title, description, locale, href})
  };
}

export default async function ProjectPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {slug} = await params;
  const project = findFeaturedProject(slug);

  // Un slug inconnu est une adresse inexistante, pas un projet vide.
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
