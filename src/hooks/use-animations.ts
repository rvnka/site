/**
 * Animation hooks using anime.js library
 * Provides reusable animation patterns for page transitions and element entrance
 */

'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface AnimationHandle {
  pause: () => void;
  cancel: () => void;
}

type AnimateParams = Record<string, unknown>;

/**
 * Hook for animating a single element with anime.js
 * Respects prefers-reduced-motion for accessibility
 * @param params - Animation parameters
 * @param deps - Dependency array for re-triggering animation
 * @returns Ref to attach to element
 */
function useAnimation<T extends Element = Element>(
  params: AnimateParams,
  deps: unknown[] = []
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let handle: AnimationHandle | null = null;
    let cancelled = false;

    void import('animejs').then(({ animate }) => {
      if (cancelled || !el.isConnected) return;
      handle = animate(el, params) as unknown as AnimationHandle;
    });

    return () => {
      cancelled = true;
      handle?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Hook for staggered animations on child elements
 * @param childSelector - CSS selector for child elements to animate
 * @param params - Animation parameters for each child
 * @param deps - Dependency array for re-triggering animation
 * @returns Ref to attach to container element
 */
function useStaggerAnimation<T extends Element = Element>(
  childSelector: string,
  params: AnimateParams,
  deps: unknown[] = []
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window === 'undefined') return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let handle: AnimationHandle | null = null;
    let cancelled = false;

    void import('animejs').then(({ animate, stagger }) => {
      if (cancelled || !container.isConnected) return;

      const targets = container.querySelectorAll<Element>(childSelector);
      if (!targets.length) return;

      handle = animate(targets, {
        ...params,
        delay: stagger(80),
      }) as unknown as AnimationHandle;
    });

    return () => {
      cancelled = true;
      handle?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Page transition animation hook
 * Animates page entrance with fade-in and slide-up effect
 * @returns Ref to attach to page container
 */
export function usePageTransition<T extends Element = Element>(): RefObject<T | null> {
  return useAnimation<T>(
    {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 600,
      ease: 'outQuart',
    },
    []
  );
}

/**
 * Card entrance animation hook
 * Animates cards with staggered fade-in and slide-up effect
 * @param cardSelector - CSS selector for cards to animate
 * @returns Ref to attach to container
 */
export function useCardEntrance<T extends Element = Element>(
  cardSelector = '[data-card]'
): RefObject<T | null> {
  return useStaggerAnimation<T>(
    cardSelector,
    {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 500,
      ease: 'outQuart',
    },
    []
  );
}

/**
 * Hamburger menu animation hook
 * Animates hamburger menu icon from open to closed state
 * @param isOpen - Whether menu is currently open
 * @param onComplete - Callback when animation completes
 * @returns Ref to attach to SVG element
 */
export function useHamburgerMenuAnimation(
  isOpen: boolean,
  onComplete?: () => void
): RefObject<SVGSVGElement | null> {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;

    void import('animejs').then(({ createTimeline }) => {
      if (cancelled || !el.isConnected) return;

      const lines = el.querySelectorAll('line');
      if (lines.length < 3) return;

      if (isOpen) {
        const tl = createTimeline({ onComplete: () => onComplete?.() });
        tl.add(
          lines[0],
          {
            x1: [7, 8],
            y1: [9, 8],
            x2: [25, 24],
            y2: [9, 24],
            duration: 300,
            ease: 'inOutQuart',
          },
          0
        );
        tl.add(
          lines[1],
          {
            opacity: [1, 0],
            duration: 150,
            ease: 'linear',
          },
          0
        );
        tl.add(
          lines[2],
          {
            x1: [7, 8],
            y1: [23, 24],
            x2: [25, 24],
            y2: [23, 8],
            duration: 300,
            ease: 'inOutQuart',
          },
          0
        );
      } else {
        const tl = createTimeline({ onComplete: () => onComplete?.() });
        tl.add(
          lines[0],
          {
            x1: [8, 7],
            y1: [8, 9],
            x2: [24, 25],
            y2: [24, 9],
            duration: 300,
            ease: 'inOutQuart',
          },
          0
        );
        tl.add(
          lines[1],
          {
            opacity: [0, 1],
            duration: 150,
            delay: 100,
            ease: 'linear',
          },
          0
        );
        tl.add(
          lines[2],
          {
            x1: [8, 7],
            y1: [24, 23],
            x2: [24, 25],
            y2: [8, 23],
            duration: 300,
            ease: 'inOutQuart',
          },
          0
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, onComplete]);

  return ref;
}
