import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Calendar } from 'lucide-react';
import { getPost, getPosts } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import ShareButtons from './ShareButtons';

interface NewsArticleProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const result = await getPosts('en');
    return result.items.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: NewsArticleProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = await getPost(slug, locale);
    const resolveT = (f: { en: string; sw: string } | undefined) =>
      locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');
    return {
      title: resolveT(post.title),
      description: resolveT(post.excerpt),
      openGraph: {
        type: 'article',
        images: post.cover?.url ? [post.cover.url] : [],
        publishedTime: post.published_at,
      },
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function NewsArticlePage({ params }: NewsArticleProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('news');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let post;
  try {
    post = await getPost(slug, locale);
  } catch {
    notFound();
  }

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title'), href: '/news' },
    { label: resolveT(post.title) },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';
  const pageUrl = `${siteUrl}/${locale === 'sw' ? 'sw/habari' : 'news'}/${slug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resolveT(post.title),
    description: resolveT(post.excerpt),
    datePublished: post.published_at ?? post.created_at,
    image: post.cover?.url ? `${siteUrl}${post.cover.url}` : undefined,
    url: pageUrl,
  };

  const categoryColors: Record<string, string> = {
    news: 'bg-green-100 text-green-800',
    announcement: 'bg-yellow-100 text-yellow-800',
    event: 'bg-green-100 text-green-800',
    tender: 'bg-purple-100 text-purple-800',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <PageBanner
        title={resolveT(post.title)}
        image={post.cover}
        breadcrumbs={breadcrumbs}
      />

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-800'}`}>
              {post.category}
            </span>
            {(post.published_at ?? post.created_at) && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(post.published_at ?? post.created_at).toLocaleDateString(
                  locale === 'sw' ? 'sw-TZ' : 'en-TZ',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </span>
            )}
          </div>

          {/* Body */}
          {post.body && (
            <div
              className="prose prose-lg prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: resolveT(post.body) }}
            />
          )}

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('shareArticle')}</h3>
            <ShareButtons url={pageUrl} title={resolveT(post.title)} />
          </div>
        </div>
      </article>
    </>
  );
}
