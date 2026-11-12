import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://backend:8000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'http',  hostname: '13.60.24.131' },
      { protocol: 'http',  hostname: '13.60.24.131', port: '8000' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${BACKEND_URL}/media/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
