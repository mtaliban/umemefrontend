import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Droplets } from 'lucide-react';
import type { ServiceCategory, Service } from '@/lib/types';

interface ServicesPreviewProps {
  categories: ServiceCategory[];
  services: Service[];
  locale: string;
  viewAllLabel: string;
}

export default function ServicesPreview({
  categories,
  services,
  locale,
  viewAllLabel,
}: ServicesPreviewProps) {
  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  if (!categories.length && !services.length) return null;

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="section-label">
            {locale === 'sw' ? 'Huduma Zetu' : 'What We Do'}
          </span>
          <h2 className="mt-2 section-title">
            {locale === 'sw' ? 'Huduma za Uhandisi' : 'Engineering Services'}
          </h2>
          <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto">
            {locale === 'sw'
              ? 'Tunatoa huduma kamili za umeme na maji kwa sekta zote.'
              : 'Comprehensive electrical and water engineering solutions across all sectors.'}
          </p>
        </div>

        {/* Category cards — 2 side-by-side */}
        {categories.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            {categories.map((cat) => {
              const isElectricity =
                cat.name?.en?.toLowerCase().includes('electric') ||
                cat.slug === 'electricity';
              return (
                <Link
                  key={cat._id}
                  href={`/services?category=${cat.slug}`}
                  className="group flex items-center gap-3 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-100 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F5B700' }}
                  >
                    {isElectricity ? (
                      <Zap className="w-5 h-5" style={{ color: '#111111' }} />
                    ) : (
                      <Droplets className="w-5 h-5" style={{ color: '#111111' }} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm font-heading leading-snug truncate">
                      {resolveT(cat.name)}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5 group-hover:text-gray-700 transition-colors">
                      <span>{locale === 'sw' ? 'Angalia' : 'Explore'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Service list — rows on mobile, grid on desktop */}
        {services.length > 0 && (
          <div className="divide-y divide-gray-100 sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="group flex sm:flex-col items-start gap-3 py-4 sm:py-0 sm:bg-white sm:rounded-xl sm:border sm:border-gray-100 sm:overflow-hidden sm:shadow-card sm:hover:shadow-card-hover sm:transition-all sm:duration-300 sm:hover:-translate-y-0.5"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 sm:w-full sm:h-40 flex-shrink-0 rounded-lg sm:rounded-none overflow-hidden bg-gray-100">
                  {service.cover?.url ? (
                    <Image
                      src={service.cover.url}
                      alt={resolveT(service.cover.alt) || resolveT(service.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 72px, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Zap className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0 sm:p-4">
                  <h3 className="font-bold text-gray-900 font-heading group-hover:text-gray-700 transition-colors text-sm leading-snug line-clamp-1">
                    {resolveT(service.title)}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {resolveT(service.summary)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all text-sm"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
