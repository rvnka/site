'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

let entryPlayed = false;

interface TransitionState {
  isNavTransitioning: boolean;
  isFirstLoad: boolean;
}

const TransitionContext = createContext<TransitionState>({
  isNavTransitioning: false,
  isFirstLoad: false,
});

export const useTransition = () => useContext(TransitionContext);

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);

    sync();
    media.addEventListener?.('change', sync);

    return () => media.removeEventListener?.('change', sync);
  }, []);

  return reduced;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  const [isNavTransitioning, setNavTransitioning] = useState(false);
  const [isFirstLoad] = useState(() => !entryPlayed);
  const prevPath = useRef(pathname);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    entryPlayed = true;
  }, []);

  useEffect(() => {
    const reset = () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      setNavTransitioning(false);
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset();
    };

    const onPageHide = () => {
      reset();
    };

    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  useEffect(() => {
    if (prevPath.current === pathname) return;

    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    if (reducedMotion) {
      prevPath.current = pathname;
      setNavTransitioning(false);
      return;
    }

    setNavTransitioning(true);
    timeout.current = setTimeout(() => {
      setNavTransitioning(false);
      timeout.current = null;
    }, 220);
    prevPath.current = pathname;

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    };
  }, [pathname, reducedMotion]);

  const value = useMemo(
    () => ({ isNavTransitioning, isFirstLoad }),
    [isNavTransitioning, isFirstLoad],
  );

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export function MainContentTransition({ children }: { children: ReactNode }) {
  const { isNavTransitioning } = useTransition();

  return (
    <div
      data-theme-transition
      style={{
        opacity: isNavTransitioning ? 0.88 : 1,
        transform: isNavTransitioning ? 'translateY(2px) scale(0.9975)' : 'translateY(0) scale(1)',
        filter: isNavTransitioning ? 'blur(2px)' : 'none',
        transition:
          'opacity 220ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1), filter 220ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}

export function RouteTransitionBar() {
  const { isNavTransitioning } = useTransition();

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed left-0 top-0 z-[999] h-[3px] w-full overflow-hidden'
      style={{
        opacity: isNavTransitioning ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}
    >
      <div
        className='h-full w-full origin-left'
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--accent) 20%, var(--accent2) 50%, var(--accent) 80%, transparent 100%)',
          transform: isNavTransitioning ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: '0 0 16px color-mix(in srgb, var(--accent) 42%, transparent)',
        }}
      />
    </div>
  );
}

export function PageEntryOverlay() {
  const { isFirstLoad } = useTransition();
  const reducedMotion = usePrefersReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [soften, setSoften] = useState(true);

  useEffect(() => {
    if (!isFirstLoad || reducedMotion) {
      setHidden(true);
      return;
    }

    const fade = window.setTimeout(() => setSoften(false), 80);
    const done = window.setTimeout(() => setHidden(true), 620);

    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
    };
  }, [isFirstLoad, reducedMotion]);

  if (hidden || !isFirstLoad) return null;

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 z-[998]'
      style={{
        backdropFilter: soften ? 'blur(10px)' : 'blur(0px)',
        WebkitBackdropFilter: soften ? 'blur(10px)' : 'blur(0px)',
        background: soften
          ? 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.14) 100%)'
          : 'transparent',
        transition:
          'backdrop-filter 520ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-backdrop-filter 520ms cubic-bezier(0.4, 0, 0.2, 1), background 520ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  );
}
