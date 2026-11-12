'use client';

import Image from 'next/image';
import type { Client } from '@/lib/types';

interface ClientsStripProps {
  clients: Client[];
  locale: string;
}

export default function ClientsStrip({ clients, locale }: ClientsStripProps) {
  if (!clients || clients.length === 0) return null;

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-8">
          {locale === 'sw' ? 'Wateja Wetu' : 'Our Clients'}
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div
              key={client._id}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-gray-50"
            >
              {client.logo?.url ? (
                <div className="relative w-16 h-10 flex-shrink-0">
                  <Image
                    src={client.logo.url}
                    alt={client.name}
                    fill
                    className="object-contain grayscale hover:grayscale-0 transition-all"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: '#F5B700', color: '#111111' }}
                >
                  {client.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-gray-600 text-center leading-tight line-clamp-2">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
