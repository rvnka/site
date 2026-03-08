import type { Metadata } from 'next';
import { getAllPosts, getPostCategories } from '@/lib/content';
import { BlogGrid } from './BlogGrid';

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and dev diaries from Rinn.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getPostCategories();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}
        >
          Writing
        </p>
        <h1
          className="font-serif mb-3 text-4xl font-bold tracking-tight"
          style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}
        >
          Blog
        </h1>
        <p className="text-base" style={{ color: 'var(--muted)' }}>
          Thoughts, tutorials, and notes from my learning journey.
        </p>
      </div>

      <BlogGrid posts={posts} categories={categories} />
    </div>
  );
}
