/**
 * src/components/ui/Card.tsx
 *
 * Universal card component — works for any ContentItem regardless of whether
 * it's a blog post or a project. No `type` prop needed.
 *
 * The card auto-detects which sections to render based on what fields are
 * present in `frontmatter` (techStack → project chips, readingTime → meta,
 * github/live → action links, image → cover photo).
 *
 * API:
 *   <Card item={post}    href="/blog/my-post"    layout="compact" />
 *   <Card item={post}    href="/blog/my-post" />
 *   <Card item={project} href="/project/my-app" />
 */

'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from './Badge';
import type { ContentItem } from '@/types';

// ─────────────────────────────────────────────────────────────
// Shared glass-surface style
// ─────────────────────────────────────────────────────────────

const surface = {
  background:           'color-mix(in srgb, var(--card) 85%, transparent)',
  border:               '1px solid color-mix(in srgb, var(--accent) 20%, var(--border))',
  backdropFilter:       'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow:            '0 1px 3px var(--shadow), var(--glow-subtle)',
} as const;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatDate(date: string, showDay = true): string {
  return new Date(date).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    ...(showDay ? { day: 'numeric' } : {}),
  });
}

// ─────────────────────────────────────────────────────────────
// Compact layout — single horizontal row
// ─────────────────────────────────────────────────────────────

function CardCompact({ item, href }: { item: ContentItem; href: string }) {
  const { frontmatter, readingTime } = item;

  return (
    <Link
      href={href}
      data-card
      className="glass-hover group flex items-start gap-4 rounded-[14px] border p-4 transition-all duration-300 hover:-translate-y-1"
      style={surface}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="accent">{frontmatter.category}</Badge>

          {readingTime && (
            <span className="text-xs" style={{ color: 'var(--faint)' }}>
              {readingTime}
            </span>
          )}
        </div>

        <h3
          title={frontmatter.title}
          className="font-serif truncate text-base font-semibold tracking-tight transition-colors group-hover:text-[var(--accent)]"
          style={{ color: 'var(--fg)' }}
        >
          {frontmatter.title}
        </h3>
      </div>

      <i
        className="bi bi-arrow-right mt-1 flex-shrink-0 text-sm transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: 'var(--faint)' }}
        aria-hidden="true"
      />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Default layout — full card, every section conditional
// ─────────────────────────────────────────────────────────────

function CardDefault({ item, href }: { item: ContentItem; href: string }) {
  const { frontmatter, excerpt, readingTime } = item;

  const hasTech   = (frontmatter.techStack?.length ?? 0) > 0;
  const hasLinks  = Boolean(frontmatter.github || frontmatter.live);
  const hasFooter = hasLinks || Boolean(frontmatter.date);

  return (
    <Link
      href={href}
      data-card
      className="card-hover glass-hover group block overflow-hidden rounded-[14px] border transition-all duration-300"
      style={surface}
    >
      {/* ── Cover image ──────────────────────────── */}
      {frontmatter.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,var(--card-overlay,rgba(0,0,0,0.45)))]" />
        </div>
      )}

      {/* ── Body ─────────────────────────────────── */}
      <div className={frontmatter.image ? 'p-5' : 'p-6'}>

        {/* Badges row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="accent">{frontmatter.category}</Badge>

          {frontmatter.isPinned && (
            <Badge variant="outline">
              <i className="bi bi-pin-fill mr-1 text-xs" aria-hidden="true" />
              Pinned
            </Badge>
          )}
        </div>

        {/* Reading-time + date (shown when no cover image) */}
        {!frontmatter.image && (readingTime || frontmatter.date) && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {readingTime && (
              <span className="text-xs" style={{ color: 'var(--faint)' }}>
                <i className="bi bi-clock mr-1" aria-hidden="true" />
                {readingTime}
              </span>
            )}
            {/* Show inline date only when there's no footer carrying it */}
            {frontmatter.date && !hasFooter && (
              <span className="text-xs" style={{ color: 'var(--faint)' }}>
                {formatDate(frontmatter.date)}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h2
          className="font-serif mb-2 text-xl font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]"
          style={{ color: 'var(--fg)' }}
        >
          {frontmatter.title}
        </h2>

        {/* Excerpt */}
        <p
          className={`text-sm leading-relaxed ${(hasTech || hasFooter) ? 'mb-4' : ''} ${frontmatter.image ? 'line-clamp-2' : 'line-clamp-3'}`}
          style={{ color: 'var(--muted)' }}
        >
          {excerpt}
        </p>

        {/* Tech-stack chips — rendered only when field exists */}
        {hasTech && (
          <div className="flex flex-wrap gap-1.5">
            {frontmatter.techStack!.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border px-2 py-0.5 text-xs"
                style={{
                  background:   'var(--bg)',
                  color:        'var(--faint)',
                  borderColor:  'var(--border)',
                }}
              >
                {tech}
              </span>
            ))}
            {frontmatter.techStack!.length > 4 && (
              <span className="rounded-md px-2 py-0.5 text-xs" style={{ color: 'var(--faint)' }}>
                +{frontmatter.techStack!.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* "Read more" CTA — shown when no footer */}
        {!hasFooter && (
          <span
            className="mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors group-hover:text-[var(--accent)]"
            style={{ color: 'var(--muted)' }}
          >
            Read more
            <i
              className="bi bi-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        )}
      </div>

      {/* ── Footer: date + action links ───────────── */}
      {hasFooter && (
        <div
          className="flex items-center justify-between border-t px-5 py-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--faint)' }}>
            {formatDate(frontmatter.date, false)}
          </span>

          <div className="flex items-center gap-3">
            {frontmatter.github && (
              <span
                className="flex items-center gap-1 text-xs transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--faint)' }}
              >
                <i className="bi bi-github" aria-hidden="true" /> Code
              </span>
            )}
            {frontmatter.live && (
              <span
                className="flex items-center gap-1 text-xs transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--faint)' }}
              >
                <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> Live
              </span>
            )}
            <i
              className="bi bi-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: 'var(--faint)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

export interface CardProps {
  item:    ContentItem;
  href:    string;
  layout?: 'default' | 'compact';
}

function CardComponent({ item, href, layout = 'default' }: CardProps) {
  return layout === 'compact'
    ? <CardCompact  item={item} href={href} />
    : <CardDefault item={item} href={href} />;
}

export const Card = memo(CardComponent);
