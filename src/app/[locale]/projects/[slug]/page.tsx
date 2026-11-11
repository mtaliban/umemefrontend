import type { Metadata } from 'next';
import type { ElementType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { MapPin, Calendar, User, Banknote, ArrowRight } from 'lucide-react';
import { getProject, getProjects } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';
import ProjectGallery from './ProjectGallery';

interface ProjectDetailProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const result = await getProjects('en');
    return result.items.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const project = await getProject(slug, locale);
    const resolveT = (f: { en: string; sw: string } | undefined) =>
      locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');
    return {
      title: resolveT(project.title),
      description: resolveT(project.summary),
      openGraph: { images: project.cover?.url ? [project.cover.url] : [] },
    };
  } catch {
    return { title: 'Project' };
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('projects');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let project;
  try {
    project = await getProject(slug, locale);
  } catch {
    notFound();
  }

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: t('title'), href: '/projects' },
    { label: resolveT(project.title) },
  ];

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString(locale === 'sw' ? 'sw-TZ' : 'en-TZ', {
          month: 'long',
          year: 'numeric',
        })
      : null;

  const isCompleted = project.project_status === 'completed';

  const detailItems = [
    project.client_name && {
      icon: User,
      label: t('client'),
      value: project.client_name,
    },
    (project.location || project.region) && {
      icon: MapPin,
      label: t('location'),
      value: [project.location, project.region].filter(Boolean).join(', '),
    },
    project.start_date && {
      icon: Calendar,
      label: t('startDate'),
      value: formatDate(project.start_date),
    },
    project.end_date && {
      icon: Calendar,
      label: t('endDate'),
      value: formatDate(project.end_date),
    },
    (!project.hide_value && project.value_tzs) && {
      icon: Banknote,
      label: t('projectValue'),
      value: `TZS ${project.value_tzs.toLocaleString()}`,
    },
  ].filter(Boolean) as { icon: ElementType; label: string; value: string | null }[];

  return (
    <>
      <PageBanner
        title={resolveT(project.title)}
        image={project.cover}
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              {project.summary && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <p className="text-gray-600 leading-relaxed text-lg">{resolveT(project.summary)}</p>
                </div>
              )}

              {/* Scope */}
              {project.scope && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('scope')}</h2>
                  </div>
                  <div
                    className="prose prose-gray prose-headings:font-heading prose-a:text-primary max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: resolveT(project.scope) }}
                  />
                </div>
              )}

              {/* Outcome */}
              {project.outcome && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-6 w-1 rounded-full bg-green-500" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('outcome')}</h2>
                  </div>
                  <div
                    className="prose prose-gray prose-headings:font-heading prose-a:text-primary max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: resolveT(project.outcome) }}
                  />
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('gallery')}</h2>
                  </div>
                  <ProjectGallery images={project.gallery} locale={locale} />
                </div>
              )}

              {/* Before/After */}
              {project.before_after && project.before_after.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('beforeAfter')}</h2>
                  </div>
                  <div className="space-y-6">
                    {project.before_after.map((pair, i) => (
                      <div key={i}>
                        {pair.caption && (
                          <p className="text-sm font-semibold text-gray-700 mb-3">{resolveT(pair.caption)}</p>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative aspect-video rounded-xl overflow-hidden">
                            <Image src={pair.before.url} alt="Before" fill className="object-cover" sizes="50vw" />
                            <div className="absolute bottom-0 left-0 right-0 py-2 px-3 text-white text-xs font-bold tracking-wide"
                              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                              {locale === 'sw' ? 'Kabla' : 'Before'}
                            </div>
                          </div>
                          <div className="relative aspect-video rounded-xl overflow-hidden">
                            <Image src={pair.after.url} alt="After" fill className="object-cover" sizes="50vw" />
                            <div className="absolute bottom-0 left-0 right-0 py-2 px-3 text-white text-xs font-bold tracking-wide"
                              style={{ background: 'linear-gradient(to top, rgba(124,45,18,0.85), transparent)' }}>
                              {locale === 'sw' ? 'Baada' : 'After'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {project.video_url && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-6 w-1 rounded-full bg-accent" />
                    <h2 className="text-xl font-bold text-gray-900 font-heading">{t('watchVideo')}</h2>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={project.video_url.replace('youtube.com', 'youtube-nocookie.com').replace('watch?v=', 'embed/')}
                      title={resolveT(project.title)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 sticky top-24 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900 font-heading">
                      {locale === 'sw' ? 'Maelezo ya Mradi' : 'Project Details'}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {isCompleted
                        ? (locale === 'sw' ? 'Imekamilika' : 'Completed')
                        : (locale === 'sw' ? 'Inaendelea' : 'Ongoing')}
                    </span>
                  </div>
                </div>

                {/* Detail items */}
                <div className="p-6 space-y-4">
                  {detailItems.map(({ icon: Icon, label, value }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(234,88,12,0.08)' }}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <div className="border-t border-gray-100 pt-5">
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #7C2D12, #9A3412)' }}
                    >
                      {locale === 'sw' ? 'Wasiliana nasi' : 'Contact Us'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Back link */}
              <Link
                href="/projects"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:border-primary hover:text-primary transition-all shadow-card"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                {locale === 'sw' ? 'Rudi miradi yote' : 'All projects'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
