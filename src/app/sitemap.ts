import type { MetadataRoute } from 'next';
import { getSitemap } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'http://localhost';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, alternates: { languages: { en: `${siteUrl}/`, sw: `${siteUrl}/sw` } } },
    { url: `${siteUrl}/about`, alternates: { languages: { en: `${siteUrl}/about`, sw: `${siteUrl}/sw/kuhusu-sisi` } } },
    { url: `${siteUrl}/services`, alternates: { languages: { en: `${siteUrl}/services`, sw: `${siteUrl}/sw/huduma` } } },
    { url: `${siteUrl}/projects`, alternates: { languages: { en: `${siteUrl}/projects`, sw: `${siteUrl}/sw/miradi` } } },
    { url: `${siteUrl}/training`, alternates: { languages: { en: `${siteUrl}/training`, sw: `${siteUrl}/sw/mafunzo` } } },
    { url: `${siteUrl}/clients`, alternates: { languages: { en: `${siteUrl}/clients`, sw: `${siteUrl}/sw/wateja` } } },
    { url: `${siteUrl}/news`, alternates: { languages: { en: `${siteUrl}/news`, sw: `${siteUrl}/sw/habari` } } },
    { url: `${siteUrl}/gallery`, alternates: { languages: { en: `${siteUrl}/gallery`, sw: `${siteUrl}/sw/picha` } } },
    { url: `${siteUrl}/faq`, alternates: { languages: { en: `${siteUrl}/faq`, sw: `${siteUrl}/sw/maswali` } } },
    { url: `${siteUrl}/contact`, alternates: { languages: { en: `${siteUrl}/contact`, sw: `${siteUrl}/sw/wasiliana-nasi` } } },
    { url: `${siteUrl}/privacy`, alternates: { languages: { en: `${siteUrl}/privacy`, sw: `${siteUrl}/sw/faragha` } } },
  ];

  try {
    const items = await getSitemap();
    const dynamicRoutes: MetadataRoute.Sitemap = items.map((item) => {
      const collectionPaths: Record<string, { en: string; sw: string }> = {
        services: { en: 'services', sw: 'sw/huduma' },
        projects: { en: 'projects', sw: 'sw/miradi' },
        training: { en: 'training', sw: 'sw/mafunzo' },
        posts: { en: 'news', sw: 'sw/habari' },
        gallery_albums: { en: 'gallery', sw: 'sw/picha' },
      };

      const paths = collectionPaths[item.collection];
      if (!paths) return null;

      return {
        url: `${siteUrl}/${paths.en}/${item.slug}`,
        lastModified: item.updated_at,
        alternates: {
          languages: {
            en: `${siteUrl}/${paths.en}/${item.slug}`,
            sw: `${siteUrl}/${paths.sw}/${item.slug_sw}`,
          },
        },
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
