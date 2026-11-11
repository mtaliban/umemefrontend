import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CheckCircle2, Phone, Mail, Wrench } from 'lucide-react';
import { getServices, getPage, getSettings } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import ServiceRequestForm from './ServiceRequestForm';

interface RequestServicePageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ service?: string }>;
}

export async function generateMetadata({ params }: RequestServicePageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Omba Huduma' : 'Request a Service' };
}

export default async function RequestServicePage({
  params,
  searchParams,
}: RequestServicePageProps) {
  const { locale } = await params;
  const { service: preselectedServiceId } = await searchParams;
  const t = await getTranslations('requestService');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [servicesResult, pageResult, settingsResult] = await Promise.allSettled([
    getServices(locale),
    getPage('services', locale),
    getSettings(locale),
  ]);
  const services = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const steps = locale === 'sw'
    ? [
        { label: 'Jaza fomu', desc: 'Toa maelezo ya huduma unayohitaji' },
        { label: 'Tutawasiliana', desc: 'Timu yetu itakupigia simu au kutuma barua pepe' },
        { label: 'Tathmini', desc: 'Tutafanya tathmini ya mahitaji yako bila malipo' },
        { label: 'Utekelezaji', desc: 'Tutatekeleza mradi kwa ubora wa juu' },
      ]
    : [
        { label: 'Submit request', desc: 'Fill in details about the service you need' },
        { label: 'We contact you', desc: 'Our team will reach out within 24 hours' },
        { label: 'Free assessment', desc: "We'll assess your requirements at no cost" },
        { label: 'Project delivery', desc: 'We execute your project to the highest standard' },
      ];

  return (
    <>
      <PageBanner
        title={t('title')}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">

            {/* Left sidebar: info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Intro card */}
              <div
                className="rounded-2xl p-7 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}
              >
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
                />
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white font-heading mb-2">
                    {locale === 'sw' ? 'Omba Huduma Yetu' : 'Request Our Services'}
                  </h2>
                  <p className="text-white/95 text-sm leading-relaxed">
                    {t('intro')}
                  </p>
                </div>
              </div>

              {/* Process steps */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="font-bold text-gray-900 font-heading mb-5 text-sm uppercase tracking-wide text-gray-500">
                  {locale === 'sw' ? 'Jinsi Inavyofanya Kazi' : 'How It Works'}
                </h3>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What you can expect */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="font-bold text-gray-900 font-heading mb-4 text-sm uppercase tracking-wide text-gray-500">
                  {locale === 'sw' ? 'Unachopata' : 'What to Expect'}
                </h3>
                <ul className="space-y-3">
                  {(locale === 'sw'
                    ? ['Majibu ndani ya masaa 24', 'Tathmini ya bila malipo', 'Mshauri aliyebobea', 'Gharama wazi bila ya kuficha']
                    : ['Response within 24 hours', 'Free site assessment', 'Dedicated expert advisor', 'Transparent pricing with no hidden costs']
                  ).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact info */}
              {settings && (
                <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                  <h3 className="font-bold text-gray-900 font-heading mb-4 text-sm uppercase tracking-wide text-gray-500">
                    {locale === 'sw' ? 'Au Wasiliana Nasi Moja kwa Moja' : 'Or Reach Us Directly'}
                  </h3>
                  <div className="space-y-3">
                    {settings.phones?.[0] && (
                      <a
                        href={`tel:${settings.phones[0]}`}
                        className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{settings.phones[0]}</span>
                      </a>
                    )}
                    {settings.emails?.[0] && (
                      <a
                        href={`mailto:${settings.emails[0]}`}
                        className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium break-all">{settings.emails[0]}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <ServiceRequestForm
                services={services.map((s) => ({
                  id: s._id,
                  name: resolveT(s.title),
                }))}
                preselectedServiceId={preselectedServiceId}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
