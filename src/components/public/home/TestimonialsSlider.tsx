'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import type { Testimonial } from '@/lib/types';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
  locale: string;
}

export default function TestimonialsSlider({ testimonials, locale }: TestimonialsSliderProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}>
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent font-bold text-xs uppercase tracking-widest">
            {locale === 'sw' ? 'Ushuhuda' : 'Testimonials'}
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white font-heading">
            {locale === 'sw' ? 'Wateja Wetu Wanasema Nini' : 'What Our Clients Say'}
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            1024: { slidesPerView: 2 },
          }}
          className="pb-14"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item._id} className="h-auto">
              <div className="relative bg-white/8 backdrop-blur-sm rounded-2xl p-7 h-full border border-white/10 hover:bg-white/12 transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-20">
                  <Quote className="w-8 h-8 text-white" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < item.rating ? 'text-accent fill-accent' : 'text-white/20'}`}
                    />
                  ))}
                </div>

                <blockquote className="text-white/95 leading-relaxed mb-6 text-sm lg:text-base">
                  "{resolveT(item.quote)}"
                </blockquote>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                  {item.photo?.url ? (
                    <Image
                      src={item.photo.url}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover ring-2 ring-accent/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md"
                      style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">{item.name}</p>
                    <p className="text-white/95 text-xs mt-0.5">
                      {resolveT(item.position)}
                      {item.organisation && `, ${item.organisation}`}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
