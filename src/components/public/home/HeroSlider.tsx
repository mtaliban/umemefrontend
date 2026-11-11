'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import type { HeroSlide } from '@/lib/types';

interface HeroSliderProps {
  slides: HeroSlide[];
  locale: string;
}

export default function HeroSlider({ slides, locale }: HeroSliderProps) {
  if (!slides || slides.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="relative w-full" aria-label="Hero slider">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="w-full h-[520px] sm:h-[600px] lg:h-[720px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full">
              {slide.image?.url ? (
                <Image
                  src={slide.image.url}
                  alt={resolveT(slide.image.alt) || resolveT(slide.headline)}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              ) : (
                <div className="w-full h-full" style={{ background: '#0B2545' }} />
              )}

              {/* Navy overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(105deg, rgba(11,37,69,0.92) 0%, rgba(11,37,69,0.70) 55%, rgba(11,37,69,0.30) 100%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
              />

              {/* Geometric decorations */}
              <div className="absolute right-0 top-0 h-full w-2/5 pointer-events-none hidden lg:block">
                <div className="absolute right-20 top-1/4 w-64 h-64 rounded-full border border-white/10" />
                <div className="absolute right-40 top-1/3 w-40 h-40 rounded-full border border-amber-400/15" />
                <div className="absolute right-16 bottom-32 w-5 h-5 rounded-full bg-amber-400/50" />
                <div className="absolute right-56 top-20 w-3 h-3 rounded-full bg-white/40" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    {/* Eyebrow accent */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-0.5 rounded-full" style={{ background: '#F59E0B' }} />
                      <div className="w-4 h-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.5)' }} />
                    </div>

                    {slide.headline && (
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-heading leading-tight mb-6" style={{ letterSpacing: '-0.03em' }}>
                        {resolveT(slide.headline)}
                      </h1>
                    )}
                    {slide.text && (
                      <p className="text-lg text-white/85 mb-10 leading-relaxed max-w-xl">
                        {resolveT(slide.text)}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4">
                      {slide.button1_url && slide.button1_label && (
                        <Link
                          href={slide.button1_url}
                          className="inline-flex items-center gap-2 px-7 py-4 text-white font-bold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-sm"
                          style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
                        >
                          {resolveT(slide.button1_label)}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                      {slide.button2_url && slide.button2_label && (
                        <Link
                          href={slide.button2_url}
                          className="inline-flex items-center gap-2 px-7 py-4 bg-white/12 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/22 transition-all duration-200 text-sm"
                        >
                          {resolveT(slide.button2_label)}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
