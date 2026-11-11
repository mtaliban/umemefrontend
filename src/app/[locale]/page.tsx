import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getHomeData, getSettings } from '@/lib/api';
import HeroSlider from '@/components/public/home/HeroSlider';
import StatsStrip from '@/components/public/home/StatsStrip';
import ServicesPreview from '@/components/public/home/ServicesPreview';
import FeaturedProjects from '@/components/public/home/FeaturedProjects';
import TestimonialsSlider from '@/components/public/home/TestimonialsSlider';
import CTABand from '@/components/public/home/CTABand';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';

  try {
    const settings = await getSettings(locale);
    const title = settings.company_name;
    const description =
      locale === 'sw'
        ? (settings.slogan?.sw || settings.slogan?.en || '')
        : (settings.slogan?.en || '');

    return {
      title,
      description,
      alternates: {
        canonical: siteUrl || '/',
        languages: {
          en: siteUrl || '/',
          sw: `${siteUrl}/sw`,
          'x-default': siteUrl || '/',
        },
      },
      openGraph: {
        type: 'website',
        title,
        description,
        images: settings.default_seo?.share_image?.url
          ? [settings.default_seo.share_image.url]
          : [],
      },
    };
  } catch {
    return { title: 'Company Website' };
  }
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');

  let data;
  try {
    data = await getHomeData(locale);
  } catch {
    data = {};
  }

  // Always use this fixed order — ignore backend home_sections
  const sections = ['hero', 'stats', 'services', 'projects', 'testimonials', 'cta'];

  const whatsappNumber = data.settings?.whatsapp_number ?? '';

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return data.hero_slides && data.hero_slides.length > 0 ? (
          <HeroSlider key="hero" slides={data.hero_slides} locale={locale} />
        ) : null;

      case 'stats':
        return data.stats && data.stats.length > 0 ? (
          <StatsStrip key="stats" stats={data.stats} locale={locale} />
        ) : null;

      case 'services':
        return (data.service_categories?.length || data.featured_services?.length) ? (
          <ServicesPreview
            key="services"
            categories={data.service_categories ?? []}
            services={data.featured_services ?? []}
            locale={locale}
            viewAllLabel={tCommon('viewAll')}
          />
        ) : null;

      case 'projects':
        return data.featured_projects && data.featured_projects.length > 0 ? (
          <FeaturedProjects
            key="projects"
            projects={data.featured_projects}
            locale={locale}
            viewAllLabel={t('viewAllProjects')}
          />
        ) : null;

      case 'testimonials':
        return data.testimonials && data.testimonials.length > 0 ? (
          <TestimonialsSlider key="testimonials" testimonials={data.testimonials} locale={locale} />
        ) : null;

      case 'cta':
        return data.cta ? (
          <CTABand
            key="cta"
            cta={data.cta}
            locale={locale}
            whatsappNumber={whatsappNumber}
          />
        ) : null;

      default:
        return null;
    }
  };

  // JSON-LD Organization
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';
  const settings = data.settings;
  const organizationJsonLd = settings
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.company_name,
        url: siteUrl,
        logo: settings.logo?.url ? `${siteUrl}${settings.logo.url}` : undefined,
        contactPoint: settings.phones?.[0]
          ? {
              '@type': 'ContactPoint',
              telephone: settings.phones[0],
              contactType: 'customer service',
            }
          : undefined,
      }
    : null;

  return (
    <>
      {organizationJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      )}
      {sections.map((key) => renderSection(key))}
    </>
  );
}
