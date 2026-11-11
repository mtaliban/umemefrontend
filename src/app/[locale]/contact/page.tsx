import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { getOffices, getPage, getSettings } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import ContactForm from './ContactForm';

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Wasiliana Nasi' : 'Contact Us' };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations('contact');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [officesResult, pageResult, settingsResult] = await Promise.allSettled([
    getOffices(locale),
    getPage('contact', locale),
    getSettings(locale),
  ]);
  const offices = officesResult.status === 'fulfilled' ? officesResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';
  const orgJsonLd = settings
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: settings.company_name,
        url: siteUrl,
        telephone: settings.phones?.[0],
        email: settings.emails?.[0],
        address: {
          '@type': 'PostalAddress',
          streetAddress: resolveT(settings.address),
        },
      }
    : null;

  return (
    <>
      {orgJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      )}

      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Offices */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-heading mb-8">
                {t('ourOffices')}
              </h2>

              <div className="space-y-6">
                {offices.map((office) => (
                  <div key={office._id} className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                    <div className="flex items-start justify-between mb-5">
                      <h3 className="font-bold text-gray-900 font-heading text-lg">
                        {resolveT(office.name)}
                      </h3>
                      {office.is_head_office && (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          {t('headOffice')}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 text-sm">
                      {office.address && (
                        <li className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-gray-600 mt-1.5">{resolveT(office.address)}</span>
                        </li>
                      )}
                      {office.phone && (
                        <li className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                            <Phone className="w-4 h-4 text-primary" />
                          </div>
                          <a href={`tel:${office.phone}`} className="text-gray-600 hover:text-primary transition-colors mt-1.5">{office.phone}</a>
                        </li>
                      )}
                      {office.email && (
                        <li className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <a href={`mailto:${office.email}`} className="text-gray-600 hover:text-primary transition-colors break-all mt-1.5">{office.email}</a>
                        </li>
                      )}
                      {office.hours && (
                        <li className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                            <Clock className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-gray-600 mt-1.5">{resolveT(office.hours)}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-heading mb-8">
                {t('sendMessage')}
              </h2>
              <div className="bg-white rounded-2xl p-7 shadow-card border border-gray-100">
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
