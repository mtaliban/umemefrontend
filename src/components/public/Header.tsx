'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Menu, X, Globe } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/projects', label: t('projects') },
    { href: '/training', label: t('training') },
    { href: '/clients', label: t('clients') },
    { href: '/news', label: t('news') },
    { href: '/contact', label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/96 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.09)]'
          : 'bg-white shadow-sm border-b border-gray-100'
      }`}
    >
      {/* Premium top accent line */}
      <div className="h-[3px] w-full" style={{ background: 'linear-gradient(to right, #7C2D12 0%, #9A3412 40%, #F59E0B 70%, #FBBF24 100%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {settings.logo?.url ? (
              <Image
                src={settings.logo.url}
                alt={settings.company_name}
                width={160}
                height={52}
                className="h-10 w-auto lg:h-12 object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VW</span>
                </div>
                <span className="text-lg font-bold text-primary font-heading leading-tight">
                  {settings.company_name}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side: language + CTA + mobile */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Language switcher - desktop */}
            <div className="hidden lg:flex items-center gap-1 border border-gray-200 rounded-lg px-1 py-1">
              <Globe className="w-3.5 h-3.5 text-gray-400 ml-1" />
              <Link
                href="/"
                locale="en"
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-colors ${
                  locale === 'en' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
                }`}
              >
                EN
              </Link>
              <Link
                href="/"
                locale="sw"
                className={`px-2 py-0.5 text-xs font-semibold rounded transition-colors ${
                  locale === 'sw' ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'
                }`}
              >
                SW
              </Link>
            </div>

            <Link
              href="/request-service"
              className="hidden sm:inline-flex items-center px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
            >
              {t('requestService')}
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">VW</span>
            </div>
            <span className="font-heading font-bold text-primary text-base">
              {settings.company_name}
            </span>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {isActive(link.href) && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0" />
              )}
              {link.label}
            </Link>
          ))}

          <Link
            href="/request-service"
            className="mt-4 px-4 py-3 gradient-cta text-white text-sm font-bold rounded-xl text-center shadow-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            {t('requestService')}
          </Link>
        </nav>

        {/* Language switch */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 mb-2 font-medium">Language / Lugha</p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              locale="en"
              className={`py-2.5 text-center text-sm font-semibold rounded-xl border-2 transition-colors ${
                locale === 'en'
                  ? 'bg-primary text-white border-primary'
                  : 'text-gray-600 border-gray-200 hover:border-primary/50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              English
            </Link>
            <Link
              href="/"
              locale="sw"
              className={`py-2.5 text-center text-sm font-semibold rounded-xl border-2 transition-colors ${
                locale === 'sw'
                  ? 'bg-primary text-white border-primary'
                  : 'text-gray-600 border-gray-200 hover:border-primary/50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kiswahili
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
