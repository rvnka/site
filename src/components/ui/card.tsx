'use client';

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import type { CSSProperties } from 'react';
import { Badge } from './badge';
import type { ContentItem } from '@/types';

const SURFACE: CSSProperties = {
  background: 'color-mix(in srgb, var(--card) 92%, transparent)',
  border: '1px solid color-mix(in srgb, var(--accent) 14%, var(--border))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 1px 3px var(--shadow)',
};

function formatDate(date: string, showDay = true): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    ...(showDay ? { day: 'numeric' } : {}),
  });
}

function CardCompact({ item, href }: { item: ContentItem; href: string }) {
  const { frontmatter, readingTime } = item;

  return (
    <Link
      href={href}
      data-card
      className='group flex items-start gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
      style={SURFACE}
    >
      <div className='min-w-0 flex-1'>
        <div className='mb-1 flex items-center gap-2'>
          <Badge variant='accent'>{frontmatter.category}</Badge>
          {readingTime && <span className='text-xs' style={{ color: 'var(--faint)' }}>{readingTime}</span>}
        </div>
        <h3
          title={frontmatter.title}
          className='font-serif truncate text-base font-semibold tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]'
          style={{ color: 'var(--fg)' }}
        >
          {frontmatter.title}
        </h3>
      </div>
      <i
        className='bi bi-arrow-right mt-1 flex-shrink-0 text-sm transition-transform duration-200 group-hover:translate-x-1'
        style={{ color: 'var(--faint)' }}
        aria-hidden='true'
      />
    </Link>
  );
}

function CardDefault({ item, href }: { item: ContentItem; href: string }) {
  const { frontmatter, excerpt, readingTime } = item;
  const hasTech = (frontmatter.techStack?.length ?? 0) > 0;
  const hasLinks = Boolean(frontmatter.github || frontmatter.live);
  const hasDate = Boolean(frontmatter.date);

  return (
    <article
      data-card
      className='group relative block overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
      style={SURFACE}
    >
      <Link
        href={href}
        aria-label={`Open ${frontmatter.title}`}
        className='absolute inset-0 z-20 rounded-2xl'
      >
        <span className='sr-only'>Open {frontmatter.title}</span>
      </Link>

      {frontmatter.image && (
        <div className='relative h-52 overflow-hidden sm:h-56'>
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100' />
        </div>
      )}

      <div className={frontmatter.image ? 'relative z-10 p-5' : 'relative z-10 p-6'}>
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <Badge variant='accent'>{frontmatter.category}</Badge>
          {frontmatter.isPinned && (
            <Badge variant='outline'>
              <i className='bi bi-pin-fill mr-1 text-xs' aria-hidden='true' />Pinned
            </Badge>
          )}
        </div>

        {!frontmatter.image && (readingTime || hasDate) && (
          <div className='mb-2 flex flex-wrap items-center gap-2'>
            {readingTime && (
              <span className='text-xs' style={{ color: 'var(--faint)' }}>
                <i className='bi bi-clock mr-1' aria-hidden='true' />
                {readingTime}
              </span>
            )}
            {hasDate && (
              <span className='text-xs' style={{ color: 'var(--faint)' }}>
                {formatDate(frontmatter.date)}
              </span>
            )}
          </div>
        )}

        <h2
          className='font-serif mb-2 text-xl font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]'
          style={{ color: 'var(--fg)' }}
        >
          {frontmatter.title}
        </h2>

        <p
          className={`text-sm leading-relaxed ${hasTech || hasLinks || hasDate ? 'mb-4' : ''} ${frontmatter.image ? 'line-clamp-2' : 'line-clamp-3'}`}
          style={{ color: 'var(--muted)' }}
        >
          {excerpt}
        </p>

        {hasTech && (
          <div className='flex flex-wrap gap-1.5'>
            {frontmatter.techStack!.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className='rounded-full border px-2.5 py-0.5 text-xs transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]'
                style={{ background: 'var(--bg)', color: 'var(--faint)', borderColor: 'var(--border)' }}
              >
                {tech}
              </span>
            ))}
            {frontmatter.techStack!.length > 4 && (
              <span className='rounded-full px-2.5 py-0.5 text-xs' style={{ color: 'var(--faint)' }}>
                +{frontmatter.techStack!.length - 4} more
              </span>
            )}
          </div>
        )}

        {!hasLinks && !hasDate && (
          <span
            className='mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 group-hover:text-[var(--accent)]'
            style={{ color: 'var(--muted)' }}
          >
            Read more
            <i className='bi bi-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1' aria-hidden='true' />
          </span>
        )}
      </div>

      {(hasLinks || hasDate) && (
        <div className='relative z-30 flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3' style={{ borderColor: 'var(--border)' }}>
          <span className='text-xs' style={{ color: 'var(--faint)' }}>
            {hasDate ? formatDate(frontmatter.date, false) : readingTime}
          </span>
          <div className='flex items-center gap-3'>
            {frontmatter.github && (
              <a
                href={frontmatter.github}
                target='_blank'
                rel='noopener noreferrer'
                className='relative z-30 flex items-center gap-1 text-xs transition-colors duration-150 hover:text-[var(--accent)]'
                style={{ color: 'var(--faint)' }}
                aria-label={`View source code for ${frontmatter.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <i className='bi bi-github' aria-hidden='true' /> Code
              </a>
            )}
            {frontmatter.live && (
              <a
                href={frontmatter.live}
                target='_blank'
                rel='noopener noreferrer'
                className='relative z-30 flex items-center gap-1 text-xs transition-colors duration-150 hover:text-[var(--accent)]'
                style={{ color: 'var(--faint)' }}
                aria-label={`Open live demo for ${frontmatter.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <i className='bi bi-box-arrow-up-right' aria-hidden='true' /> Live
              </a>
            )}
            <i
              className='bi bi-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1'
              style={{ color: 'var(--faint)' }}
              aria-hidden='true'
            />
          </div>
        </div>
      )}
    </article>
  );
}

export interface CardProps {
  item: ContentItem;
  href: string;
  layout?: 'default' | 'compact';
}

export const Card = memo(function Card({ item, href, layout = 'default' }: CardProps) {
  return layout === 'compact' ? <CardCompact item={item} href={href} /> : <CardDefault item={item} href={href} />;
});
