import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { siteConfig } from "@/config/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

// next/font eliminates render-blocking @import for these typefaces
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.meta.url),
  title: {
    default: `${siteConfig.meta.title} - Portfolio`,
    template: `%s · ${siteConfig.meta.title}`,
  },
  description: siteConfig.meta.description,
  icons: {
    icon: [{ url: siteConfig.meta.icon, type: 'image/svg+xml' }],
    shortcut: siteConfig.meta.icon,
    apple: siteConfig.meta.icon,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.meta.url,
    siteName: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: [{ url: siteConfig.meta.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.profile.username,
    description: siteConfig.meta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable}`}
    >
      <head>
        {/* preconnect reduces Bootstrap Icons font latency */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Skip to content
        </a>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div
            className="flex min-h-screen flex-col"
            style={{ background: "var(--bg)", color: "var(--fg)" }}
          >
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
