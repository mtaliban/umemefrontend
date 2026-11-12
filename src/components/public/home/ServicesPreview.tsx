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

        {/* Category cards */}
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
                  className="group flex items-center gap-3 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-900 transition-all duration-200"
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
                  <h3 className="font-bold text-gray-900 group-hover:text-white text-sm font-heading leading-snug truncate transition-colors">
                    {resolveT(cat.name)}
                  </h3>
                </Link>
              );
            })}
          </div>
        )}

        {/* Service list — clean rows, no images */}
        {services.length > 0 && (
          <div className="divide-y divide-gray-100">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="group flex items-center justify-between py-4 hover:bg-gray-50 px-3 -mx-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FEF9E7' }}
                  >
                    <Zap className="w-4 h-4" style={{ color: '#D97706' }} />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 text-sm leading-snug">
                    {resolveT(service.title)}
                  </h3>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all text-sm"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
