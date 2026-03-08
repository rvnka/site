/**
 * src/components/ui/ContentGrid.tsx
 *
 * Shared filterable/searchable grid that powers both the Blog and Project pages.
 * Replaces the duplicated logic that was split between BlogGrid and ProjectGrid.
 *
 * Features shared by both:
 *   • Text search (title, description, excerpt, tags)
 *   • Category filter pills
 *   • Animated card entrance (animejs)
 *   • Empty state
 *   • Result count footer
 *
 * Per-caller options:
 *   • `layout`         — "list" (blog) | "grid" (projects)
 *   • `getHref`        — builds the link for each item
 *   • `cardLayout`     — Card layout prop passed through
 *   • `sortable`       — shows newest/oldest select (blog only)
 *   • `searchTechStack`— also searches techStack field (projects only)
 *   • `searchPlaceholder` / `emptyIcon` / `emptyLabel`
 */

'use client';

import { useState, useMemo } from 'react';
import type { ContentItem } from '@/types';
import { Card } from './Card';
import { SearchInput } from './SearchInput';
import { useCardEntrance } from '@/hooks/use-animations';

type SortOrder = 'newest' | 'oldest';

export interface ContentGridProps {
  items:              ContentItem[];
  categories:         string[];
  /** Builds the href for each card */
  getHref:            (item: ContentItem) => string;
  /** 'list' = single column  |  'grid' = 2-column on sm+ */
  layout?:            'list' | 'grid';
  /** Passed through to every Card */
  cardLayout?:        'default' | 'compact';
  /** Show newest / oldest sort selector */
  sortable?:          boolean;
  /** Also search inside frontmatter.techStack */
  searchTechStack?:   boolean;
  searchPlaceholder?: string;
  emptyIcon?:         string;
  emptyLabel?:        string;
  emptyHint?:         string;
}

export function ContentGrid({
  items,
  categories,
  getHref,
  layout            = 'list',
  cardLayout        = 'default',
  sortable          = false,
  searchTechStack   = false,
  searchPlaceholder = 'Search…',
  emptyIcon         = 'bi-search',
  emptyLabel        = 'Nothing found',
  emptyHint         = 'Try a different search term or category',
}: ContentGridProps) {
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortOrder,      setSortOrder]      = useState<SortOrder>('newest');

  const containerRef = useCardEntrance<HTMLDivElement>('[data-card]');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    const result = items.filter((item) => {
      const fm = item.frontmatter;

      const categoryOk =
        activeCategory === 'All' || fm.category === activeCategory;

      const searchOk =
        !q ||
        fm.title.toLowerCase().includes(q) ||
        fm.description?.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        fm.tags?.some((t) => t.toLowerCase().includes(q)) ||
        (searchTechStack && fm.techStack?.some((t) => t.toLowerCase().includes(q)));

      return categoryOk && searchOk;
    });

    return sortable && sortOrder === 'oldest' ? [...result].reverse() : result;
  }, [items, search, activeCategory, sortOrder, sortable, searchTechStack]);

  const total   = items.length;
  const shown   = filtered.length;
  const isGrid  = layout === 'grid';
  const allCats = ['All', ...categories];

  return (
    <>
      {/* ── Toolbar ──────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
          />
        </div>

        {sortable && (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            aria-label="Sort order"
            className="rounded-[10px] border px-3 py-2.5 text-sm font-medium outline-none"
            style={{
              background: 'var(--card)',
              border:     '1px solid var(--border)',
              color:      'var(--fg)',
              cursor:     'pointer',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        )}
      </div>

      {/* ── Category pills ───────────────────────── */}
      <div className="mb-8 flex flex-wrap gap-2">
        {allCats.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-[10px] border px-3.5 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                background: active ? 'var(--accent)' : 'var(--card)',
                color:      active ? '#fff'           : 'var(--muted)',
                border:     `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Cards ────────────────────────────────── */}
      {shown > 0 ? (
        <div
          ref={containerRef}
          className={isGrid ? 'grid gap-5 sm:grid-cols-2' : 'flex flex-col gap-5'}
        >
          {filtered.map((item) => (
            <Card
              key={item.slug}
              item={item}
              href={getHref(item)}
              layout={cardLayout}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <i
            className={`bi ${emptyIcon} mb-4 block text-4xl`}
            style={{ color: 'var(--faint)' }}
            aria-hidden="true"
          />
          <p className="text-base font-medium" style={{ color: 'var(--muted)' }}>
            {emptyLabel}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--faint)' }}>
            {emptyHint}
          </p>
        </div>
      )}

      {/* ── Result count ─────────────────────────── */}
      {shown > 0 && (
        <p className="mt-6 text-center text-sm" style={{ color: 'var(--faint)' }}>
          {shown === total
            ? `${shown} item${shown !== 1 ? 's' : ''}`
            : `${shown} of ${total} item${total !== 1 ? 's' : ''}`}
          {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
        </p>
      )}
    </>
  );
}
