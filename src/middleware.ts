import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except /admin, /api, /_next, /media, static files
    '/((?!admin|api|_next|media|.*\\..*).*)' ,
  ],
};
