/**
 * HeroSection Component
 *
 * Renders the main hero section with fade-in and slide-up animation.
 * Provides a smooth entrance effect for the hero content.
 */

'use client';

import { usePageTransition } from '@/hooks/use-animations';

interface HeroSectionProps {
  children: React.ReactNode;
}

/**
 * Animated hero section component
 * @param children - Hero section content to animate
 */
export function HeroSection({ children }: HeroSectionProps) {
  const ref = usePageTransition<HTMLDivElement>();
  return <div ref={ref}>{children}</div>;
}
