import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Clock, MapPin, Award, Users, BookOpen, Calendar, ArrowRight, GraduationCap } from 'lucide-react';
import { getTrainingProgramme, getTrainingProgrammes } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import TrainingApplicationForm from './TrainingApplicationForm';

interface TrainingDetailProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const programmes = await getTrainingProgrammes('en');
    return programmes.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: TrainingDetailProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const programme = await getTrainingProgramme(slug, locale);
    const resolveT = (f: { en: string; sw: string } | undefined) =>
      locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');
    return {
      title: resolveT(programme.title),
      description: resolveT(programme.summary),
    };
  } catch {
    return { title: 'Training Programme' };
  }
}

export default async function TrainingDetailPage({ params }: TrainingDetailProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('training');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let programme;
  try {
    programme = await getTrainingProgramme(slug, locale);
  } catch {
    notFound();
  }

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title'), href: '/training' },
    { label: resolveT(programme.title) },
  ];

  const intakeStatusColors: Record<string, string> = {
    open: 'bg-green-500 text-white',
    full: 'bg-red-500 text-white',
    closed: 'bg-gray-400 text-white',
  };

  return (
    <>
      <PageBanner
        title={resolveT(programme.title)}
        image={programme.cover}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {programme.summary && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-lg">{resolveT(programme.summary)}</p>
                </div>
              )}

              {programme.audience && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {t('audience')}
                    </h2>
                  </div>
                  <div
                    className="prose prose-gray prose-headings:font-heading prose-a:text-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: resolveT(programme.audience) }}
                  />
                </div>
              )}

              {programme.requirements && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('requirements')}</h2>
                  </div>
                  <div
                    className="prose prose-gray prose-headings:font-heading prose-a:text-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: resolveT(programme.requirements) }}
                  />
                </div>
              )}

              {programme.outline && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {t('outline')}
                    </h2>
                  </div>
                  <div
                    className="prose prose-gray prose-headings:font-heading prose-a:text-primary max-w-none"
                    dangerouslySetInnerHTML={{ __html: resolveT(programme.outline) }}
                  />
                </div>
              )}

              {/* Intakes */}
              {programme.intakes && programme.intakes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1 rounded-full bg-accent" />
                      <h2 className="text-xl font-bold text-gray-900 font-heading">{t('intakes')}</h2>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface">
                        <tr>
                          <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{locale === 'sw' ? 'Kuanza' : 'Start'}</th>
                          <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{locale === 'sw' ? 'Kumalizika' : 'End'}</th>
                          <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{t('venue')}</th>
                          <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{locale === 'sw' ? 'Viti' : 'Seats'}</th>
                          <th className="text-left p-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{locale === 'sw' ? 'Hali' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programme.intakes.map((intake, i) => (
                          <tr key={intake._id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-surface/50' : ''}`}>
                            <td className="p-4 text-gray-700">{new Date(intake.start_date).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="p-4 text-gray-700">{new Date(intake.end_date).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="p-4 text-gray-700">{resolveT(intake.venue)}</td>
                            <td className="p-4 text-gray-700 font-semibold">{intake.seats}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${intakeStatusColors[intake.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                {intake.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Application form */}
              <div id="apply">
                {programme.is_open ? (
                  <TrainingApplicationForm
                    programmeId={programme._id}
                    programmeName={resolveT(programme.title)}
                    intakes={programme.intakes ?? []}
                    locale={locale}
                  />
                ) : (
                  <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(217,119,6,0.1)' }}>
                        <GraduationCap className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 font-heading mb-1">{t('applicationClosed')}</h3>
                        <p className="text-sm text-gray-500">
                          {locale === 'sw'
                            ? 'Maombi yamefungwa kwa sasa. Rudi tena baadaye au wasiliana nasi.'
                            : 'Applications are currently closed. Check back later or contact us for more information.'}
                        </p>
                        <Link href="/contact" className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary hover:underline">
                          {locale === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 sticky top-24 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 font-heading">
                      {locale === 'sw' ? 'Maelezo ya Programu' : 'Programme Details'}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      programme.is_open ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {programme.is_open ? t('openBadge') : t('closedBadge')}
                    </span>
                  </div>
                </div>

                {/* Detail items */}
                <div className="p-6 space-y-4">
                  {programme.duration && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('duration')}</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{resolveT(programme.duration)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('mode')}</p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-900 capitalize">{programme.mode}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(217,119,6,0.1)' }}>
                      <span className="text-amber-600 font-bold text-xs">TZS</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('fee')}</p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-900">
                        {programme.fee_tzs === 0
                          ? (locale === 'sw' ? 'Bure' : 'Free')
                          : `TZS ${programme.fee_tzs.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  {programme.venue && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('venue')}</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{resolveT(programme.venue)}</p>
                      </div>
                    </div>
                  )}

                  {programme.certificate && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,88,12,0.08)' }}>
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{t('certificate')}</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{resolveT(programme.certificate)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                {programme.is_open && (
                  <div className="p-6 pt-0">
                    <div className="border-t border-gray-100 pt-5">
                      <a
                        href="#apply"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
                      >
                        <GraduationCap className="w-4 h-4" />
                        {t('applyNow')}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/training"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:border-primary hover:text-primary transition-all shadow-card"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                {locale === 'sw' ? 'Rudi programu zote' : 'All programmes'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
