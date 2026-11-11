import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Clock, BookOpen, Calendar, ArrowRight, MapPin, Users } from 'lucide-react';
import { getTrainingProgrammes, getTrainingSteps, getIntakes, getPage } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

interface TrainingPageProps {
  params: Promise<{ locale: Locale }>;
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

  const [programmesResult, stepsResult, intakesResult, pageResult] = await Promise.allSettled([
    getTrainingProgrammes(locale),
    getTrainingSteps(locale),
    getIntakes(locale),
    getPage('training', locale),
  ]);
  const programmes = programmesResult.status === 'fulfilled' ? programmesResult.value : [];
  const steps = stepsResult.status === 'fulfilled' ? stepsResult.value : [];
  const intakes = intakesResult.status === 'fulfilled' ? intakesResult.value : [];
  const page = pageResult.status === 'fulfilled' ? pageResult.value : {};

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title') },
  ];

  const intakeStatusColors: Record<string, string> = {
    open: 'bg-green-500 text-white',
    full: 'bg-red-500 text-white',
    closed: 'bg-gray-400 text-white',
  };

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Intro */}
      {page.intro && (
        <section className="py-10 bg-surface border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 leading-relaxed text-lg">{resolveT(page.intro)}</p>
          </div>
        </section>
      )}

      {/* Programme cards */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-label">{locale === 'sw' ? 'Elimu & Mafunzo' : 'Education & Training'}</span>
            <h2 className="mt-3 section-title">{locale === 'sw' ? 'Programu Zetu' : 'Our Programmes'}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programmes.map((programme) => (
              <div
                key={programme._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col"
              >
                {programme.cover?.url ? (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={programme.cover.url}
                      alt={resolveT(programme.cover.alt) || resolveT(programme.title)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        programme.is_open ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {programme.is_open ? t('openBadge') : t('closedBadge')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-52 gradient-primary flex items-center justify-center relative">
                    <span className="text-5xl font-bold text-white/20 font-heading">
                      {resolveT(programme.title).charAt(0)}
                    </span>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        programme.is_open ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {programme.is_open ? t('openBadge') : t('closedBadge')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 font-heading text-lg group-hover:text-primary transition-colors">
                    {resolveT(programme.title)}
                  </h3>

                  <p className="mt-2 text-gray-500 text-sm leading-relaxed mb-5">
                    {resolveT(programme.summary)}
                  </p>

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {programme.duration && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-xs font-semibold text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {resolveT(programme.duration)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-xs font-semibold text-gray-600">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      {t(programme.mode as Parameters<typeof t>[0])}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-xs font-semibold text-gray-600">
                      <span className="text-primary font-bold text-xs">TZS</span>
                      {programme.fee_tzs === 0
                        ? (locale === 'sw' ? 'Bure' : 'Free')
                        : programme.fee_tzs.toLocaleString()}
                    </span>
                  </div>

                  {programme.next_intake && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 p-3 bg-surface rounded-xl">
                      <Calendar className="w-4 h-4 text-accent-dark flex-shrink-0" />
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

                  <div className="mt-auto flex gap-3">
                    {programme.is_open && (
                      <Link
                        href={`/training/${programme.slug}#apply`}
                        className="flex-1 py-2.5 rounded-xl font-semibold text-center text-sm text-white transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
                      >
                        {t('applyNow')}
                      </Link>
                    )}
                    <Link
                      href={`/training/${programme.slug}`}
                      className={`flex-1 py-2.5 rounded-xl border border-primary text-primary font-semibold text-center text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5`}
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

      {/* Training process steps */}
      {steps.length > 0 && (
        <section
          className="py-16 lg:py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-accent font-bold text-xs uppercase tracking-widest">{locale === 'sw' ? 'Jinsi Inavyofanya Kazi' : 'How It Works'}</span>
              <h2 className="mt-3 text-3xl font-bold text-white font-heading">{t('trainingProcess')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <div key={step._id} className="relative text-center">
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-14 left-1/2 w-full h-0.5 opacity-20"
                      style={{ background: 'linear-gradient(to right, #F59E0B, transparent)' }} />
                  )}
                  <div
                    className="w-28 h-28 rounded-full mx-auto mb-5 flex items-center justify-center relative"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.15)' }}
                  >
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
                    >
                      {step.number}
                    </div>
                    <span className="text-white/60 text-4xl font-bold font-heading">{step.number}</span>
                  </div>
                  <h3 className="font-bold text-white font-heading mb-2">{resolveT(step.title)}</h3>
                  <p className="text-sm text-white/95 leading-relaxed">{resolveT(step.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming intakes table */}
      {intakes.length > 0 && (
        <section className="py-16 lg:py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-6 w-1 rounded-full bg-accent" />
              <h2 className="text-2xl font-bold text-gray-900 font-heading">{t('intakes')}</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}>
                      <th className="text-left p-4 font-semibold text-white/80 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Programu' : 'Programme'}
                      </th>
                      <th className="text-left p-4 font-semibold text-white/80 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Tarehe ya Kuanza' : 'Start Date'}
                      </th>
                      <th className="text-left p-4 font-semibold text-white/80 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Tarehe ya Kumalizika' : 'End Date'}
                      </th>
                      <th className="text-left p-4 font-semibold text-white/80 text-xs uppercase tracking-wide">
                        {t('venue')}
                      </th>
                      <th className="text-left p-4 font-semibold text-white/80 text-xs uppercase tracking-wide">
                        {locale === 'sw' ? 'Hali' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {intakes.map((intake, i) => (
                      <tr key={intake._id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-surface/50' : ''} hover:bg-primary/5 transition-colors`}>
                        <td className="p-4 text-gray-900 font-medium">{intake.programme_id}</td>
                        <td className="p-4 text-gray-600">
                          {new Date(intake.start_date).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(intake.end_date).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4 text-gray-600">{resolveT(intake.venue)}</td>
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
          </div>
        </section>
      )}
    </>
  );
}
