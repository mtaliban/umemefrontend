import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'sw'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      sw: '/kuhusu-sisi',
    },
    '/services': {
      en: '/services',
      sw: '/huduma',
    },
    '/services/[slug]': {
      en: '/services/[slug]',
      sw: '/huduma/[slug]',
    },
    '/projects': {
      en: '/projects',
      sw: '/miradi',
    },
    '/projects/[slug]': {
      en: '/projects/[slug]',
      sw: '/miradi/[slug]',
    },
    '/training': {
      en: '/training',
      sw: '/mafunzo',
    },
    '/training/[slug]': {
      en: '/training/[slug]',
      sw: '/mafunzo/[slug]',
    },
    '/clients': {
      en: '/clients',
      sw: '/wateja',
    },
    '/news': {
      en: '/news',
      sw: '/habari',
    },
    '/news/[slug]': {
      en: '/news/[slug]',
      sw: '/habari/[slug]',
    },
    '/gallery': {
      en: '/gallery',
      sw: '/picha',
    },
    '/gallery/[slug]': {
      en: '/gallery/[slug]',
      sw: '/picha/[slug]',
    },
    '/faq': {
      en: '/faq',
      sw: '/maswali',
    },
    '/contact': {
      en: '/contact',
      sw: '/wasiliana-nasi',
    },
    '/request-service': {
      en: '/request-service',
      sw: '/omba-huduma',
    },
    '/privacy': {
      en: '/privacy',
      sw: '/faragha',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
