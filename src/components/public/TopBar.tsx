import { Phone, Mail, Clock, Facebook, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import type { SiteSettings } from '@/lib/types';

interface TopBarProps {
  settings: SiteSettings;
}

export default async function TopBar({ settings }: TopBarProps) {
  const locale = await getLocale();

  return (
    <div className="hidden lg:block text-white text-xs" style={{ background: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Left: contact info */}
          <div className="flex items-center gap-5">
            {settings.phones?.[0] && (
              <a
                href={`tel:${settings.phones[0]}`}
                className="flex items-center gap-1.5 text-gray-300 hover:text-accent transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>{settings.phones[0]}</span>
              </a>
            )}
            {settings.emails?.[0] && (
              <a
                href={`mailto:${settings.emails[0]}`}
                className="flex items-center gap-1.5 text-gray-300 hover:text-accent transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>{settings.emails[0]}</span>
              </a>
            )}
            {settings.working_hours && (
              <span className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-3 h-3" />
                <span>
                  {locale === 'sw'
                    ? (settings.working_hours.sw || settings.working_hours.en)
                    : settings.working_hours.en}
                </span>
              </span>
            )}
          </div>

          {/* Right: social + language */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {settings.social?.facebook && (
                <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors" aria-label="Facebook">
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social?.instagram && (
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors" aria-label="Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social?.x && (
                <a href={settings.social.x} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors" aria-label="X">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social?.linkedin && (
                <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.social?.youtube && (
                <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent transition-colors" aria-label="YouTube">
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Language switch */}
            <div className="flex items-center gap-0.5 pl-4 border-l border-white/15">
              <Link
                href="/"
                locale="en"
                className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                  locale === 'en'
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-accent'
                }`}
              >
                EN
              </Link>
              <span className="text-white/20 text-xs">|</span>
              <Link
                href="/"
                locale="sw"
                className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                  locale === 'sw'
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-accent'
                }`}
              >
                SW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
