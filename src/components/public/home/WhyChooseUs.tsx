import { Shield, Award, Clock, Users, Star, Zap } from 'lucide-react';
import type { Feature } from '@/lib/types';

interface WhyChooseUsProps {
  features: Feature[];
  locale: string;
}

const defaultIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  0: Shield,
  1: Award,
  2: Clock,
  3: Users,
  4: Star,
  5: Zap,
};

const iconColors = [
  'bg-amber-50 text-primary',
  'bg-amber-50 text-accent-dark',
  'bg-amber-50 text-primary',
  'bg-purple-50 text-purple-600',
  'bg-sky-50 text-sky-600',
  'bg-rose-50 text-rose-600',
];

export default function WhyChooseUs({ features, locale }: WhyChooseUsProps) {
  if (!features || features.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="py-20 lg:py-28 bg-surface relative overflow-hidden">
      {/* Decorative accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">
            {locale === 'sw' ? 'Kwa Nini Sisi' : 'Why Choose Us'}
          </span>
          <h2 className="mt-3 section-title">
            {locale === 'sw' ? 'Tofauti Yetu' : 'What Makes Us Different'}
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            {locale === 'sw'
              ? 'Tunatoa ubora wa kweli, unaothibitishwa na matokeo ya miradi yetu.'
              : 'We deliver genuine quality, proven by the results of our projects across Tanzania.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = defaultIcons[index % Object.keys(defaultIcons).length];
            const colorClass = iconColors[index % iconColors.length];
            return (
              <div
                key={feature._id || index}
                className="group bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div className={`w-13 h-13 w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${colorClass}`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-heading mb-2">
                  {resolveT(feature.title)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {resolveT(feature.text)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
