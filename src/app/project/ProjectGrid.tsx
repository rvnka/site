/**
 * src/app/project/ProjectGrid.tsx
 *
 * Thin wrapper around the shared ContentGrid.
 * All filter/search logic lives in ContentGrid.
 */

'use client';

import type { ContentItem } from '@/types';
import { ContentGrid } from '@/components/ui/ContentGrid';

interface ProjectGridProps {
  projects:   ContentItem[];
  categories: string[];
}

export function ProjectGrid({ projects, categories }: ProjectGridProps) {
  return (
    <ContentGrid
      items={projects}
      categories={categories}
      getHref={(item) => `/project/${item.slug}`}
      layout="grid"
      searchTechStack
      searchPlaceholder="Search projects…"
      emptyIcon="bi-search"
      emptyLabel="No projects found"
      emptyHint="Try a different search term, category, or tech"
    />
  );
}
