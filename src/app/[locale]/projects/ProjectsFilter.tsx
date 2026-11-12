'use client';

import { useRouter } from '@/i18n/navigation';
import { Filter } from 'lucide-react';

interface Category {
  _id: string;
  slug: string;
  name: { en: string; sw: string };
}

interface ProjectsFilterProps {
  categories: Category[];
  locale: string;
  current: {
    category?: string;
    status?: string;
    year?: string;
  };
  categoryLabel: string;
  statusLabel: string;
  yearLabel: string;
}

export default function ProjectsFilter({
  categories,
  locale,
  current,
  statusLabel,
  yearLabel,
}: ProjectsFilterProps) {
  const router = useRouter();

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const push = (href: string) => (router.push as any)(href);

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all = { ...current, ...overrides };
    Object.entries(all).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString();
    return qs ? `/projects?${qs}` : '/projects';
  };

  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i));

  const tabClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
      active
        ? 'bg-gray-900 text-white shadow-sm'
        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'
    }`;

  const selectClass =
    'px-3 py-2 border border-gray-200 rounded-full text-sm font-semibold bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 hover:border-gray-900 transition-colors cursor-pointer appearance-none pr-7';

  const chevron = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")";

  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => push(buildQuery({ category: undefined, page: undefined }))}
          className={tabClass(!current.category)}
        >
          {locale === 'sw' ? 'Zote' : 'All'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => push(buildQuery({ category: cat.slug, page: undefined }))}
            className={tabClass(current.category === cat.slug)}
          >
            {resolveT(cat.name)}
          </button>
        ))}
      </div>

      {/* Status + Year dropdowns + clear */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Filter className="w-3.5 h-3.5" />
        </div>

        <select
          className={selectClass}
          value={current.status ?? ''}
          onChange={(e) => push(buildQuery({ status: e.target.value || undefined, page: undefined }))}
          style={{ backgroundImage: chevron, backgroundPosition: 'right 10px center', backgroundRepeat: 'no-repeat' }}
        >
          <option value="">{statusLabel}: {locale === 'sw' ? 'Zote' : 'All'}</option>
          <option value="ongoing">{locale === 'sw' ? 'Inaendelea' : 'Ongoing'}</option>
          <option value="completed">{locale === 'sw' ? 'Imekamilika' : 'Completed'}</option>
        </select>

        <select
          className={selectClass}
          value={current.year ?? ''}
          onChange={(e) => push(buildQuery({ year: e.target.value || undefined, page: undefined }))}
          style={{ backgroundImage: chevron, backgroundPosition: 'right 10px center', backgroundRepeat: 'no-repeat' }}
        >
          <option value="">{yearLabel}: {locale === 'sw' ? 'Yote' : 'All'}</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {(current.category || current.status || current.year) && (
          <button
            type="button"
            onClick={() => push('/projects')}
            className="px-3 py-2 rounded-full text-xs font-semibold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-colors bg-white"
          >
            {locale === 'sw' ? 'Futa vichujio' : 'Clear'}
          </button>
        )}
      </div>
    </div>
  );
}
