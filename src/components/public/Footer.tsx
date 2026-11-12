import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
  services?: unknown[];
}

export default async function Footer({ settings }: FooterProps) {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const resolveT = (field: { en: string; sw: string } | undefined) => {
    if (!field) return '';
    return locale === 'sw' ? (field.sw || field.en) : field.en;
  };

  const initials = settings.company_name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'KP';

  const links = [
    { href: '/about',    label: tNav('about') },
    { href: '/services', label: tNav('services') },
    { href: '/projects', label: tNav('projects') },
    { href: '/training', label: tNav('training') },
    { href: '/contact',  label: tNav('contact') },
  ];

  const hasSocial = settings.social?.facebook || settings.social?.instagram ||
    settings.social?.x || settings.social?.linkedin || settings.social?.youtube;

  return (
    <footer style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-5">

        {/* ── MOBILE layout (< lg) — ultra compact ── */}
        <div className="lg:hidden space-y-4">

          {/* Quick links — 3 col grid */}
          <div className="grid grid-cols-3 gap-x-2 gap-y-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors truncate">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Phone + Email only */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            {settings.phones?.[0] && (
              <a href={`tel:${settings.phones[0]}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F5B700' }} />
                {settings.phones[0]}
              </a>
            )}
            {settings.emails?.[0] && (
              <a href={`mailto:${settings.emails[0]}`} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white break-all">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F5B700' }} />
                {settings.emails[0]}
              </a>
            )}
          </div>

          {/* Social icons */}
          {hasSocial && (
            <div className="flex gap-2 border-t border-white/10 pt-5">
              {settings.social?.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="Facebook">
                  <Facebook className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {settings.social?.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="Instagram">
                  <Instagram className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {settings.social?.x && (
                <a href={settings.social.x} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="X/Twitter">
                  <Twitter className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {settings.social?.linkedin && (
                <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {settings.social?.youtube && (
                <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="YouTube">
                  <Youtube className="w-4 h-4 text-gray-400" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── DESKTOP layout (lg+) ── */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: '#F5B700', color: '#111111' }}
              >
                {initials}
              </div>
              <span className="font-bold text-white text-sm font-heading leading-snug">
                {settings.company_name}
              </span>
            </div>
            {hasSocial && (
              <div className="flex gap-2">
                {settings.social?.facebook && (
                  <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="Facebook">
                    <Facebook className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                {settings.social?.instagram && (
                  <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="Instagram">
                    <Instagram className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                {settings.social?.x && (
                  <a href={settings.social.x} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="X">
                    <Twitter className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                {settings.social?.linkedin && (
                  <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="LinkedIn">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                {settings.social?.youtube && (
                  <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70" style={{ background: 'rgba(255,255,255,0.08)' }} aria-label="YouTube">
                    <Youtube className="w-4 h-4 text-gray-400" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Links */}
          <div>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h3 className="text-white font-bold font-heading mb-4 text-xs uppercase tracking-wider">
              {t('contactUs')}
            </h3>
            <ul className="space-y-3">
              {settings.phones?.[0] && (
                <li>
                  <a href={`tel:${settings.phones[0]}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#F5B700' }} />
                    {settings.phones[0]}
                  </a>
                </li>
              )}
              {settings.emails?.[0] && (
                <li>
                  <a href={`mailto:${settings.emails[0]}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors break-all">
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#F5B700' }} />
                    {settings.emails[0]}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F5B700' }} />
                  <span>{resolveT(settings.address)}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: empty spacer */}
          <div />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {year} {settings.company_name}
          </p>
          <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            {t('privacyPolicy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
