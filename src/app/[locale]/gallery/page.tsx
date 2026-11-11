import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Images, ArrowUpRight } from 'lucide-react';
import { getGalleryAlbums, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Picha' : 'Gallery' };
}

export default async function GalleryPage({ params, searchParams }: GalleryPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations('gallery');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [albumsResult, pageResult] = await Promise.allSettled([
    getGalleryAlbums(locale, category),
    getPage('gallery', locale),
  ]);
  const albums = albumsResult.status === 'fulfilled' ? albumsResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const categories = [
    { key: 'projects', label: locale === 'sw' ? 'Miradi' : 'Projects' },
    { key: 'training', label: locale === 'sw' ? 'Mafunzo' : 'Training' },
    { key: 'events', label: locale === 'sw' ? 'Matukio' : 'Events' },
    { key: 'team', label: locale === 'sw' ? 'Timu' : 'Team' },
  ];

  const categoryBadgeColors: Record<string, string> = {
    projects: 'bg-green-100 text-green-700',
    training: 'bg-green-100 text-green-700',
    events: 'bg-purple-100 text-purple-700',
    team: 'bg-amber-100 text-amber-700',
  };

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Filter tabs */}
      <section className="py-5 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/gallery"
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !category ? 'bg-primary text-white shadow-sm' : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {locale === 'sw' ? 'Zote' : 'All'}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/gallery?category=${cat.key}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  category === cat.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {albums.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Images className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg">
                {locale === 'sw' ? 'Hakuna albamu zinazopatikana' : 'No albums found'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Link
                  key={album._id}
                  href={`/gallery/${album.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    {album.cover?.url ? (
                      <>
                        <Image
                          src={album.cover.url}
                          alt={resolveT(album.cover.alt) || resolveT(album.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                            <ArrowUpRight className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full gradient-primary flex items-center justify-center">
                        <Images className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 font-heading group-hover:text-primary transition-colors line-clamp-1 text-base">
                        {resolveT(album.title)}
                      </h3>
                      {album.category && (
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${categoryBadgeColors[album.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {album.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
