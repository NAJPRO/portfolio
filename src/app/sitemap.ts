import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {featuredProjects} from '@/content';
import {getSiteUrl} from '@/lib/site-url';

type Href = Parameters<typeof getPathname>[0]['href'];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const absolute = (path: string) => new URL(path, siteUrl).href;

  const pages: Href[] = [
    '/',
    ...featuredProjects.map((project) => ({
      pathname: '/projects/[slug]' as const,
      params: {slug: project.slug}
    }))
  ];

  return pages.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absolute(getPathname({href, locale})),
      // Chaque entrée déclare ses équivalents : les deux langues sont indexées comme
      // une seule page servie en deux versions, pas comme un contenu dupliqué.
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((candidate) => [
            candidate,
            absolute(getPathname({href, locale: candidate}))
          ])
        )
      }
    }))
  );
}
