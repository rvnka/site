/**
 * src/components/ui/SectionHeading.tsx
 *
 * Section header with an eyebrow label, title, optional description,
 * and an optional "see all" action link.
 *
 * Extracted from src/app/page.tsx so it can be reused across Blog,
 * Project, and any future section that needs the same layout.
 */

import Link from 'next/link';

interface SectionHeadingProps {
  /** Small all-caps label rendered above the title. */
  eyebrow: string;
  title: string;
  description?: string;
  /** When provided, renders a right-aligned "see all" link. */
  action?: { label: string; href: string };
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}
        >
          {eyebrow}
        </p>

        <h2
          className="font-serif text-2xl font-bold"
          style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}
        >
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--muted)' }}
        >
          {action.label}
          <i className="bi bi-arrow-right text-sm" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
