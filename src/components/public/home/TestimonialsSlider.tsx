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
    <section className="py-14 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">
            {locale === 'sw' ? 'Wateja Wetu Wanasema Nini' : 'What Our Clients Say'}
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{ 1024: { slidesPerView: 2 } }}
          className="pb-12"
        >
          {testimonials.slice(0, 3).map((item) => (
            <SwiperSlide key={item._id} className="h-auto">
              <div className="bg-white rounded-xl p-6 h-full border border-gray-100 shadow-card relative">
                <div className="absolute top-5 right-5 opacity-10">
                  <Quote className="w-7 h-7 text-gray-900" />
                </div>

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{
                        color: i < item.rating ? '#F5B700' : '#E5E7EB',
                        fill: i < item.rating ? '#F5B700' : '#E5E7EB',
                      }}
                    />
                  ))}
                </div>

                <blockquote className="text-gray-700 leading-relaxed mb-5 text-sm">
                  &ldquo;{resolveT(item.quote)}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {item.photo?.url ? (
                    <Image
                      src={item.photo.url}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: '#F5B700', color: '#111111' }}
                    >
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
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
