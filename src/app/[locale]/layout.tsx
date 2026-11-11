import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import Script from 'next/script';
import '../globals.css';
import { getSettings, getServices } from '@/lib/api';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import BackToTop from '@/components/public/BackToTop';
import type { Locale } from '@/i18n/routing';
import type { SiteSettings, Service } from '@/lib/types';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let settings;
  try {
    settings = await getSettings(locale);
  } catch {
    return {
      title: 'Company Website',
      description: 'Electricity and Water Engineering – Tanzania',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? '';
  const title = settings.company_name;
  const description =
    locale === 'sw'
      ? (settings.slogan?.sw || settings.slogan?.en || '')
      : (settings.slogan?.en || '');

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  let settings: SiteSettings;
  let services: Service[];
  try {
    [settings, services] = await Promise.all([
      getSettings(locale),
      getServices(locale),
    ]);
  } catch {
    // Use minimal defaults if API is unavailable
    settings = {
      company_name: 'Company',
      slogan: { en: '', sw: '' },
      phones: [],
      emails: [],
      social: {},
      footer_text: { en: '', sw: '' },
      address: { en: '', sw: '' },
      working_hours: { en: '', sw: '' },
      notify_emails: [],
      home_sections: [],
    };
    services = [];
  }

  return (
    <html lang={locale} className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body bg-white text-[#1F2937] antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header settings={settings} />
          <main id="main-content">{children}</main>
          <Footer settings={settings} services={services} />
          {settings.whatsapp_number && (
            <WhatsAppButton number={settings.whatsapp_number} />
          )}
          <BackToTop />
        </NextIntlClientProvider>

        {/* Google Analytics 4 */}
        {settings.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.google_analytics_id}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
