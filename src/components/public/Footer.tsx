import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Twitter, Clock } from 'lucide-react';
import type { SiteSettings, Service } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
  services?: Service[];
}

export default async function Footer({ settings, services }: FooterProps) {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  const quickLinks = [
    { href: '/about', label: tNav('about') },
    { href: '/services', label: tNav('services') },
    { href: '/projects', label: tNav('projects') },
    { href: '/training', label: tNav('training') },
    { href: '/clients', label: tNav('clients') },
    { href: '/news', label: tNav('news') },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <footer style={{ background: '#0B2545' }}>
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #F59E0B, #FBBF24, #0EA5E9)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            {settings.logo_dark?.url || settings.logo?.url ? (
              <Image
                src={settings.logo_dark?.url ?? settings.logo!.url}
                alt={settings.company_name}
                width={160}
                height={52}
                className="h-11 w-auto mb-5 brightness-0 invert"
              />
            ) : (
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <span className="text-white font-black text-sm">VW</span>
                </div>
                <p className="text-xl font-bold text-white font-heading">
                  {settings.company_name}
                </p>
              </div>
            )}
            {settings.footer_text && (
              <p className="text-sm leading-relaxed text-white/80 mb-6">
                {resolveT(settings.footer_text)}
              </p>
            )}
            {/* Social icons */}
            <div className="flex gap-2">
              {settings.social?.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-accent transition-colors flex items-center justify-center group"
                  aria-label="Facebook"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Facebook className="w-4 h-4 text-white/95 group-hover:text-white" />
                </a>
              )}
              {settings.social?.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg hover:bg-accent transition-colors flex items-center justify-center group"
                  aria-label="Instagram"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Instagram className="w-4 h-4 text-white/95 group-hover:text-white" />
                </a>
              )}
              {settings.social?.x && (
                <a href={settings.social.x} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg hover:bg-accent transition-colors flex items-center justify-center group"
                  aria-label="X"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Twitter className="w-4 h-4 text-white/95 group-hover:text-white" />
                </a>
              )}
              {settings.social?.linkedin && (
                <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg hover:bg-accent transition-colors flex items-center justify-center group"
                  aria-label="LinkedIn"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Linkedin className="w-4 h-4 text-white/95 group-hover:text-white" />
                </a>
              )}
              {settings.social?.youtube && (
                <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg hover:bg-accent transition-colors flex items-center justify-center group"
                  aria-label="YouTube"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Youtube className="w-4 h-4 text-white/95 group-hover:text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold font-heading mb-5 text-sm uppercase tracking-wider">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-accent transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="hidden md:block">
            <h3 className="text-white font-bold font-heading mb-5 text-sm uppercase tracking-wider">
              {t('ourServices')}
            </h3>
            <ul className="space-y-2.5">
              {services && services.length > 0 ? (
                services.slice(0, 7).map((service) => (
                  <li key={service._id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm text-white/80 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-accent transition-colors" />
                      {resolveT(service.title)}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  {['Electrical Installation', 'Water Supply Systems', 'Solar Energy', 'Borehole Drilling'].map((s) => (
                    <li key={s}>
                      <Link href="/services" className="text-sm text-white/80 hover:text-accent transition-colors flex items-center gap-2 group">
                        <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-accent transition-colors" />
                        {s}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold font-heading mb-5 text-sm uppercase tracking-wider">
              {t('contactUs')}
            </h3>
            <ul className="space-y-4">
              {settings.phones?.[0] && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div>
                    <a href={`tel:${settings.phones[0]}`} className="text-sm text-white/90 hover:text-accent transition-colors">
                      {settings.phones[0]}
                    </a>
                    {settings.phones[1] && (
                      <a href={`tel:${settings.phones[1]}`} className="block text-sm text-white/90 hover:text-accent transition-colors mt-0.5">
                        {settings.phones[1]}
                      </a>
                    )}
                  </div>
                </li>
              )}
              {settings.emails?.[0] && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <a href={`mailto:${settings.emails[0]}`} className="text-sm text-white/90 hover:text-accent transition-colors break-all">
                    {settings.emails[0]}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span className="text-sm text-white/90">{resolveT(settings.address)}</span>
                </li>
              )}
              {settings.working_hours && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span className="text-sm text-white/90">{resolveT(settings.working_hours)}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/60">
              &copy; {year} {settings.company_name}. {t('allRightsReserved')}
            </p>
            <Link href="/privacy" className="text-xs text-white/60 hover:text-accent transition-colors">
              {t('privacyPolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
