/**
 * src/lib/mdx-components.tsx
 *
 * Only overrides that require custom logic are defined here.
 * All standard prose elements (h1–h6, p, ul, ol, table, …) are intentionally
 * omitted — @tailwindcss/typography's `prose` class handles their styling.
 */

import React from 'react';
import NextImage from 'next/image';
import type { MDXComponents } from 'mdx/types';

// ─────────────────────────────────────────────────────────────
// <a> — opens external links in a new tab safely
// ─────────────────────────────────────────────────────────────

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

function Link({ href, children, ...props }: LinkProps) {
  const isExternal = href?.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// <img> — uses next/image for optimisation where possible,
//          falls back to a plain <img> for external URLs.
// ─────────────────────────────────────────────────────────────

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

function Image({ src = '', alt = '', width, height, ...props }: ImgProps) {
  const isLocal = src.startsWith('/') || src.startsWith('./');

  if (isLocal) {
    return (
      <NextImage
        src={src}
        alt={alt}
        width={Number(width) || 800}
        height={Number(height) || 450}
        className="rounded-lg"
        {...(props as Partial<React.ComponentProps<typeof NextImage>>)}
      />
    );
  }

  // External images: plain tag (Next.js Image requires configured domains)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" {...props} />
  );
}

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export const mdxComponents: MDXComponents = {
  a: Link as MDXComponents['a'],
  img: Image as MDXComponents['img'],
};
