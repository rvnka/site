import type { ReactNode } from 'react';

const WIDTHS = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
} as const;

type PageShellWidth = keyof typeof WIDTHS;

interface PageShellProps {
  children: ReactNode;
  className?: string;
  width?: PageShellWidth;
  top?: string;
}

export function PageShell({
  children,
  className = '',
  width = 'md',
  top = 'py-12',
}: PageShellProps) {
  return (
    <div className={`mx-auto w-full ${WIDTHS[width]} px-6 ${top} ${className}`.trim()}>
      {children}
    </div>
  );
}
