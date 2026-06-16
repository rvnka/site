import { z } from 'zod';

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
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

export interface ContentItem {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  readingTime: string;
  excerpt: string;
  fileType: 'mdx' | 'md';
}

export type ContentType = 'blog' | 'projects';

export const contactFormSchema = z.object({
  name:    z.string().min(2).max(100).regex(/^[\p{L}\p{N}\s'-]+$/u),
  email:   z.string().email().max(320).toLowerCase(),
  subject: z.string().min(3).max(200).trim(),
  message: z.string().min(10).max(5000).trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

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
  email?: string;
  startYear: number;
  location?: string;
  available?: boolean;
}

export interface NavItem   { label: string; href: string }
export interface SocialLink { label: string; href: string; icon: string; username: string }
export interface Skill      { name: string; icon: string; color: string }
export interface TimelineEntry  { year: string; title: string; description: string }
export interface EducationEntry { year: string; institution: string; description: string }

export interface SiteConfig {
  readonly meta:      SiteMetadata;
  readonly profile:   UserProfile;
  readonly roles:     readonly string[];
  readonly nav:       readonly NavItem[];
  readonly social:    readonly SocialLink[];
  readonly skills:    readonly Skill[];
  readonly timeline:  readonly TimelineEntry[];
  readonly education: readonly EducationEntry[];
}
