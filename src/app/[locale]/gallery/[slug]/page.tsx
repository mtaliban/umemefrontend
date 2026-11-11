import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Images } from 'lucide-react';
import { getGalleryAlbum, getGalleryAlbums } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import AlbumGrid from './AlbumGrid';

interface GalleryAlbumProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const albums = await getGalleryAlbums('en');
    return albums.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: GalleryAlbumProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const album = await getGalleryAlbum(slug, locale);
    const resolveT = (f: { en: string; sw: string } | undefined) =>
      locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');
    return {
      title: resolveT(album.title),
      openGraph: { images: album.cover?.url ? [album.cover.url] : [] },
    };
  } catch {
    return { title: 'Gallery Album' };
  }
}

export default async function GalleryAlbumPage({ params }: GalleryAlbumProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('gallery');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let album;
  try {
    album = await getGalleryAlbum(slug, locale);
  } catch {
    notFound();
  }

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title'), href: '/gallery' },
    { label: resolveT(album.title) },
  ];

  const itemCount = album.items?.length ?? 0;

  return (
    <>
      <PageBanner
        title={resolveT(album.title)}
        image={album.cover}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Album header info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,88,12,0.08)' }}>
                <Images className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {itemCount} {itemCount === 1
                    ? (locale === 'sw' ? 'picha' : 'item')
                    : (locale === 'sw' ? 'picha' : 'items')}
                </p>
              </div>
            </div>
            <Link
              href="/gallery"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {locale === 'sw' ? 'Rudi Galeria' : 'Back to Gallery'}
            </Link>
          </div>

          {/* Grid */}
          {itemCount === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Images className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg">
                {locale === 'sw' ? 'Hakuna picha za kuonyesha' : 'No images to display'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <AlbumGrid items={album.items ?? []} locale={locale} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
