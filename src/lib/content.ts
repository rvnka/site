/**
 * src/lib/content.ts
 *
 * Single-file content library — file-system access, caching, markdown parsing,
 * and high-level query APIs all in one place.
 *
 * Replaces:
 *   src/lib/content/cache.ts
 *   src/lib/content/index.ts
 *   src/lib/content/markdown-parser.ts
 *   src/lib/content/queries.ts
 *   src/lib/content/retrieval.ts
 */

import 'server-only';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import stripMarkdown from 'strip-markdown';
import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

import type { ContentItem, ContentType, Frontmatter } from '@/types';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content');
const EXCERPT_LENGTH = 160;

/** MDX AST node types that should be stripped before plain-text extraction. */
const MDX_NODE_TYPES = new Set([
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
  'mdxjsEsm',
  'mdxFlowExpression',
  'mdxTextExpression',
]);

// ─────────────────────────────────────────────────────────────
// Module-level cache  (Map is fast and GC-safe)
// ─────────────────────────────────────────────────────────────

const itemCache = new Map<string, ContentItem | null>();
const allContentCache = new Map<ContentType, ContentItem[]>();

/** Wipes all caches — useful in tests or dev watch mode. */
function clearCache(): void {
  itemCache.clear();
  allContentCache.clear();
}

// ─────────────────────────────────────────────────────────────
// Markdown → plain-text  (used for excerpt generation)
// ─────────────────────────────────────────────────────────────

/** Remark plugin that removes MDX-specific AST nodes before strip-markdown. */
function remarkStripMdxNodes() {
  return (tree: Node) => {
    visit(tree, (node, index, parent) => {
      if (parent == null || index == null) return;
      if (MDX_NODE_TYPES.has((node as { type: string }).type)) {
        (parent as { children: Node[] }).children.splice(index, 1);
        return index; // re-visit same index after removal
      }
    });
  };
}

/**
 * Converts MDX / Markdown content to a plain-text string.
 *
 * @param markdown  Raw file content (frontmatter already stripped).
 * @param isMd      Pass `true` for `.md` files to skip MDX-specific plugins.
 */
function markdownToPlainText(markdown: string, isMd = false): string {
  // Strip YAML frontmatter block if still present
  const body = markdown.replace(/^---[\s\S]+?---\s*/m, '');

  const processor = remark();
  
  if (!isMd) {
    processor.use(remarkMdx);
    processor.use(remarkStripMdxNodes);
  }
  
  processor.use(remarkGfm);
  
  return processor
    .use(stripMarkdown)
    .processSync(body)
    .toString()
    .replace(/\n+/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────────────────────
// File-system helpers
// ─────────────────────────────────────────────────────────────

/** Coerces a raw frontmatter date value to a YYYY-MM-DD string. */
function coerceDate(val: unknown): string {
  if (typeof val === 'string' && val.length > 0) return val;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'number') return new Date(val).toISOString().split('T')[0];
  return '';
}

/** Type-guard: ensures a frontmatter object has all required fields. */
function isValidFrontmatter(data: unknown): data is Frontmatter {
  if (typeof data !== 'object' || data === null) return false;

  const d = data as Record<string, unknown>;

  return (
    typeof d.title === 'string' && d.title.length > 0 &&
    typeof d.description === 'string' && d.description.length > 0 &&
    coerceDate(d.date).length > 0 &&
    typeof d.category === 'string' && d.category.length > 0
  );
}

/**
 * Returns all slugs for a content directory.
 * Result is NOT cached (used to seed the item cache).
 */
function getSlugs(type: ContentType): string[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      .map((f) => f.replace(/\.mdx?$/, ''));
  } catch (err) {
    console.warn(`[content] Cannot read "${dir}":`, err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * Reads, parses, and returns a single content file.
 * Returns `null` on any error or missing required frontmatter.
 */
function readContentItem(type: ContentType, slug: string): ContentItem | null {
  const mdxPath = path.join(CONTENT_DIR, type, `${slug}.mdx`);
  const mdPath  = path.join(CONTENT_DIR, type, `${slug}.md`);

  const [filePath, fileType]: [string, 'mdx' | 'md'] = fs.existsSync(mdxPath)
    ? [mdxPath, 'mdx']
    : fs.existsSync(mdPath)
    ? [mdPath, 'md']
    : ['', 'mdx'];

  if (!filePath) return null;

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.warn(`[content] Cannot read "${filePath}":`, err instanceof Error ? err.message : err);
    return null;
  }

  let data: Record<string, unknown>;
  let content: string;
  try {
    ({ data, content } = matter(raw) as { data: Record<string, unknown>; content: string });
  } catch (err) {
    console.warn(`[content] Frontmatter parse error for "${slug}":`, err instanceof Error ? err.message : err);
    return null;
  }

  if (!isValidFrontmatter(data)) {
    console.warn(`[content] Missing required frontmatter in "${slug}" (needs: title, description, date, category).`);
    return null;
  }

  const frontmatter: Frontmatter = {
    ...(data as Frontmatter),
    date: coerceDate(data.date),
    updatedAt: data.updatedAt ? coerceDate(data.updatedAt) : undefined,
  };

  const plainText = markdownToPlainText(content, fileType === 'md');
  const excerpt =
    plainText.length > EXCERPT_LENGTH
      ? plainText.slice(0, EXCERPT_LENGTH).trimEnd() + '…'
      : plainText;

  return {
    slug,
    frontmatter,
    content,
    readingTime: readingTime(content).text,
    excerpt,
    fileType,
  };
}

// ─────────────────────────────────────────────────────────────
// Cached access layer
// ─────────────────────────────────────────────────────────────

/** Returns a single item, using the module-level cache. */
function getCachedItem(type: ContentType, slug: string): ContentItem | null {
  const key = `${type}:${slug}`;
  if (itemCache.has(key)) return itemCache.get(key) ?? null;
  const item = readContentItem(type, slug);
  itemCache.set(key, item);
  return item;
}

/** Returns all items of `type`, sorted newest-first, using the module-level cache. */
function getAllContent(type: ContentType): ContentItem[] {
  if (allContentCache.has(type)) return allContentCache.get(type)!;

  const items = getSlugs(type)
    .map((slug) => getCachedItem(type, slug))
    .filter((item): item is ContentItem => item !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  allContentCache.set(type, items);
  return items;
}

/** Returns unique, sorted categories for a content type. */
function getCategories(type: ContentType): string[] {
  return [...new Set(getAllContent(type).map((i) => i.frontmatter.category))].sort();
}

// ─────────────────────────────────────────────────────────────
// Public API — Blog
// ─────────────────────────────────────────────────────────────

/** All blog posts, sorted newest-first. */
export function getAllPosts(): ContentItem[] {
  return getAllContent('blog');
}

/** Single post by slug, or `null` if not found. */
export function getPost(slug: string): ContentItem | null {
  return getCachedItem('blog', slug);
}

/** The most recent N posts (default 3). */
export function getLatestPosts(count = 3): ContentItem[] {
  return getAllPosts().slice(0, count);
}

/** All blog slugs (for `generateStaticParams`). */
export function getPostSlugs(): string[] {
  return getSlugs('blog');
}

/** Unique blog categories, sorted A→Z. */
export function getPostCategories(): string[] {
  return getCategories('blog');
}

// ─────────────────────────────────────────────────────────────
// Public API — Projects
// ─────────────────────────────────────────────────────────────

/** All projects, sorted newest-first. */
export function getAllProjects(): ContentItem[] {
  return getAllContent('projects');
}

/** Single project by slug, or `null` if not found. */
export function getProject(slug: string): ContentItem | null {
  return getCachedItem('projects', slug);
}

/** Pinned / featured projects (up to 4). */
export function getFeaturedProjects(): ContentItem[] {
  return getAllProjects().filter((p) => p.frontmatter.isPinned).slice(0, 4);
}

/** All project slugs (for `generateStaticParams`). */
export function getProjectSlugs(): string[] {
  return getSlugs('projects');
}

/** Unique project categories, sorted A→Z. */
export function getProjectCategories(): string[] {
  return getCategories('projects');
}
