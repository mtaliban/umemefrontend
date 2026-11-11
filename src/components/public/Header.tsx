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

  // Prevent body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
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

  /* ── Language pill shared between desktop & sheet ── */
  const LangToggle = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center border border-gray-200 rounded-full overflow-hidden text-xs font-bold ${className}`}>
      <Link
        href="/"
        locale="en"
        className={`px-3 py-1.5 transition-colors ${
          locale === 'en' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => setIsOpen(false)}
      >
        EN
      </Link>
      <Link
        href="/"
        locale="sw"
        className={`px-3 py-1.5 transition-colors ${
          locale === 'sw' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => setIsOpen(false)}
      >
        SW
      </Link>
    </div>
  );

  return (
    <>
      {/* ── Sticky header bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">

            {/* Logo — far left */}
            <Link href="/" className="flex items-center flex-shrink-0 mr-auto" aria-label="Home">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm"
                style={{ background: '#F5B700', color: '#111111' }}
              >
                {initials}
              </div>
            </Link>

            {/* Desktop nav — centred */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium pb-0.5 transition-colors ${
                    isActive(link.href)
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: '#F5B700' }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side: lang (desktop) + hamburger (mobile) */}
            <div className="flex items-center gap-3 ml-auto lg:ml-6">
              <LangToggle className="hidden lg:flex" />

              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded={isOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile bottom-sheet ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet panel — slides up from bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl lg:hidden
          transition-transform duration-300 ease-out max-h-[88vh] flex flex-col
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Close row */}
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

        {/* Nav links */}
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

        {/* Footer row: lang toggle */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Language / Lugha</span>
          <LangToggle />
        </div>
      </div>
    </>
  );
}
