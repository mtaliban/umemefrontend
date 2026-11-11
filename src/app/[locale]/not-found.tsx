import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Home } from 'lucide-react';

export default async function NotFound() {
  const t = await getTranslations('errors');

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary/20 font-heading mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 font-heading mb-3">
          {t('notFound')}
        </h1>
        <p className="text-gray-500 mb-8">{t('notFoundMessage')}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-orange-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}
