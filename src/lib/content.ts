import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { ContentItem, ContentType, Frontmatter } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const EXCERPT_LEN = 160;
const SLUG_RE = /^[a-z0-9_-]+$/;

const itemCache = new Map<string, ContentItem | null>();
const listCache = new Map<ContentType, ContentItem[]>();

function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

// Strips markdown/MDX syntax to plain text — no AST, no remark pipeline.
function toExcerpt(content: string): string {
  const text = content
    .replace(/^---[\s\S]+?---\s*/m, '')               // frontmatter
    .replace(/^import\s.+$/gm, '')                    // MDX imports
    .replace(/^export\s.+$/gm, '')                    // MDX exports
    .replace(/```[\s\S]*?```/g, '')                   // fenced code blocks
    .replace(/<[^>]+>/g, '')                           // HTML/JSX tags
    .replace(/!\[.*?\]\(.*?\)/g, '')                  // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')          // links → label only
    .replace(/^#{1,6}\s+/gm, '')                      // headings
    .replace(/[*_~]{1,2}([^*_~\n]+)[*_~]{1,2}/g, '$1') // bold/italic/strike
    .replace(/`[^`]+`/g, '')                           // inline code
    .replace(/^\s*[-*+>]\s+/gm, '')                   // list/blockquote markers
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return text.length > EXCERPT_LEN ? `${text.slice(0, EXCERPT_LEN).trimEnd()}…` : text;
}

function coerceDate(val: unknown): string {
  if (typeof val === 'string' && val.length > 0) return val;
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'number') return new Date(val).toISOString().split('T')[0];
  return '';
}

function isValidFrontmatter(data: unknown): data is Frontmatter {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.title       === 'string' && d.title.length       > 0 &&
    typeof d.description === 'string' && d.description.length > 0 &&
    typeof d.category    === 'string' && d.category.length    > 0 &&
    coerceDate(d.date).length > 0
  );
}

function getSlugs(type: ContentType): string[] {
  try {
    return fs
      .readdirSync(path.join(CONTENT_DIR, type))
      .filter((f) => /\.mdx?$/.test(f))
      .map((f) => f.replace(/\.mdx?$/, ''));
  } catch {
    return [];
  }
}

function readItem(type: ContentType, slug: string): ContentItem | null {
  if (!isValidSlug(slug)) return null;

  const base = path.join(CONTENT_DIR, type, slug);
  let raw: string;
  let fileType: 'mdx' | 'md';

  try {
    raw = fs.readFileSync(`${base}.mdx`, 'utf-8');
    fileType = 'mdx';
  } catch {
    try {
      raw = fs.readFileSync(`${base}.md`, 'utf-8');
      fileType = 'md';
    } catch {
      return null;
    }
  }

  let data: Record<string, unknown>;
  let content: string;
  try {
    ({ data, content } = matter(raw) as { data: Record<string, unknown>; content: string });
  } catch {
    return null;
  }

  if (!isValidFrontmatter(data)) return null;

  return {
    slug,
    frontmatter: {
      ...(data as Frontmatter),
      date:      coerceDate(data.date),
      updatedAt: data.updatedAt ? coerceDate(data.updatedAt) : undefined,
    },
    content,
    readingTime: readingTime(content).text,
    excerpt:     toExcerpt(content),
    fileType,
  };
}

function getCachedItem(type: ContentType, slug: string): ContentItem | null {
  const key = `${type}:${slug}`;
  if (itemCache.has(key)) return itemCache.get(key) ?? null;
  const item = readItem(type, slug);
  itemCache.set(key, item);
  return item;
}

function getAllContent(type: ContentType): ContentItem[] {
  if (listCache.has(type)) return listCache.get(type)!;
  const items = getSlugs(type)
    .map((slug) => getCachedItem(type, slug))
    .filter((item): item is ContentItem => item !== null)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  listCache.set(type, items);
  return items;
}

function getCategories(type: ContentType): string[] {
  return [...new Set(getAllContent(type).map((i) => i.frontmatter.category))].sort();
}

export const getAllPosts       = () => getAllContent('blog');
export const getPost           = (slug: string) => getCachedItem('blog', slug);
export const getLatestPosts    = (count = 3) => getAllPosts().slice(0, count);
export const getPostSlugs      = () => getSlugs('blog');
export const getPostCategories = () => getCategories('blog');

export const getAllProjects        = () => getAllContent('projects');
export const getProject            = (slug: string) => getCachedItem('projects', slug);
export const getFeaturedProjects   = () => getAllProjects().filter((p) => p.frontmatter.isPinned).slice(0, 4);
export const getProjectSlugs       = () => getSlugs('projects');
export const getProjectCategories  = () => getCategories('projects');
