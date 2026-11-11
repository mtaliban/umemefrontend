import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getPosts, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface NewsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Habari' : 'News' };
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const currentPage = parseInt(sp.page ?? '1', 10);
  const t = await getTranslations('news');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [resultRes, pageRes] = await Promise.allSettled([
    getPosts(locale, { category: sp.category, q: sp.q, page: currentPage }),
    getPage('news', locale),
  ]);
  const result = resultRes.status === 'fulfilled' ? resultRes.value : { items: [], total: 0, page: 1, pages: 1 };
  const page = pageRes.status === 'fulfilled' ? pageRes.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const categories = [
    { key: 'news', label: t('news') },
    { key: 'announcement', label: t('announcement') },
    { key: 'event', label: t('event') },
    { key: 'tender', label: t('tender') },
  ];

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all = { category: sp.category, q: sp.q, ...overrides };
    Object.entries(all).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const categoryColors: Record<string, string> = {
    news: 'bg-green-100 text-green-800',
    announcement: 'bg-yellow-100 text-yellow-800',
    event: 'bg-green-100 text-green-800',
    tender: 'bg-purple-100 text-purple-800',
  };

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Filters */}
      {/* Filters */}
      <section className="py-5 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/news${buildQuery({ category: undefined, page: '1' })}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !sp.category ? 'bg-primary text-white shadow-sm' : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {locale === 'sw' ? 'Zote' : 'All'}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/news${buildQuery({ category: cat.key, page: '1' })}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  sp.category === cat.key
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
          {result.items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">{locale === 'sw' ? 'Hakuna habari zinazopatikana' : 'No articles found'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.items.map((post) => (
                <article key={post._id} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                  <Link href={`/news/${post.slug}`}>
                    {post.cover?.url ? (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={post.cover.url}
                          alt={resolveT(post.cover.alt) || resolveT(post.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="h-52 gradient-primary flex items-center justify-center">
                        <span className="text-6xl font-bold text-white/20 font-heading">
                          {resolveT(post.title).charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-700'}`}>
                          {post.category}
                        </span>
                        {(post.published_at ?? post.created_at) && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_at ?? post.created_at).toLocaleDateString(
                              locale === 'sw' ? 'sw-TZ' : 'en-TZ',
                              { day: 'numeric', month: 'short', year: 'numeric' }
                            )}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 font-heading group-hover:text-primary transition-colors line-clamp-2 text-base leading-snug">
                        {resolveT(post.title)}
                      </h3>
                      <p className="mt-2.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">{resolveT(post.excerpt)}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link href={`/news${buildQuery({ page: String(currentPage - 1) })}`} className="p-2.5 rounded-xl border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              )}
              {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/news${buildQuery({ page: String(p) })}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    p === currentPage ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {currentPage < result.pages && (
                <Link href={`/news${buildQuery({ page: String(currentPage + 1) })}`} className="p-2.5 rounded-xl border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
