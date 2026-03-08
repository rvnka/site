/**
 * src/app/blog/BlogGrid.tsx
 *
 * Thin wrapper around the shared ContentGrid.
 * All filter/search/sort logic lives in ContentGrid.
 */

'use client';

import type { ContentItem } from '@/types';
import { ContentGrid } from '@/components/ui/ContentGrid';

interface BlogGridProps {
  posts:      ContentItem[];
  categories: string[];
}

export function BlogGrid({ posts, categories }: BlogGridProps) {
  return (
    <ContentGrid
      items={posts}
      categories={categories}
      getHref={(item) => `/blog/${item.slug}`}
      layout="list"
      sortable
      searchPlaceholder="Search articles…"
      emptyIcon="bi-journal-x"
      emptyLabel="No articles found"
      emptyHint="Try a different search term or category"
    />
  );
}
