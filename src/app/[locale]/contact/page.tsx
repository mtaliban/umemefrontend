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
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {settings?.phones?.[0] && (
                    <a href={`tel:${settings.phones[0]}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEF9E7' }}>
                        <Phone className="w-5 h-5" style={{ color: '#D97706' }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{locale === 'sw' ? 'Simu' : 'Phone'}</p>
                        <p className="text-sm font-semibold text-gray-900">{settings.phones[0]}</p>
                      </div>
                    </a>
                  )}
                  {settings?.emails?.[0] && (
                    <a href={`mailto:${settings.emails[0]}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Email</p>
                        <p className="text-sm font-semibold text-gray-900 break-all">{settings.emails[0]}</p>
                      </div>
                    </a>
                  )}
                  {settings?.address && (
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F0FDF4' }}>
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{locale === 'sw' ? 'Anwani' : 'Address'}</p>
                        <p className="text-sm font-semibold text-gray-900">{resolveT(settings.address)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                offices.map((office) => (
                  <div key={office._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100" style={{ background: '#111111' }}>
                      <h3 className="font-bold text-white text-sm font-heading">
                        {resolveT(office.name)}
                      </h3>
                      {office.is_head_office && (
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full" style={{ background: '#F5B700', color: '#111111' }}>
                          {t('headOffice')}
                        </span>
                      )}
                    </div>
                    <div className="divide-y divide-gray-50">
                      {office.address && (
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F0FDF4' }}>
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{locale === 'sw' ? 'Anwani' : 'Address'}</p>
                            <p className="text-sm text-gray-800">{resolveT(office.address)}</p>
                          </div>
                        </div>
                      )}
                      {office.phone && (
                        <a href={`tel:${office.phone}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEF9E7' }}>
                            <Phone className="w-5 h-5" style={{ color: '#D97706' }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{locale === 'sw' ? 'Simu' : 'Phone'}</p>
                            <p className="text-sm font-semibold text-gray-900">{office.phone}</p>
                          </div>
                        </a>
                      )}
                      {office.email && (
                        <a href={`mailto:${office.email}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EFF6FF' }}>
                            <Mail className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Email</p>
                            <p className="text-sm font-semibold text-gray-900 break-all">{office.email}</p>
                          </div>
                        </a>
                      )}
                      {office.hours && (
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F5F3FF' }}>
                            <Clock className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium">{locale === 'sw' ? 'Masaa ya Kazi' : 'Working Hours'}</p>
                            <p className="text-sm text-gray-800">{resolveT(office.hours)}</p>
                          </div>
                        </div>
                      )}
                    </div>
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

          {/* Bottom contact buttons */}
          {(settings?.emails?.[0] || settings?.whatsapp_number) && (
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              {settings?.emails?.[0] && (
                <a
                  href={`mailto:${settings.emails[0]}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  {settings.emails[0]}
                </a>
              )}
              {settings?.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: '#25D366' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
