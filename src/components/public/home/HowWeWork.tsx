import { ClipboardList, Search, Wrench, CheckCircle2, FileCheck } from 'lucide-react';
import type { WorkStep } from '@/lib/types';

interface HowWeWorkProps {
  steps: WorkStep[];
  locale: string;
}

const icons = [ClipboardList, Search, Wrench, FileCheck, CheckCircle2];

export default function HowWeWork({ steps, locale }: HowWeWorkProps) {
  if (!steps || steps.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="section-label">
            {locale === 'sw' ? 'Mchakato Wetu' : 'Our Process'}
          </span>
          <h2 className="mt-2 section-title">
            {locale === 'sw' ? 'Jinsi Tunavyofanya Kazi' : 'How We Work'}
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-8 left-[calc(10%+40px)] right-[calc(10%+40px)] h-px bg-gray-200"
            aria-hidden="true"
          />

          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={step._id} className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
                  {/* Step number + icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-gray-500" />
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ background: '#F5B700', color: '#111111' }}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div className="lg:mt-4">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-1">
                      {resolveT(step.title)}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {resolveT(step.text)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
