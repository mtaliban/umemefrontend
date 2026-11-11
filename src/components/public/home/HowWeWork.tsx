import { ClipboardList, Search, Wrench, CheckCircle2 } from 'lucide-react';
import type { WorkStep } from '@/lib/types';

interface HowWeWorkProps {
  steps: WorkStep[];
  locale: string;
}

const defaultIcons: React.ComponentType<{ className?: string }>[] = [
  ClipboardList,
  Search,
  Wrench,
  CheckCircle2,
];

export default function HowWeWork({ steps, locale }: HowWeWorkProps) {
  if (!steps || steps.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #7C2D12 0%, #9A3412 100%)' }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent font-bold text-xs uppercase tracking-widest">
            {locale === 'sw' ? 'Mchakato Wetu' : 'Our Process'}
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white font-heading">
            {locale === 'sw' ? 'Jinsi Tunavyofanya Kazi' : 'How We Work'}
          </h2>
          <p className="mt-4 text-white/95 max-w-2xl mx-auto text-sm lg:text-base">
            {locale === 'sw'
              ? 'Kila mradi unafuata mchakato madhubuti ili kuhakikisha matokeo bora.'
              : 'Every project follows a rigorous process to ensure excellent outcomes and client satisfaction.'}
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-14 left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.4), transparent)' }}
            aria-hidden="true"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = defaultIcons[index % defaultIcons.length];
              return (
                <div key={step._id} className="relative text-center group">
                  {/* Circle with number */}
                  <div className="relative inline-flex flex-col items-center mb-5">
                    <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <IconComponent className="w-10 h-10 text-white/95" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-heading mb-2">
                    {resolveT(step.title)}
                  </h3>
                  <p className="text-white/95 text-sm leading-relaxed">
                    {resolveT(step.text)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
