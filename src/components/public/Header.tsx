'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/projects', label: t('projects') },
    { href: '/training', label: t('training') },
    { href: '/contact', label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const initials = settings.company_name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'KP';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: '#F5B700', color: '#111111' }}
              >
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-bold text-gray-900 font-heading leading-snug truncate max-w-[200px]">
                {settings.company_name}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: '#F5B700' }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right: lang + CTA + hamburger */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center text-xs font-semibold text-gray-500">
                <Link
                  href="/"
                  locale="en"
                  className={`px-2 py-1 rounded transition-colors ${locale === 'en' ? 'text-gray-900 font-bold' : 'hover:text-gray-700'}`}
                >
                  EN
                </Link>
                <span className="text-gray-200">/</span>
                <Link
                  href="/"
                  locale="sw"
                  className={`px-2 py-1 rounded transition-colors ${locale === 'sw' ? 'text-gray-900 font-bold' : 'hover:text-gray-700'}`}
                >
                  SW
                </Link>
              </div>

              <Link
                href="/request-service"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-lg min-h-[40px] transition-opacity hover:opacity-90"
                style={{ background: '#F5B700', color: '#111111' }}
              >
                {locale === 'sw' ? 'Omba Huduma' : 'Request Service'}
              </Link>

              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu — fixed inset-0, visibility toggled to prevent overflow */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          className={`absolute inset-0 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: '#F5B700', color: '#111111' }}
              >
                {initials}
              </div>
              <span className="font-bold text-gray-900 text-base font-heading leading-snug">
                {settings.company_name}
              </span>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-gray-900 font-semibold bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={isActive(link.href) ? { borderLeft: '3px solid #F5B700', paddingLeft: '13px' } : {}}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/request-service"
              className="mt-4 px-4 py-3.5 text-base font-bold rounded-xl text-center transition-opacity hover:opacity-90"
              style={{ background: '#F5B700', color: '#111111' }}
              onClick={() => setIsMenuOpen(false)}
            >
              {locale === 'sw' ? 'Omba Huduma' : 'Request Service'}
            </Link>
          </nav>

          {/* Language switch */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400 mb-2 font-medium">Language / Lugha</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                locale="en"
                className={`py-2.5 text-center text-sm font-semibold rounded-xl border-2 transition-colors ${
                  locale === 'en' ? 'border-gray-900 text-gray-900' : 'text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                English
              </Link>
              <Link
                href="/"
                locale="sw"
                className={`py-2.5 text-center text-sm font-semibold rounded-xl border-2 transition-colors ${
                  locale === 'sw' ? 'border-gray-900 text-gray-900' : 'text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Kiswahili
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
