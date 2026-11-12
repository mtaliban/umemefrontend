'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { Client } from '@/lib/types';
import { mediaUrl } from '@/lib/utils';

interface ClientsStripProps {
  clients: Client[];
  locale: string;
}

export default function ClientsStrip({ clients, locale }: ClientsStripProps) {
  if (!clients || clients.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...clients, ...clients];

  return (
    <section className="py-12 bg-surface border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          {locale === 'sw' ? 'Wateja Wetu' : 'Our Clients'}
        </p>
      </div>

      <div className="relative">
        <div
          className="flex gap-12 animate-scroll hover:[animation-play-state:paused]"
          style={{ width: 'max-content' }}
        >
          {doubled.map((client, i) => (
            <div
              key={`${client._id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center w-32 h-16"
            >
              {client.logo?.url ? (
                <Image
                  src={mediaUrl(client.logo.url) ?? client.logo.url}
                  alt={client.name}
                  width={128}
                  height={64}
                  className="max-h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-400 text-center">
                  {client.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
