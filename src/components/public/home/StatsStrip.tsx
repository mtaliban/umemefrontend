'use client';

import { useEffect, useRef, useState } from 'react';
import type { Stat } from '@/lib/types';

interface StatsStripProps {
  stats: Stat[];
  locale: string;
}

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsStrip({ stats, locale }: StatsStripProps) {
  if (!stats || stats.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden" style={{ background: '#0B2545' }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, index) => (
            <div
              key={stat._id}
              className={`bg-white/5 backdrop-blur-sm text-center px-6 py-10 hover:bg-white/10 transition-colors ${
                index === 0 ? 'rounded-tl-2xl rounded-bl-2xl' : ''
              } ${index === stats.length - 1 ? 'rounded-tr-2xl rounded-br-2xl' : ''}`}
            >
              <p className="text-5xl lg:text-6xl font-bold text-white font-heading tracking-tight">
                <CountUp target={stat.number} />
                {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
              </p>
              <div className="mt-1.5 w-8 h-0.5 bg-accent mx-auto rounded-full" />
              <p className="mt-3 text-white/95 text-sm lg:text-base font-medium leading-tight">
                {resolveT(stat.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
