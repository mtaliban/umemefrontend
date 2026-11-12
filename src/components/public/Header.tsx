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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { href: '/',         label: t('home') },
    { href: '/about',    label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/projects', label: t('projects') },
    { href: '/training', label: t('training') },
    { href: '/contact',  label: t('contact') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const initials = settings.company_name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'KP';

  return (
    <>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-6">

            {/* 1. Logo — anchored far left */}
            <Link
              href="/"
              aria-label="Home"
              className="flex-shrink-0"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm tracking-tight"
                style={{ background: '#F5B700', color: '#111111' }}
              >
                {initials}
              </div>
            </Link>

            {/* 2. Nav — expands to fill middle, items spread evenly */}
            <nav
              className="hidden lg:flex flex-1 items-center justify-center gap-9"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive(link.href)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 3. Language toggle — anchored far right, button style */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              {/* subtle divider */}
              <div className="w-px h-5 bg-gray-200 mr-5" />
              <div className="flex items-center rounded-xl border-2 border-gray-200 overflow-hidden">
                <Link
                  href="/"
                  locale="en"
                  className={`px-4 py-1.5 text-xs font-bold tracking-wider transition-colors ${
                    locale === 'en'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  EN
                </Link>
                <div className="w-px h-full bg-gray-200" />
                <Link
                  href="/"
                  locale="sw"
                  className={`px-4 py-1.5 text-xs font-bold tracking-wider transition-colors ${
                    locale === 'sw'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  SW
                </Link>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <Menu className="w-6 h-6" />
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile bottom-sheet overlay ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl lg:hidden
          transition-transform duration-300 ease-out max-h-[88vh] flex flex-col
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-900">
            {locale === 'sw' ? 'Menyu' : 'Menu'}
          </span>
          <button
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-3" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-4 py-4 rounded-xl text-base font-medium transition-colors mb-1 ${
                isActive(link.href)
                  ? 'text-gray-900 font-semibold bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={
                isActive(link.href)
                  ? { borderLeft: '3px solid #F5B700', paddingLeft: '13px' }
                  : {}
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language row */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-none">
          <span className="text-xs text-gray-500 font-medium">Language / Lugha</span>
          <div className="flex items-center rounded-xl border-2 border-gray-200 overflow-hidden">
            <Link
              href="/"
              locale="en"
              className={`px-5 py-2 text-xs font-bold tracking-wider transition-colors ${
                locale === 'en'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              EN
            </Link>
            <div className="w-px h-full bg-gray-200" />
            <Link
              href="/"
              locale="sw"
              className={`px-5 py-2 text-xs font-bold tracking-wider transition-colors ${
                locale === 'sw'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setIsOpen(false)}
            >
              SW
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
