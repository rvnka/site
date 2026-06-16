import type { CSSProperties, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
  interactive?: boolean;
}

const STYLES: Record<string, CSSProperties> = {
  default: { background: 'var(--card)', color: 'var(--muted)', border: '1px solid var(--border)' },
  accent:  { background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' },
  outline: { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
};

export function Badge({ children, variant = 'default', className = '', interactive = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${interactive ? 'badge-interactive' : ''} ${className}`}
      style={STYLES[variant]}
    >
      {children}
    </span>
  );
}
