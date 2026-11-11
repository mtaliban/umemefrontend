import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { PageValue } from '@/lib/types';

interface AboutPreviewProps {
  about: PageValue;
  locale: string;
  readMoreLabel: string;
}

export default function AboutPreview({ about, locale, readMoreLabel }: AboutPreviewProps) {
  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  const intro = resolveT(about.intro);
  if (!intro) return null;

  const keyPoints = about.values?.slice(0, 4) ?? [];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-primary/4 pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-accent/5 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="section-label">
            {locale === 'sw' ? 'Kuhusu Sisi' : 'About Us'}
          </span>
          <h2 className="mt-3 section-title">
            {resolveT(about.title) || (locale === 'sw' ? 'Kampuni Yetu' : 'Our Company')}
          </h2>
        </div>

        <p className="text-gray-600 leading-relaxed text-lg text-center max-w-3xl mx-auto">{intro}</p>

        {keyPoints.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {keyPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-card border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-800 font-semibold">{resolveT(point.title)}</span>
                  {point.text && (
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{resolveT(point.text)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/about" className="btn-primary">
            {readMoreLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
