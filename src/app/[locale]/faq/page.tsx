import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronDown, Zap, Droplets, GraduationCap, HelpCircle, MessageSquare } from 'lucide-react';
import { getFAQs, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Maswali Yanayoulizwa' : 'FAQ' };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const t = await getTranslations('faq');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [faqsResult, pageResult] = await Promise.allSettled([
    getFAQs(locale),
    getPage('faq', locale),
  ]);
  const faqs = faqsResult.status === 'fulfilled' ? faqsResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const categories = ['general', 'electricity', 'water', 'training'] as const;

  const catConfig: Record<string, { label: string; icon: typeof HelpCircle; color: string; bg: string }> = {
    general: {
      label: t('general'),
      icon: HelpCircle,
      color: 'text-primary',
      bg: 'rgba(234,88,12,0.08)',
    },
    electricity: {
      label: t('electricity'),
      icon: Zap,
      color: 'text-amber-600',
      bg: 'rgba(217,119,6,0.1)',
    },
    water: {
      label: t('water'),
      icon: Droplets,
      color: 'text-primary',
      bg: 'rgba(59,130,246,0.1)',
    },
    training: {
      label: t('training'),
      icon: GraduationCap,
      color: 'text-primary',
      bg: 'rgba(22,163,74,0.1)',
    },
  };

  const hasAny = categories.some((cat) => faqs.filter((f) => f.category === cat && f.is_active).length > 0);

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hasAny ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg">
                {locale === 'sw' ? 'Hakuna maswali yaliyopatikana' : 'No FAQs available'}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((category) => {
                const group = faqs.filter((f) => f.category === category && f.is_active);
                if (!group.length) return null;
                const { label, icon: Icon, color, bg } = catConfig[category];
                return (
                  <div key={category}>
                    {/* Category heading */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: bg }}
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 font-heading">{label}</h2>
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs font-semibold text-gray-400 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                        {group.length}
                      </span>
                    </div>

                    {/* Accordion items */}
                    <div className="space-y-2.5">
                      {group.map((faq) => (
                        <details
                          key={faq._id}
                          className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-shadow"
                        >
                          <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:text-primary bg-white group-open:bg-surface transition-colors list-none gap-4">
                            <span className="text-sm leading-relaxed">{resolveT(faq.question)}</span>
                            <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-open:border-primary group-open:bg-primary/5 flex items-center justify-center flex-shrink-0 transition-all">
                              <ChevronDown className={`w-4 h-4 text-gray-400 group-open:text-primary group-open:rotate-180 transition-transform`} />
                            </div>
                          </summary>
                          <div className="px-6 pb-5 pt-3 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                            {resolveT(faq.answer)}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div
            className="mt-16 rounded-2xl p-8 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
            />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading mb-2">
                {locale === 'sw' ? 'Hukupata jibu?' : "Didn't find your answer?"}
              </h3>
              <p className="text-white/95 text-sm mb-6 max-w-sm mx-auto">
                {locale === 'sw'
                  ? 'Wasiliana nasi moja kwa moja na timu yetu itakusaidia.'
                  : 'Contact us directly and our team will be happy to help you.'}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
              >
                {locale === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
