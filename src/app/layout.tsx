import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { DM_Sans, Fraunces } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { getThemeInitScript } from '@/lib/theme';
import { SiteProviders } from '@/components/layout/site-providers';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.meta.url),
  title: {
    default: `${siteConfig.meta.title} · Portfolio`,
    template: `%s · ${siteConfig.meta.title}`,
  },
  description: siteConfig.meta.description,
  icons: {
    icon: [{ url: siteConfig.meta.icon, type: 'image/svg+xml' }],
    shortcut: siteConfig.meta.icon,
    apple: siteConfig.meta.icon,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.meta.url,
    siteName: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: [{ url: siteConfig.meta.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.profile.username,
    description: siteConfig.meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    types: { 'application/rss+xml': '/feed.xml' },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning className={`${dmSans.variable} ${fraunces.variable}`}>
      <head>
        <Script id='theme-init' strategy='beforeInteractive' dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      </head>
      <body className='min-h-screen bg-[var(--bg)] text-[var(--fg)] antialiased'>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg'
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          Skip to content
        </a>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
