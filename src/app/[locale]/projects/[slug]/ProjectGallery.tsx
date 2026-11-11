'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { ImageField } from '@/lib/types';

interface ProjectGalleryProps {
  images: ImageField[];
  locale: string;
}

export default function ProjectGallery({ images, locale }: ProjectGalleryProps) {
  const [index, setIndex] = useState(-1);

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const slides = images.map((img) => ({
    src: img.url,
    alt: resolveT(img.alt),
    width: img.width || 1200,
    height: img.height || 800,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            className="relative aspect-video rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={resolveT(img.alt)}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-primary" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
      />
    </>
  );
}
