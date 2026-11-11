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
    <section className="relative py-20 lg:py-24 overflow-hidden" style={{ background: '#0B2545' }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Decorative circles */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
          <PhoneCall className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-semibold">
            {locale === 'sw' ? 'Wasiliana Nasi Leo' : 'Get In Touch Today'}
          </span>
        </div>

        {title && (
          <h2 className="text-3xl lg:text-5xl font-bold text-white font-heading mb-5 leading-tight">
            {title}
          </h2>
        )}
        {text && (
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {text}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {buttonLabel && (
            <Link
              href={cta.button_url ?? '/request-service'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-accent-dark font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
            >
              {buttonLabel}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/60 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
          >
            {locale === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </section>
  );
}
