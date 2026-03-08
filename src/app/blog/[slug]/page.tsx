import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPostSlugs } from '@/lib/content';
import { mdxComponents } from "@/lib/mdx-components";
import { Badge } from "@/components/ui/Badge";
import { ShareButtons } from "./ShareButtons";
import { MDXErrorBoundary } from "@/components/ui/ErrorBoundary";
import { siteConfig } from "@/config/site-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const postUrl = `${siteConfig.meta.url}/blog/${slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      url: postUrl,
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updatedAt ?? post.frontmatter.date,
      authors: [post.frontmatter.author ?? siteConfig.profile.name],
      tags: post.frontmatter.tags,
      images: [{ url: siteConfig.meta.ogImage, width: 400, height: 400 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      creator: siteConfig.profile.username,
      images: [siteConfig.meta.ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { frontmatter, content, readingTime } = post;
  const postUrl = `${siteConfig.meta.url}/blog/${slug}`;
  const dateModified = frontmatter.updatedAt ?? frontmatter.date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: siteConfig.meta.ogImage,
    datePublished: frontmatter.date,
    dateModified,
    author: {
      "@type": "Person",
      name: frontmatter.author ?? siteConfig.profile.name,
      url: siteConfig.meta.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.meta.title,
      logo: { "@type": "ImageObject", url: siteConfig.meta.ogImage },
    },
    keywords: frontmatter.tags?.join(", "),
    url: postUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--muted)" }}
        >
          <i className="bi bi-arrow-left text-sm" aria-hidden="true" />
          All Articles
        </Link>

        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{frontmatter.category}</Badge>
            <span className="text-xs" style={{ color: "var(--faint)" }}>
              <i className="bi bi-clock mr-1" aria-hidden="true" />
              {readingTime}
            </span>
            <span className="text-xs" style={{ color: "var(--faint)" }}>
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {frontmatter.updatedAt &&
              frontmatter.updatedAt !== frontmatter.date && (
                <span className="text-xs" style={{ color: "var(--faint)" }}>
                  · Updated{" "}
                  {new Date(frontmatter.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            {frontmatter.author && (
              <span className="text-xs" style={{ color: "var(--faint)" }}>
                by {frontmatter.author}
              </span>
            )}
          </div>

          <h1
            className="font-serif mb-4 text-4xl font-bold leading-tight tracking-tight"
            style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
          >
            {frontmatter.title}
          </h1>

          <p className="text-lg leading-7" style={{ color: "var(--muted)" }}>
            {frontmatter.description}
          </p>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <hr style={{ borderColor: "var(--border)" }} className="mb-10" />

        <MDXErrorBoundary>
          <article className="prose prose-lg max-w-none">
            <MDXRemote source={content} components={mdxComponents} />
          </article>
        </MDXErrorBoundary>

        <div
          className="mt-12 flex flex-col items-start gap-4 rounded-[14px] border p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>
              Found this helpful?
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Share it with your network
            </p>
          </div>
          <ShareButtons title={frontmatter.title} url={postUrl} />
        </div>

        <div
          className="mt-8 flex items-center justify-between border-t pt-6"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--muted)" }}
          >
            <i className="bi bi-arrow-left" aria-hidden="true" />
            All Articles
          </Link>
        </div>
      </div>
    </>
  );
}
