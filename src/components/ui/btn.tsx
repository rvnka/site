import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

interface BtnProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  external?: boolean;
  icon?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const SIZE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const VARIANT: Record<'primary' | 'ghost' | 'outline', CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    boxShadow: '0 8px 22px color-mix(in srgb, var(--accent) 24%, transparent)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--muted)',
    border: '1px solid transparent',
  },
  outline: {
    background: 'var(--card)',
    color: 'var(--fg)',
    border: '1px solid var(--border)',
    boxShadow: '0 1px 3px var(--shadow)',
  },
};

const BASE =
  'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

export function Btn({
  children,
  href,
  variant = 'outline',
  size = 'md',
  external,
  icon,
  className = '',
  onClick,
  type = 'button',
  disabled,
}: BtnProps) {
  const cls = `${BASE} ${SIZE[size]} ${className}`.trim();
  const style = VARIANT[variant];
  const iconClass = icon ? `bi ${icon} text-sm` : '';

  if (href) {
    const shouldOpenExternal = external ?? isExternalHref(href);

    if (shouldOpenExternal) {
      return (
        <a
          href={href}
          className={cls}
          style={style}
          target='_blank'
          rel='noopener noreferrer'
          aria-disabled={disabled || undefined}
        >
          {icon && <i className={iconClass} aria-hidden='true' />}
          <span>{children}</span>
        </a>
      );
    }

    return (
      <Link href={href} className={cls} style={style}>
        {icon && <i className={iconClass} aria-hidden='true' />}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      style={style}
    >
      {icon && <i className={iconClass} aria-hidden='true' />}
      <span>{children}</span>
    </button>
  );
}
