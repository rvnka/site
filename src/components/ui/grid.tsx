'use client';

import { useMemo, useState } from 'react';
import type { ContentItem } from '@/types';
import { Card } from './card';
import { SearchInput } from './search';
import { useCardEntrance } from '@/hooks/use-anime';

type SortOrder = 'newest' | 'oldest';

export interface ContentGridProps {
  items: ContentItem[];
  categories: string[];
  baseRoute: string;
  layout?: 'list' | 'grid';
  cardLayout?: 'default' | 'compact';
  sortable?: boolean;
  searchTechStack?: boolean;
  searchPlaceholder?: string;
  emptyIcon?: string;
  emptyLabel?: string;
  emptyHint?: string;
}

export function ContentGrid({
  items,
  categories,
  baseRoute,
  layout = 'list',
  cardLayout = 'default',
  sortable = false,
  searchTechStack = false,
  searchPlaceholder = 'Search…',
  emptyIcon = 'bi-search',
  emptyLabel = 'Nothing found',
  emptyHint = 'Try a different search term or category',
}: ContentGridProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const containerRef = useCardEntrance<HTMLDivElement>('[data-card]');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const matches = items.filter((item) => {
      const fm = item.frontmatter;
      const inCategory = activeCategory === 'All' || fm.category === activeCategory;
      const matchesSearch =
        !q ||
        fm.title.toLowerCase().includes(q) ||
        fm.description.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        fm.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
        (searchTechStack && fm.techStack?.some((tech) => tech.toLowerCase().includes(q)));

      return inCategory && matchesSearch;
    });

    return sortable && sortOrder === 'oldest' ? [...matches].reverse() : matches;
  }, [items, search, activeCategory, sortOrder, sortable, searchTechStack]);

  const allCats = ['All', ...categories];
  const shown = filtered.length;
  const total = items.length;

  return (
    <>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row'>
        <div className='flex-1'>
          <SearchInput value={search} onChange={setSearch} placeholder={searchPlaceholder} />
        </div>
        {sortable && (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            aria-label='Sort order'
            className='rounded-full border px-3 py-2.5 text-sm font-medium outline-none'
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--fg)', cursor: 'pointer' }}
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
          </select>
        )}
      </div>

      <div className='mb-8 flex flex-wrap gap-2'>
        {allCats.map((cat) => {
          const active = activeCategory === cat;

          return (
            <button
              key={cat}
              type='button'
              onClick={() => setCategory(cat)}
              aria-pressed={active}
              className='rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5'
              style={{
                background: active ? 'var(--accent)' : 'var(--card)',
                color: active ? '#fff' : 'var(--muted)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: active ? '0 8px 20px color-mix(in srgb, var(--accent) 18%, transparent)' : '0 1px 3px var(--shadow)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {shown > 0 ? (
        <div ref={containerRef} className={layout === 'grid' ? 'grid gap-5 sm:grid-cols-2' : 'flex flex-col gap-5'}>
          {filtered.map((item) => (
            <Card key={item.slug} item={item} href={`${baseRoute}${item.slug}`} layout={cardLayout} />
          ))}
        </div>
      ) : (
        <div className='py-20 text-center'>
          <i className={`bi ${emptyIcon} mb-4 block text-4xl`} style={{ color: 'var(--faint)' }} aria-hidden='true' />
          <p className='text-base font-medium' style={{ color: 'var(--muted)' }}>{emptyLabel}</p>
          <p className='mt-1 text-sm' style={{ color: 'var(--faint)' }}>{emptyHint}</p>
        </div>
      )}

      {shown > 0 && (
        <p className='mt-6 text-center text-sm' style={{ color: 'var(--faint)' }}>
          {shown === total ? `${shown} item${shown !== 1 ? 's' : ''}` : `${shown} of ${total} item${total !== 1 ? 's' : ''}`}
          {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
        </p>
      )}
    </>
  );
}
