import { MetadataRoute } from 'next';

/**
 * Generate sitemap.xml for SEO
 * This file will automatically be served at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bsocio.org';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/how-it-works',
    '/festivals',
    '/faqs',
    '/news-media',
    '/our-structure',
    '/leadership',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/about' ? 0.9 : 0.8,
  }));
}
