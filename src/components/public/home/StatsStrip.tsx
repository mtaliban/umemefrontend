'use client';

import { useEffect, useRef, useState } from 'react';
import type { Stat } from '@/lib/types';

interface StatsStripProps {
  stats: Stat[];
  locale: string;
}

function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
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
    <section className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat._id}
              className={`text-center px-3 py-6 ${
                index < stats.length - 1 ? 'border-r border-gray-200 last:border-r-0' : ''
              }`}
            >
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">
                <CountUp target={stat.number} />
                {stat.suffix && (
                  <span style={{ color: '#F5B700' }}>{stat.suffix}</span>
                )}
              </p>
              <p className="mt-2 text-sm text-gray-500 font-medium leading-tight">
                {resolveT(stat.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
