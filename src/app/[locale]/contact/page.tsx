import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { getOffices, getPage, getSettings } from '@/lib/api';
import ContactForm from './ContactForm';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
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
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';
  const orgJsonLd = settings
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: settings.company_name,
        url: siteUrl,
        telephone: settings.phones?.[0],
        email: settings.emails?.[0],
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

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-heading">
            {locale === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
          </h1>

          {/* Quick contact strip — always visible */}
          <div className="mt-4 flex flex-wrap gap-3">
            {settings?.phones?.[0] && (
              <a
                href={`tel:${settings.phones[0]}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-900"
                style={{ background: '#F5B700' }}
              >
                <Phone className="w-4 h-4" />
                {settings.phones[0]}
              </a>
            )}
            {settings?.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: '#25D366' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            )}
            {settings?.emails?.[0] && (
              <a
                href={`mailto:${settings.emails[0]}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {settings.emails[0]}
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="py-10 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: form first, then offices. Desktop: side by side */}
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-14">

            {/* Office info */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 font-heading">
                {t('ourOffices')}
              </h2>
              {offices.length === 0 ? (
                /* Fallback: show settings contact info if no offices */
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-3">
                  {settings?.phones?.[0] && (
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${settings.phones[0]}`} className="hover:text-gray-900">{settings.phones[0]}</a>
                    </div>
                  )}
                  {settings?.emails?.[0] && (
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${settings.emails[0]}`} className="hover:text-gray-900 break-all">{settings.emails[0]}</a>
                    </div>
                  )}
                  {settings?.address && (
                    <div className="flex items-start gap-3 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{resolveT(settings.address)}</span>
                    </div>
                  )}
                </div>
              ) : (
                offices.map((office) => (
                  <div key={office._id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-sm font-heading">
                        {resolveT(office.name)}
                      </h3>
                      {office.is_head_office && (
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full" style={{ background: '#FEF9E7', color: '#D97706' }}>
                          {t('headOffice')}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2.5">
                      {office.address && (
                        <li className="flex items-start gap-2.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{resolveT(office.address)}</span>
                        </li>
                      )}
                      {office.phone && (
                        <li className="flex items-center gap-2.5 text-sm">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <a href={`tel:${office.phone}`} className="text-gray-700 hover:text-gray-900 font-medium">{office.phone}</a>
                        </li>
                      )}
                      {office.email && (
                        <li className="flex items-center gap-2.5 text-sm">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="text-gray-700 hover:text-gray-900 break-all">{office.email}</a>
                        </li>
                      )}
                      {office.hours && (
                        <li className="flex items-center gap-2.5 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{resolveT(office.hours)}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Contact form — appears first on mobile */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-heading mb-4">
                {t('sendMessage')}
              </h2>
              <div className="bg-white rounded-xl p-5 sm:p-7 border border-gray-100 shadow-sm">
                <ContactForm locale={locale} />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
