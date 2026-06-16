'use client';

import { useAnimation } from '@/hooks/use-anime';
import type { ReactNode } from 'react';

const FADE_UP = { opacity: [0, 1], translateY: [20, 0], duration: 600, ease: 'outQuad' };

export function AnimatedPage({ children }: { children: ReactNode }) {
  const ref = useAnimation<HTMLDivElement>(FADE_UP, []);
  return <div ref={ref}>{children}</div>;
}
