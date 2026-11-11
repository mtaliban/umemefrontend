import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, DollarSign, ArrowRight, GraduationCap } from 'lucide-react';
import type { TrainingProgramme } from '@/lib/types';

interface TrainingHighlightProps {
  programme: TrainingProgramme;
  locale: string;
  applyNowLabel: string;
  nextIntakeLabel: string;
}

export default function TrainingHighlight({
  programme,
  locale,
  applyNowLabel,
  nextIntakeLabel,
}: TrainingHighlightProps) {
  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  if (!resolveT(programme.title)) return null;

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/4 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image */}
          {programme.cover?.url && (
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src={programme.cover.url}
                  alt={resolveT(programme.cover.alt) || resolveT(programme.title)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              {/* Badge */}
              {programme.is_open && (
                <div className="absolute top-5 left-5 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {locale === 'sw' ? 'Zinakubali Maombi' : 'Accepting Applications'}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-primary/8 rounded-full px-4 py-1.5 mb-4"
              style={{ background: 'rgba(234,88,12,0.08)' }}>
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                {locale === 'sw' ? 'Programu ya Mafunzo' : 'Training Programme'}
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-heading leading-tight">
              {resolveT(programme.title)}
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed text-base">
              {resolveT(programme.summary)}
            </p>

            {/* Meta pills */}
            <div className="mt-7 flex flex-wrap gap-3">
              {programme.duration && (
                <div className="flex items-center gap-2 bg-surface border border-gray-100 px-4 py-2.5 rounded-xl text-sm shadow-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-gray-500">{locale === 'sw' ? 'Muda:' : 'Duration:'}</span>
                  <span className="font-semibold text-gray-900">{resolveT(programme.duration)}</span>
                </div>
              )}
              {programme.fee_tzs !== undefined && (
                <div className="flex items-center gap-2 bg-surface border border-gray-100 px-4 py-2.5 rounded-xl text-sm shadow-sm">
                  <DollarSign className="w-4 h-4 text-accent-dark" />
                  <span className="text-gray-500">{locale === 'sw' ? 'Ada:' : 'Fee:'}</span>
                  <span className="font-semibold text-gray-900">
                    {programme.fee_tzs === 0
                      ? (locale === 'sw' ? 'Bure' : 'Free')
                      : `TZS ${programme.fee_tzs.toLocaleString()}`}
                  </span>
                </div>
              )}
            </div>

            {/* Next intake */}
            {programme.next_intake && (
              <div className="mt-5 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl">
                <Calendar className="w-4 h-4 text-accent-dark" />
                <span className="text-sm text-gray-700">
                  {nextIntakeLabel}:{' '}
                  <strong className="text-accent-dark">
                    {new Date(programme.next_intake.start_date).toLocaleDateString(
                      locale === 'sw' ? 'sw-TZ' : 'en-TZ',
                      { day: 'numeric', month: 'long', year: 'numeric' }
                    )}
                  </strong>
                </span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {programme.is_open && (
                <Link
                  href={`/training/${programme.slug}`}
                  className="btn-accent"
                >
                  {applyNowLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="/training"
                className="btn-outline"
              >
                {locale === 'sw' ? 'Programu Zote' : 'All Programmes'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
