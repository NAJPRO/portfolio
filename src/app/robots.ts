import type {MetadataRoute} from 'next';
import {getSiteUrl} from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // La route de contact n'a rien à indexer et ne répond qu'en POST.
        disallow: '/api/'
      }
    ],
    sitemap: new URL('sitemap.xml', siteUrl).href
  };
}
