import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {featuredProjects, findFeaturedProject} from '@/content';
import {
  ogImageContentType,
  ogImageSize,
  renderOgImage
} from '@/lib/og-image';

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = 'Audin';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    featuredProjects.map((project) => ({locale, slug: project.slug}))
  );
}

export default async function ProjectOpenGraphImage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const project = findFeaturedProject(slug);
  if (!project) notFound();

  const t = await getTranslations({locale: active, namespace: 'project'});

  return renderOgImage({
    eyebrow: project.category[active],
    title: project.name,
    subtitle: project.summary[active],
    footerLabel: t('stackLabel'),
    footerItems: project.stack
  });
}
