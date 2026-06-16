import Link from 'next/link';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
      <div className='max-w-2xl'>
        <p className='mb-1 text-xs font-semibold uppercase tracking-[0.3em]' style={{ color: 'var(--accent)' }}>
          {eyebrow}
        </p>
        <h2 className='font-serif text-2xl font-bold tracking-tight' style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        {description && (
          <p className='mt-1 text-sm leading-7 text-balance' style={{ color: 'var(--muted)' }}>{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className='group inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:text-[var(--accent)]'
          style={{ color: 'var(--muted)' }}
        >
          {action.label}
          <i className='bi bi-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1' aria-hidden='true' />
        </Link>
      )}
    </div>
  );
}

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={`anim mb-10 ${className}`.trim()}>
      <p className='mb-2 text-xs font-semibold uppercase tracking-[0.3em]' style={{ color: 'var(--accent)' }}>
        {eyebrow}
      </p>
      <h1 className='font-serif mb-3 text-4xl font-bold tracking-tight text-balance' style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}>
        {title}
      </h1>
      {description && (
        <p className='max-w-2xl text-base leading-7 text-balance' style={{ color: 'var(--muted)' }}>
          {description}
        </p>
      )}
    </div>
  );
}
