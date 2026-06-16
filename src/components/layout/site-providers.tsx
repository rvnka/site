'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import {
  MainContentTransition,
  PageEntryOverlay,
  RouteTransitionBar,
  TransitionProvider,
} from '@/components/transitions';

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      storageKey='theme'
      disableTransitionOnChange
      themes={['light', 'dark']}
    >
      <TransitionProvider>
        <PageEntryOverlay />
        <RouteTransitionBar />
        <div
          className='flex min-h-screen flex-col'
          style={{
            background: 'var(--bg)',
            color: 'var(--fg)',
            transition:
              'background 0.3s cubic-bezier(0.4,0,0.2,1), color 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Header />
          <MainContentTransition>
            <main id='main-content' className='flex-1'>
              {children}
            </main>
          </MainContentTransition>
          <Footer />
        </div>
      </TransitionProvider>
    </ThemeProvider>
  );
}
