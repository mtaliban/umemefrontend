import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Zap, Droplets } from 'lucide-react';
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
    <section className="py-20 lg:py-28 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">
            {locale === 'sw' ? 'Huduma Zetu' : 'What We Do'}
          </span>
          <h2 className="mt-3 section-title">
            {locale === 'sw' ? 'Huduma za Uhandisi' : 'Engineering Services'}
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            {locale === 'sw'
              ? 'Tunatoa huduma kamili za umeme na maji kwa sekta zote.'
              : 'Comprehensive electrical and water engineering solutions across all sectors.'}
          </p>
        </div>

        {/* Category cards */}
        {categories.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {categories.map((cat) => {
              const isElectricity =
                cat.name?.en?.toLowerCase().includes('electric') ||
                cat.slug === 'electricity';
              return (
                <Link
                  key={cat._id}
                  href={`/services?category=${cat.slug}`}
                  className="group relative rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{
                    background: isElectricity
                      ? 'linear-gradient(135deg, #D97706 0%, #F59E0B 60%, #FCD34D 100%)'
                      : 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 60%, #38BDF8 100%)',
                  }}
                >
                  {/* Dot pattern */}
                  <div className="absolute inset-0 opacity-[0.07]"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  {/* Decorative circle */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 border border-white/20">
                      {isElectricity ? (
                        <Zap className="w-7 h-7 text-white" />
                      ) : (
                        <Droplets className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white font-heading mb-2">
                      {resolveT(cat.name)}
                    </h3>
                    <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>{locale === 'sw' ? 'Angalia huduma' : 'Explore services'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Featured service cards */}
        {services.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                {service.cover?.url ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.cover.url}
                      alt={resolveT(service.cover.alt) || resolveT(service.title)}
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
                  </div>
                ) : (
                  <div className="h-48 gradient-primary flex items-center justify-center">
                    <span className="text-white/20 text-5xl font-bold font-heading">
                      {resolveT(service.title).charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 font-heading group-hover:text-primary transition-colors line-clamp-1 text-base">
                    {resolveT(service.title)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {resolveT(service.summary)}
                  </p>
                  <div className="mt-3.5 flex items-center gap-1.5 text-primary text-sm font-semibold">
                    <span>{locale === 'sw' ? 'Soma zaidi' : 'Learn more'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/services" className="btn-outline">
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
