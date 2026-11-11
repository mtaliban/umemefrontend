import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Download, ExternalLink, Target, Rocket, Shield, Users } from 'lucide-react';
import { getPage, getTeam, getCertifications, getSettings } from '@/lib/api';
import type { Locale } from '@/i18n/routing';
import PageBanner from '@/components/public/PageBanner';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  try {
    const page = await getPage('about', locale);
    const resolveT = (f: { en: string; sw: string } | undefined) =>
      locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');
    return {
      title: resolveT(page.title) || (locale === 'sw' ? 'Kuhusu Sisi' : 'About Us'),
      description: resolveT(page.intro),
      openGraph: {
        images: page.seo?.share_image?.url ? [page.seo.share_image.url] : [],
      },
    };
  } catch {
    return { title: locale === 'sw' ? 'Kuhusu Sisi' : 'About Us' };
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('about');

  const resolveT = (f: { en: string; sw: string } | undefined) =>
    locale === 'sw' ? (f?.sw || f?.en || '') : (f?.en || '');

  let page: Record<string, any> = {};
  let team: any[] = [];
  let certifications: any[] = [];
  try {
    [page, team, certifications] = await Promise.all([
      getPage('about', locale),
      getTeam(locale),
      getCertifications(locale),
    ]);
  } catch {
    // keep defaults
  }

  const breadcrumbs = [
    { label: locale === 'sw' ? 'Nyumbani' : 'Home', href: '/' },
    { label: resolveT(page.title) || t('title') },
  ];

  const valueIcons = [Shield, Rocket, Target, Users];

  return (
    <>
      <PageBanner
        title={resolveT(page.title) || t('title')}
        subtitle={resolveT(page.intro)}
        image={page.banner}
        breadcrumbs={breadcrumbs}
      />

      {/* Story section */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute -right-32 top-0 w-96 h-96 rounded-full bg-primary/4 pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Story image */}
            {page.story_image?.url && (
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <Image
                    src={page.story_image.url}
                    alt={resolveT(page.story_image.alt) || t('ourStory')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                {/* Floating stats badge */}
                <div className="absolute -bottom-5 -right-5 rounded-2xl px-6 py-5 shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}>
                  <p className="text-white font-bold text-4xl font-heading leading-none">400+</p>
                  <p className="text-white/90 text-sm font-medium mt-1">
                    {locale === 'sw' ? 'Miradi Iliyokamilika' : 'Projects Delivered'}
                  </p>
                </div>
              </div>
            )}

            {/* Text content */}
            <div>
              <span className="section-label">{t('ourStory')}</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 font-heading leading-tight">
                {locale === 'sw'
                  ? 'Historia ya Mafanikio Tanzania'
                  : 'A Track Record of Excellence in Tanzania'}
              </h2>

              {page.intro && (
                <p className="mt-5 text-gray-600 leading-relaxed text-lg font-medium">
                  {resolveT(page.intro)}
                </p>
              )}
              {page.body && (
                <div
                  className="mt-5 prose prose-gray prose-sm max-w-none prose-p:leading-relaxed prose-p:text-gray-600 prose-strong:text-gray-800 prose-headings:font-heading"
                  dangerouslySetInnerHTML={{ __html: resolveT(page.body) }}
                />
              )}

              {/* Company profile download */}
              {page.profile_pdf && (
                <a
                  href={page.profile_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 btn-primary"
                >
                  <Download className="w-4 h-4" />
                  {t('downloadProfile')}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      {(page.vision || page.mission || (page.values && page.values.length > 0)) && (
        <section className="py-20 bg-surface relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">
                {locale === 'sw' ? 'Mwelekeo Wetu' : 'Our Direction'}
              </span>
              <h2 className="mt-3 section-title">
                {locale === 'sw' ? 'Maono, Dhamira & Maadili' : 'Vision, Mission & Values'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {page.vision && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 group hover:shadow-card-hover transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}>
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">{t('ourVision')}</h3>
                  <p className="text-gray-600 leading-relaxed">{resolveT(page.vision)}</p>
                </div>
              )}
              {page.mission && (
                <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 group hover:shadow-card-hover transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' }}>
                    <Rocket className="w-7 h-7 text-accent-dark" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">{t('ourMission')}</h3>
                  <p className="text-gray-600 leading-relaxed">{resolveT(page.mission)}</p>
                </div>
              )}
            </div>

            {/* Values grid */}
            {page.values && page.values.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {page.values.map((val: any, i: number) => {
                  const Icon = valueIcons[i % valueIcons.length];
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                      <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mb-4"
                        style={{ background: 'rgba(234,88,12,0.08)' }}>
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-gray-900 font-heading text-sm mb-1.5">{resolveT(val.title)}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{resolveT(val.text)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* HSE Statement */}
      {page.hse_statement && (
        <section className="py-16 lg:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #9A3412 100%)' }}>
          <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white font-heading mb-5">{t('hseStatement')}</h2>
            <p className="text-white/95 leading-relaxed text-lg">{resolveT(page.hse_statement)}</p>
          </div>
        </section>
      )}

      {/* Team */}
      {team && team.length > 0 && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">{locale === 'sw' ? 'Wafanyakazi Wetu' : 'Our People'}</span>
              <h2 className="mt-3 section-title">{t('ourTeam')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member: any) => (
                <div key={member._id} className="group text-center">
                  <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden bg-surface mb-5 shadow-card group-hover:shadow-card-hover transition-all duration-300">
                    {member.photo?.url ? (
                      <Image
                        src={member.photo.url}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="144px"
                      />
                    ) : (
                      <div className="w-full h-full gradient-primary flex items-center justify-center text-4xl font-bold text-white/40">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 font-heading text-base">{member.name}</h3>
                  <p className="text-sm text-primary font-semibold mt-1">{resolveT(member.position)}</p>
                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-2.5 leading-relaxed line-clamp-3 max-w-[200px] mx-auto">
                      {resolveT(member.bio)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">
                {locale === 'sw' ? 'Uthibitisho' : 'Accreditations'}
              </span>
              <h2 className="mt-3 section-title">{t('certifications')}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert: any) => (
                <div
                  key={cert._id}
                  className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex items-start gap-5 hover:shadow-card-hover transition-all duration-300"
                >
                  {cert.logo?.url ? (
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-surface flex items-center justify-center overflow-hidden border border-gray-100">
                      <Image
                        src={cert.logo.url}
                        alt={resolveT(cert.name)}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/8 shadow-sm"
                      style={{ background: 'rgba(234,88,12,0.08)' }}>
                      <span className="text-primary font-black text-xl">✓</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 font-heading text-sm">{resolveT(cert.name)}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">{cert.issuer}</p>
                    {cert.number && <p className="text-xs text-gray-400 mt-0.5 font-mono">#{cert.number}</p>}
                    {cert.pdf && (
                      <a
                        href={cert.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {locale === 'sw' ? 'Angalia PDF' : 'View Certificate'}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 lg:py-20 relative overflow-hidden gradient-cta">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-heading mb-4">
            {locale === 'sw' ? 'Tayari Kuanza Mradi Wako?' : 'Ready to Start Your Project?'}
          </h2>
          <p className="text-white/90 text-lg mb-8">
            {locale === 'sw'
              ? 'Wasiliana nasi leo kwa ushauri wa bure na tathmini ya mradi wako.'
              : 'Contact us today for a free consultation and project assessment.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/request-service" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-accent-dark font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-sm">
              {locale === 'sw' ? 'Omba Huduma' : 'Request a Service'}
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/60 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm">
              {locale === 'sw' ? 'Wasiliana Nasi' : 'Get in Touch'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
