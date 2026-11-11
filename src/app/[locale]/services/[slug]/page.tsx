import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, ArrowRight, Phone, Mail, MessageSquare } from 'lucide-react';
import { getService, getServices } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface ServiceDetailProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const services = await getServices('en');
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ServiceDetailProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const service = await getService(slug, locale);
    const resolveT = (f: { en: string; sw: string } | undefined) =>
      locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');
    return {
      title: resolveT(service.title),
      description: resolveT(service.summary),
      openGraph: { images: service.cover?.url ? [service.cover.url] : [] },
    };
  } catch {
    return { title: 'Service' };
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('services');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let service;
  try {
    service = await getService(slug, locale);
  } catch {
    notFound();
  }

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title'), href: '/services' },
    { label: resolveT(service.title) },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${siteUrl}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageBanner
        title={resolveT(service.title)}
        image={service.cover}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Body content */}
              {service.body && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div
                    className="prose prose-gray prose-headings:font-heading prose-headings:text-gray-900 prose-a:text-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: resolveT(service.body) }}
                  />
                </div>
              )}

              {/* What's included */}
              {service.included && service.included.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('whatsIncluded')}</h2>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {service.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{resolveT(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gallery */}
              {service.gallery && service.gallery.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">
                      {locale === 'sw' ? 'Picha' : 'Gallery'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {service.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                        <Image
                          src={img.url}
                          alt={resolveT(img.alt) || resolveT(service.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('serviceFaq')}</h2>
                  </div>
                  <div className="space-y-3">
                    {service.faqs.map((faq, i) => (
                      <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                        <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-semibold text-gray-900 hover:text-primary bg-surface group-open:bg-white transition-colors list-none">
                          <span className="pr-4">{resolveT(faq.q)}</span>
                          <span className="w-7 h-7 rounded-full border-2 border-gray-200 group-open:border-primary group-open:bg-primary/10 flex items-center justify-center flex-shrink-0 text-gray-400 group-open:text-primary group-open:rotate-45 transition-all text-lg font-light">
                            +
                          </span>
                        </summary>
                        <div className="px-5 pb-5 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {resolveT(faq.a)}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              {/* CTA Card */}
              <div
                className="rounded-2xl p-7 text-white sticky top-24 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}
              >
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
                />
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -left-4 -bottom-6 w-20 h-20 rounded-full bg-accent/20 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold font-heading mb-2">
                    {t('requestThisService')}
                  </h3>
                  <p className="text-white/95 text-sm mb-6 leading-relaxed">
                    {locale === 'sw'
                      ? 'Wasiliana nasi leo ili tuweze kukusaidia na mradi wako.'
                      : 'Get in touch with us today and let us help you with your project.'}
                  </p>
                  <Link
                    href={`/request-service?service=${service._id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
                  >
                    {t('requestThisService')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="mt-5 pt-5 border-t border-white/10 space-y-3">
                    <a href="/contact" className="flex items-center gap-3 text-sm text-white/95 hover:text-white transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>{locale === 'sw' ? 'Piga simu' : 'Call us'}</span>
                    </a>
                    <a href="/contact" className="flex items-center gap-3 text-sm text-white/95 hover:text-white transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span>{locale === 'sw' ? 'Tuma barua pepe' : 'Send email'}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Back to services */}
              <Link
                href="/services"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:border-primary hover:text-primary transition-all shadow-card"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                {locale === 'sw' ? 'Rudi huduma zote' : 'All services'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
