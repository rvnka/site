/**
 * src/types/index.ts
 *
 * Single source of truth for every type and Zod schema in the application.
 * Replaces: src/types/content.ts · src/types/forms.ts · src/types/site.ts
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Content types
// ─────────────────────────────────────────────────────────────

/** Frontmatter metadata shared by blog posts and projects. */
export interface Frontmatter {
  title: string;
  description: string;
  /** Publication date (YYYY-MM-DD). */
  date: string;
  /** Last-updated date (YYYY-MM-DD). Falls back to `date` when absent. */
  updatedAt?: string;
  category: string;
  tags?: string[];
  isPinned?: boolean;
  image?: string;
  github?: string;
  live?: string;
  techStack?: string[];
  author?: string;
}

/** A parsed content file with frontmatter, body, and derived metadata. */
export interface ContentItem {
  slug: string;
  frontmatter: Frontmatter;
  /** Raw MDX / Markdown body (after frontmatter is stripped). */
  content: string;
  /** Human-readable reading-time string, e.g. "3 min read". */
  readingTime: string;
  /** Plain-text excerpt (≤ 160 chars). */
  excerpt: string;
  fileType: 'mdx' | 'md';
}

/** Discriminated union for the two content directories. */
export type ContentType = 'blog' | 'projects';

// ─────────────────────────────────────────────────────────────
// Form / validation schemas
// ─────────────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[\p{L}\p{N}\s'-]+$/u, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(320, 'Email is too long')
    .toLowerCase(),

  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject is too long')
    .trim(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long (max 5000 characters)')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const searchQuerySchema = z.object({
  q: z
    .string()
    .max(200, 'Search query is too long')
    .regex(/^[^<>{}()[\]]*$/, 'Search query contains invalid characters')
    .optional()
    .default(''),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ─────────────────────────────────────────────────────────────
// Site-configuration types
// ─────────────────────────────────────────────────────────────

export interface SiteMetadata {
  title: string;
  description: string;
  url: string;
  icon: string;
  ogImage: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  email: string;
  startYear: number;
  location: string;
  available: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
  username: string;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface EducationEntry {
  year: string;
  institution: string;
  description: string;
}

export interface SiteConfig {
  readonly meta: SiteMetadata;
  readonly profile: UserProfile;
  readonly roles: readonly string[];
  readonly nav: readonly NavItem[];
  readonly social: readonly SocialLink[];
  readonly skills: readonly Skill[];
  readonly timeline: readonly TimelineEntry[];
  readonly edu_timeline: readonly EducationEntry[];
}
