import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Droplets } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';
import { mediaUrl } from '@/lib/utils';

interface HeroSliderProps {
  slides: HeroSlide[];
  locale: string;
}

export default function HeroSlider({ slides, locale }: HeroSliderProps) {
  if (!slides || slides.length === 0) return null;

  const slide = slides[0];

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  const imgSrc = mediaUrl(slide.image?.url);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '70svh', minHeight: '380px', maxHeight: '720px' }}
      aria-label="Hero"
    >
      {/* Background */}
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 40%, #0c2340 100%)' }}
        >
          <div className="absolute inset-0 flex items-center justify-end pr-16 opacity-5">
            <Zap className="w-72 h-72 text-yellow-400" />
          </div>
          <div className="absolute inset-0 flex items-center justify-start pl-16 opacity-5">
            <Droplets className="w-72 h-72 text-blue-400" />
          </div>
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {slide.headline && (
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-heading leading-tight mb-8"
                style={{ letterSpacing: '-0.02em' }}
              >
                {resolveT(slide.headline)}
              </h1>
            )}
            <div className="flex flex-wrap gap-3">
              {slide.button1_url && slide.button1_label && (
                <Link
                  href={slide.button1_url}
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition-opacity hover:opacity-90 text-sm"
                  style={{ background: '#F5B700', color: '#111111' }}
                >
                  {resolveT(slide.button1_label)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {slide.button2_url && slide.button2_label && (
                <Link
                  href={slide.button2_url}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-bold rounded-lg border-2 border-white/60 hover:bg-white/10 transition-colors text-sm"
                >
                  {resolveT(slide.button2_label)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
