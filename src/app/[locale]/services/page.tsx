import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { getServices, getServiceCategories, getPage } from '@/lib/api';
import { mediaUrl } from '@/lib/utils';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Huduma' : 'Services' };
}

export default async function ServicesPage({ params, searchParams }: ServicesPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations('services');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [servicesResult, categoriesResult, pageResult] = await Promise.allSettled([
    getServices(locale, category),
    getServiceCategories(locale),
    getPage('services', locale),
  ]);
  const services = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Category filter tabs */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/services"
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                !category
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {t('allServices')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/services?category=${cat.slug}`}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  category === cat.slug
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {resolveT(cat.name)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">{locale === 'sw' ? 'Hakuna huduma zinazopatikana' : 'No services available'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  {service.cover?.url ? (
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={mediaUrl(service.cover.url) ?? service.cover.url}
                        alt={resolveT(service.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-44 flex items-center justify-center" style={{ background: '#111111' }}>
                      <span className="text-5xl font-bold text-white/10 font-heading">
                        {resolveT(service.title).charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 font-heading group-hover:text-primary transition-colors line-clamp-1 text-base">
                      {resolveT(service.title)}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {resolveT(service.summary)}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold">
                      <span>{t('viewDetails')}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
