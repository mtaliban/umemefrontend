import { Shield, Award, Clock, Users } from 'lucide-react';
import type { Feature } from '@/lib/types';

interface WhyChooseUsProps {
  features: Feature[];
  locale: string;
}

const icons = [Shield, Award, Clock, Users];

export default function WhyChooseUs({ features, locale }: WhyChooseUsProps) {
  if (!features || features.length === 0) return null;

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  return (
    <section className="py-14 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="section-label">
            {locale === 'sw' ? 'Kwa Nini Sisi' : 'Why Choose Us'}
          </span>
          <h2 className="mt-2 section-title">
            {locale === 'sw' ? 'Tofauti Yetu' : 'What Makes Us Different'}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.slice(0, 4).map((feature, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={feature._id || index}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: '#FEF9E7' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#D97706' }} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 font-heading mb-1.5 leading-snug">
                  {resolveT(feature.title)}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
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
