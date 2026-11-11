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
    { href: '/about', label: tNav('about') },
    { href: '/services', label: tNav('services') },
    { href: '/projects', label: tNav('projects') },
    { href: '/training', label: tNav('training') },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <footer style={{ background: '#111111' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
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
            {settings.footer_text && (
              <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
                {resolveT(settings.footer_text)}
              </p>
            )}
            {/* Mobile action buttons */}
            <div className="flex flex-wrap gap-2 sm:hidden mb-5">
              {settings.phones?.[0] && (
                <a
                  href={`tel:${settings.phones[0]}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90"
                  style={{ background: '#F5B700' }}
                >
                  <Phone className="w-4 h-4" />
                  {locale === 'sw' ? 'Piga Simu' : 'Call'}
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: '#25D366' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              )}
              {settings.emails?.[0] && (
                <a
                  href={`mailto:${settings.emails[0]}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white border border-gray-600 transition-colors hover:border-gray-400"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              )}
            </div>
            {/* Social icons */}
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
          </div>

          {/* Col 2: Links — 2 columns on mobile, no heading */}
          <div>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5">
              {links.filter((l) => l.href !== '/faq').map((link) => (
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

          {/* Col 4: empty / spacer on mobile, can hold extras on desktop */}
          <div className="hidden lg:block" />
        </div>

        {/* Bottom row */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
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
