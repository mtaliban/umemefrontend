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
  categoryLabel,
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

  const selectClass =
    'px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-primary/50 transition-colors cursor-pointer appearance-none pr-8 bg-no-repeat bg-right-3 bg-center';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
        <Filter className="w-4 h-4" />
        <span>{locale === 'sw' ? 'Chuja:' : 'Filter:'}</span>
      </div>

      <div className="relative">
        <select
          className={selectClass}
          value={current.category ?? ''}
          onChange={(e) => push(buildQuery({ category: e.target.value || undefined, page: undefined }))}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
        >
          <option value="">{categoryLabel}: {locale === 'sw' ? 'Zote' : 'All'}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {resolveT(cat.name)}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          className={selectClass}
          value={current.status ?? ''}
          onChange={(e) => push(buildQuery({ status: e.target.value || undefined, page: undefined }))}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
        >
          <option value="">{statusLabel}: {locale === 'sw' ? 'Zote' : 'All'}</option>
          <option value="ongoing">{locale === 'sw' ? 'Inaendelea' : 'Ongoing'}</option>
          <option value="completed">{locale === 'sw' ? 'Imekamilika' : 'Completed'}</option>
        </select>
      </div>

      <div className="relative">
        <select
          className={selectClass}
          value={current.year ?? ''}
          onChange={(e) => push(buildQuery({ year: e.target.value || undefined, page: undefined }))}
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
        >
          <option value="">{yearLabel}: {locale === 'sw' ? 'Yote' : 'All'}</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {(current.category || current.status || current.year) && (
        <button
          type="button"
          onClick={() => push('/projects')}
          className="px-4 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-colors bg-white"
        >
          {locale === 'sw' ? 'Futa vichujio' : 'Clear filters'}
        </button>
      )}
    </div>
  );
}
