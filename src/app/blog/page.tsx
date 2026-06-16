import type { Metadata } from 'next';
import { getAllPosts, getPostCategories } from '@/lib/content';
import { PageHeader } from '@/components/ui/heading';
import { ContentGrid } from '@/components/ui/grid';
import { PageShell } from '@/components/layout/page-shell';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, tutorials, and dev diaries.',
};

export default function BlogPage() {
  const posts      = getAllPosts();
  const categories = getPostCategories();
  return (
    <PageShell>
      <PageHeader
        eyebrow='Writing'
        title='Blog'
        description='Thoughts, tutorials, and notes from my learning journey.'
      />
      <ContentGrid
        items={posts}
        categories={categories}
        baseRoute='/blog/'
        layout='list'
        sortable
        searchPlaceholder='Search articles…'
        emptyIcon='bi-journal-x'
        emptyLabel='No articles found'
        emptyHint='Try a different search term or category'
      />
    </PageShell>
  );
}
