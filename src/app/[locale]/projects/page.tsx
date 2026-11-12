import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MapPin, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getProjects, getServiceCategories, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import { mediaUrl } from '@/lib/utils';
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.items.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Image — tall enough to see on mobile */}
                  <div className="relative h-52 sm:h-48 overflow-hidden bg-gray-100">
                    {project.cover?.url ? (
                      <Image
                        src={mediaUrl(project.cover.url) ?? project.cover.url}
                        alt={resolveT(project.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: '#111111' }}>
                        <span className="text-white/20 text-6xl font-black font-heading">
                          {resolveT(project.title).charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Status badge over image */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
                        project.project_status === 'completed'
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-800'
                      }`}>
                        {project.project_status === 'completed'
                          ? (locale === 'sw' ? 'Imekamilika' : 'Completed')
                          : (locale === 'sw' ? 'Inaendelea' : 'Ongoing')}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 font-heading text-sm leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {resolveT(project.title)}
                    </h3>
                    {(project.location ?? project.region) && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{project.location ?? project.region}</span>
                      </p>
                    )}
                  </div>
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
