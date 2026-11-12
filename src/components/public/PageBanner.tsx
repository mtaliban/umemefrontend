import Image from 'next/image';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { mediaUrl } from '@/lib/utils';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string | { en: string; sw: string };
  };
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageBanner({ title, subtitle, image, breadcrumbs }: PageBannerProps) {
  const altText = image?.alt
    ? typeof image.alt === 'object' ? image.alt.en : image.alt
    : title;

  const imgSrc = mediaUrl(image?.url);

  return (
    <section className="relative min-h-[200px] lg:min-h-[280px] flex items-end overflow-hidden">
      {/* Background */}
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={altText}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: '#111111' }} />
      )}

      {/* Dark transparent overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        aria-hidden="true"
      />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.035]" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative geometric shapes (right side) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none" aria-hidden="true">
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/8" />
        <div className="absolute right-16 top-8 w-6 h-6 rounded-full bg-accent/40" />
        <div className="absolute right-32 bottom-12 w-3 h-3 rounded-full bg-white/30" />
      </div>

      {/* Accent bottom bar with gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(to right, #D97706, #F59E0B, #FBBF24)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} light />
          </div>
        )}

        {/* Accent line before title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-0.5 rounded-full bg-accent" />
          <div className="w-3 h-0.5 rounded-full bg-accent/50" />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-heading leading-tight animate-fade-up" style={{ letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-white/95 text-lg max-w-2xl leading-relaxed animate-fade-up-delay-1">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
