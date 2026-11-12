import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Clock, BookOpen, Calendar, ArrowRight, MapPin } from 'lucide-react';
import { getTrainingProgrammes, getTrainingSteps, getIntakes, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface TrainingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TrainingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'sw' ? 'Mafunzo' : 'Training' };
}

export default async function TrainingPage({ params }: TrainingPageProps) {
  const { locale } = await params;
  const t = await getTranslations('training');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const [programmesResult, intakesResult, pageResult] = await Promise.allSettled([
    getTrainingProgrammes(locale),
    getIntakes(locale),
    getPage('training', locale),
  ]);
  const programmes = programmesResult.status === 'fulfilled' ? programmesResult.value : [];
  const intakes = intakesResult.status === 'fulfilled' ? intakesResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};

  // Map programme_id → title for the intakes table
  const programmeMap = new Map(programmes.map((p) => [p._id, resolveT(p.title)]));

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const intakeStatusLabel: Record<string, string> = {
    open:   locale === 'sw' ? 'Wazi' : 'Open',
    full:   locale === 'sw' ? 'Imejaa' : 'Full',
    closed: locale === 'sw' ? 'Imefungwa' : 'Closed',
  };
  const intakeStatusColors: Record<string, string> = {
    open:   'bg-green-100 text-green-700',
    full:   'bg-red-100 text-red-700',
    closed: 'bg-gray-100 text-gray-500',
  };

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Programme cards */}
      <section className="py-14 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {programmes.map((programme) => (
              <div
                key={programme._id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
              >
                {/* Cover image */}
                {programme.cover?.url ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={programme.cover.url}
                      alt={resolveT(programme.title)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
                        programme.is_open ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {programme.is_open ? t('openBadge') : t('closedBadge')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center relative" style={{ background: '#111111' }}>
                    <span className="text-white/10 text-6xl font-black font-heading">
                      {resolveT(programme.title).charAt(0)}
                    </span>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
                        programme.is_open ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {programme.is_open ? t('openBadge') : t('closedBadge')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 font-heading text-base mb-2">
                    {resolveT(programme.title)}
                  </h3>
                  {programme.summary && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {resolveT(programme.summary)}
                    </p>
                  )}

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {programme.duration && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
                        <Clock className="w-3 h-3" />
                        {resolveT(programme.duration)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
                      <BookOpen className="w-3 h-3" />
                      {t(programme.mode as Parameters<typeof t>[0])}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
                      {programme.fee_tzs === 0
                        ? (locale === 'sw' ? 'Bure' : 'Free')
                        : `TZS ${programme.fee_tzs.toLocaleString()}`}
                    </span>
                  </div>

                  {programme.next_intake && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>
                        {t('nextIntake')}:{' '}
                        <strong className="text-gray-800">
                          {new Date(programme.next_intake.start_date).toLocaleDateString(
                            locale === 'sw' ? 'sw-TZ' : 'en-TZ',
                            { day: 'numeric', month: 'long', year: 'numeric' }
                          )}
                        </strong>
                      </span>
                    </div>
                  )}

                  <div className="mt-auto flex gap-2">
                    {programme.is_open && (
                      <Link
                        href={`/training/${programme.slug}#apply`}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-center text-sm text-gray-900 transition-all"
                        style={{ background: '#F5B700' }}
                      >
                        {t('applyNow')}
                      </Link>
                    )}
                    <Link
                      href={`/training/${programme.slug}`}
                      className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-center text-sm hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-1.5"
                    >
                      {locale === 'sw' ? 'Soma Zaidi' : 'Learn More'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming intakes */}
      {intakes.length > 0 && (
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 font-heading mb-6">
              {locale === 'sw' ? 'Inteki Zinazokuja' : 'Upcoming Intakes'}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Programu' : 'Programme'}
                      </th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Tarehe ya Kuanza' : 'Start Date'}
                      </th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Tarehe ya Mwisho' : 'End Date'}
                      </th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        {t('venue')}
                      </th>
                      <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Hali' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {intakes.map((intake) => (
                      <tr key={intake._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {programmeMap.get(intake.programme_id) || (locale === 'sw' ? 'Programu' : 'Programme')}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {new Date(intake.start_date).toLocaleDateString(
                            locale === 'sw' ? 'sw-TZ' : 'en-TZ',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {new Date(intake.end_date).toLocaleDateString(
                            locale === 'sw' ? 'sw-TZ' : 'en-TZ',
                            { day: 'numeric', month: 'short', year: 'numeric' }
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-600">{resolveT(intake.venue)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            intakeStatusColors[intake.status] ?? 'bg-gray-100 text-gray-600'
                          }`}>
                            {intakeStatusLabel[intake.status] ?? intake.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
