'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, Play } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import type { GalleryItem } from '@/lib/types';

interface AlbumGridProps {
  items: GalleryItem[];
  locale: string;
}

export default function AlbumGrid({ items, locale }: AlbumGridProps) {
  const [index, setIndex] = useState(-1);

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  const photos = items.filter((i) => i.type === 'photo' && i.image?.url);
  const slides = photos.map((item) => ({
    src: item.image!.url,
    alt: resolveT(item.caption),
    width: item.image!.width || 1200,
    height: item.image!.height || 800,
  }));

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {items.map((item, i) => {
          if (item.type === 'video' && item.video_url) {
            const embedUrl = item.video_url
              .replace('youtube.com/watch?v=', 'youtube-nocookie.com/embed/')
              .replace('youtu.be/', 'youtube-nocookie.com/embed/');
            return (
              <div key={i} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    src={embedUrl}
                    title={resolveT(item.caption) || `Video ${i + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {item.caption && (
                  <div className="px-4 py-3 bg-surface flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <p className="text-sm text-gray-600">{resolveT(item.caption)}</p>
                  </div>
                )}
              </div>
            );
          }

          if (item.type === 'photo' && item.image?.url) {
            const photoIndex = photos.indexOf(item);
            return (
              <div key={i} className="break-inside-avoid group">
                <button
                  type="button"
                  className="w-full rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 relative block"
                  onClick={() => setIndex(photoIndex)}
                  aria-label={resolveT(item.caption) || `Image ${i + 1}`}
                >
                  <Image
                    src={item.image.url}
                    alt={resolveT(item.caption) || ''}
                    width={item.image.width || 800}
                    height={item.image.height || 600}
                    className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                      <ZoomIn className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </button>
                {item.caption && (
                  <p className="px-1 pt-2 pb-1 text-sm text-gray-500 leading-relaxed">{resolveT(item.caption)}</p>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Video]}
      />
    </>
  );
}
