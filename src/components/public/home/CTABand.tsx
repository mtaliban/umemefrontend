import Link from 'next/link';
import { ArrowRight, PhoneCall } from 'lucide-react';
import type { CTA } from '@/lib/types';

interface CTABandProps {
  cta: CTA;
  locale: string;
}

export default function CTABand({ cta, locale }: CTABandProps) {
  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  const title = resolveT(cta.title);
  const text = resolveT(cta.text);
  const buttonLabel = resolveT(cta.button_label);

  if (!title && !buttonLabel) return null;

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden" style={{ background: '#111111' }}>
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-5">
          <PhoneCall className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-sm font-medium">
            {locale === 'sw' ? 'Wasiliana Nasi Leo' : 'Get In Touch Today'}
          </span>
        </div>

        {title && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-heading mb-4 leading-tight">
            {title}
          </h2>
        )}
        {text && (
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            {text}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {buttonLabel && (
            <Link
              href={cta.button_url ?? '/request-service'}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-lg transition-opacity hover:opacity-90 text-sm"
              style={{ background: '#F5B700', color: '#111111' }}
            >
              {buttonLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-sm"
          >
            {locale === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </section>
  );
}
