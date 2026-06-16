'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { AnimationParams } from 'animejs';

type AnimationHandle = {
  cancel: () => void;
};

type TimelineHandle = AnimationHandle & {
  add: (...args: unknown[]) => TimelineHandle;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useAnimeBase<T extends Element>(
  run: (el: T) => Promise<AnimationHandle | null>,
  deps: readonly unknown[],
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const animRef = useRef<AnimationHandle | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (cancelled || !el.isConnected) return;

      void run(el)
        .then((anim) => {
          if (!cancelled) animRef.current = anim;
        })
        .catch(() => null);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      animRef.current?.cancel();
      animRef.current = null;
    };
  }, deps);

  return ref;
}

export function useAnimation<T extends Element = Element>(
  params: AnimationParams,
  deps: readonly unknown[] = [],
): RefObject<T | null> {
  return useAnimeBase<T>(async (el) => {
    const { animate } = await import('animejs');
    return animate(el, { ...params, autoplay: true }) as unknown as AnimationHandle;
  }, deps);
}

export function useStaggerAnimation<T extends Element = Element>(
  selector: string,
  params: AnimationParams,
  deps: readonly unknown[] = [],
): RefObject<T | null> {
  return useAnimeBase<T>(async (container) => {
    const { animate, stagger } = await import('animejs');
    const targets = container.querySelectorAll<Element>(selector);
    if (!targets.length) return null;
    return animate(targets, { ...params, delay: stagger(80), autoplay: true }) as unknown as AnimationHandle;
  }, deps);
}

export function useCardEntrance<T extends Element = Element>(
  selector = '[data-card]',
): RefObject<T | null> {
  return useStaggerAnimation<T>(
    selector,
    { opacity: [0, 1], translateY: [16, 0], duration: 500, ease: 'outQuart' },
    [],
  );
}

export function useHamburgerMenuAnimation(
  isOpen: boolean,
  onComplete?: () => void,
): RefObject<SVGSVGElement | null> {
  const ref = useRef<SVGSVGElement>(null);
  const tlRef = useRef<TimelineHandle | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    tlRef.current?.cancel();

    const raf = requestAnimationFrame(() => {
      if (cancelled || !el.isConnected) return;

      void import('animejs')
        .then(({ createTimeline }) => {
          if (cancelled || !el.isConnected) return;

          const lines = el.querySelectorAll('line');
          if (lines.length < 3) {
            onComplete?.();
            return;
          }

          const timeline = createTimeline({ autoplay: true, onComplete: () => onComplete?.() }) as unknown as TimelineHandle;
          tlRef.current = timeline;

          if (isOpen) {
            timeline
              .add(lines[0], { x1: [7, 8], y1: [9, 8], x2: [25, 24], y2: [9, 24], duration: 300, ease: 'inOutQuart' }, 0)
              .add(lines[1], { opacity: [1, 0], duration: 150, ease: 'linear' }, 0)
              .add(lines[2], { x1: [7, 8], y1: [23, 24], x2: [25, 24], y2: [23, 8], duration: 300, ease: 'inOutQuart' }, 0);
          } else {
            timeline
              .add(lines[0], { x1: [8, 7], y1: [8, 9], x2: [24, 25], y2: [24, 9], duration: 280, ease: 'inOutQuart' }, 0)
              .add(lines[1], { opacity: [0, 1], duration: 150, delay: 90, ease: 'linear' }, 0)
              .add(lines[2], { x1: [8, 7], y1: [24, 23], x2: [24, 25], y2: [8, 23], duration: 280, ease: 'inOutQuart' }, 0);
          }
        })
        .catch(() => onComplete?.());
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      tlRef.current?.cancel();
      tlRef.current = null;
    };
  }, [isOpen, onComplete]);

  return ref;
}
