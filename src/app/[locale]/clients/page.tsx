import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import { getClients, getTestimonials, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface ClientsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ClientsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Wateja na Washirika' : 'Clients & Partners' };
}

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('clients');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [clientsResult, testimonialsResult, pageResult] = await Promise.allSettled([
    getClients(locale),
    getTestimonials(locale),
    getPage('clients', locale),
  ]);
  const clients = clientsResult.status === 'fulfilled' ? clientsResult.value : [];
  const testimonials = testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const clientsByType = {
    government: clients.filter((c) => c.type === 'government'),
    private: clients.filter((c) => c.type === 'private'),
    ngo: clients.filter((c) => c.type === 'ngo'),
  };

  const typeLabels: Record<string, string> = {
    government: locale === 'sw' ? 'Serikali' : 'Government',
    private: locale === 'sw' ? 'Sekta Binafsi' : 'Private Sector',
    ngo: 'NGO / International',
  };

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Clients by type */}
      {(['government', 'private', 'ngo'] as const).map((type, idx) => {
        const group = clientsByType[type];
        if (!group.length) return null;
        return (
          <section key={type} className={`py-14 ${idx % 2 === 0 ? 'bg-white' : 'bg-surface'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-6 w-1 rounded-full bg-accent" />
                <h2 className="text-xl font-bold text-gray-900 font-heading">{typeLabels[type]}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {group.map((client) => (
                  <div
                    key={client._id}
                    className="group flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    {client.logo?.url ? (
                      <Image
                        src={client.logo.url}
                        alt={client.name}
                        width={100}
                        height={60}
                        className="max-h-14 w-auto object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-20 h-12 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500 text-center leading-tight">{client.name}</span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-400 text-center line-clamp-1">{client.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-accent font-bold text-xs uppercase tracking-widest">{locale === 'sw' ? 'Ushuhuda' : 'Testimonials'}</span>
              <h2 className="mt-3 text-3xl font-bold text-white font-heading">{t('testimonials')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <div key={item._id} className="rounded-2xl p-7 border border-white/10 hover:border-white/20 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-accent fill-accent' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <blockquote className="text-white/95 text-sm leading-relaxed mb-5">
                    "{resolveT(item.quote)}"
                  </blockquote>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {item.photo?.url ? (
                      <Image src={item.photo.url} alt={item.name} width={44} height={44} className="rounded-full object-cover ring-2 ring-accent/30" />
                    ) : (
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                        style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white text-sm">{item.name}</p>
                      <p className="text-xs text-white/95 mt-0.5">
                        {resolveT(item.position)}{item.organisation && `, ${item.organisation}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
