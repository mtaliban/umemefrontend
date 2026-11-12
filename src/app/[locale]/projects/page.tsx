import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getProjects, getServiceCategories, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import ProjectsFilter from './ProjectsFilter';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; status?: string; year?: string; page?: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Miradi' : 'Projects' };
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const currentPage = parseInt(sp.page ?? '1', 10);
  const t = await getTranslations('projects');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [resultRes, categoriesRes, pageRes] = await Promise.allSettled([
    getProjects(locale, {
      category: sp.category,
      status: sp.status,
      year: sp.year,
      page: currentPage,
    }),
    getServiceCategories(locale),
    getPage('projects', locale),
  ]);
  const result = resultRes.status === 'fulfilled' ? resultRes.value : { items: [], total: 0, page: 1, pages: 1 };
  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value : [];
  const page = pageRes.status === 'fulfilled' ? pageRes.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all = { category: sp.category, status: sp.status, year: sp.year, ...overrides };
    Object.entries(all).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Filters */}
      <section className="py-5 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsFilter
            categories={categories}
            locale={locale}
            current={{ category: sp.category, status: sp.status, year: sp.year }}
            categoryLabel={t('category')}
            statusLabel={t('status')}
            yearLabel={t('year')}
          />
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {result.items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                {locale === 'sw' ? 'Hakuna miradi inayopatikana' : 'No projects found'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              {result.items.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug}`}
                  className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Small thumbnail */}
                  <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {project.cover?.url ? (
                      <Image
                        src={project.cover.url}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 font-heading group-hover:text-gray-700 text-sm leading-snug line-clamp-1">
                      {resolveT(project.title)}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      {(project.location ?? project.region) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {project.location ?? project.region}
                        </span>
                      )}
                      {project.end_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.end_date).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-bold rounded-full ${
                    project.project_status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.project_status === 'completed'
                      ? (locale === 'sw' ? 'Imekamilika' : 'Completed')
                      : (locale === 'sw' ? 'Inaendelea' : 'Ongoing')}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {result.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/projects${buildQuery({ page: String(currentPage - 1) })}`}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              )}
              {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/projects${buildQuery({ page: String(p) })}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    p === currentPage
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {currentPage < result.pages && (
                <Link
                  href={`/projects${buildQuery({ page: String(currentPage + 1) })}`}
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all"
                  aria-label="Next page"
                >
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
