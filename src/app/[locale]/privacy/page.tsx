import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Shield, CalendarDays, FileText } from 'lucide-react';
import { getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface PrivacyPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy' };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let page;
  try {
    page = await getPage('privacy', locale);
  } catch {
    page = {};
  }

  const title = resolveT(page.title) || (locale === 'sw' ? 'Sera ya Faragha' : 'Privacy Policy');

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: title },
  ];

  return (
    <>
      <PageBanner title={title} image={page.banner} breadcrumbs={breadcrumbs} />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Info bar */}
          <div className="flex flex-wrap items-center gap-6 p-5 bg-white rounded-2xl shadow-card border border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {locale === 'sw' ? 'Hati' : 'Document'}
                </p>
                <p className="text-sm font-bold text-gray-900">{title}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <span>
                {locale === 'sw' ? 'Ilisasishwa: ' : 'Last updated: '}
                <strong className="text-gray-700">
                  {new Date().toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </strong>
              </span>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>{locale === 'sw' ? 'Makubaliano ya Mtumiaji' : 'User Agreement'}</span>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            {page.body ? (
              <div className="p-8 lg:p-12">
                <div
                  className="prose prose-gray prose-headings:font-heading prose-headings:text-gray-900 prose-h2:text-xl prose-h3:text-base prose-a:text-primary prose-strong:text-gray-900 prose-li:text-gray-600 max-w-none"
                  dangerouslySetInnerHTML={{ __html: resolveT(page.body) }}
                />
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-gray-400 text-base">
                  {locale === 'sw'
                    ? 'Sera ya faragha itaongezwa hivi karibuni.'
                    : 'Privacy policy content will be added soon.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-gray-400">
            {locale === 'sw'
              ? 'Kwa maswali kuhusu sera hii ya faragha, wasiliana nasi kupitia ukurasa wa'
              : 'For questions about this privacy policy, contact us via our'}{' '}
            <a href="/contact" className="text-primary font-semibold hover:underline">
              {locale === 'sw' ? 'mawasiliano' : 'contact page'}
            </a>.
          </p>
        </div>
      </section>
    </>
  );
}
