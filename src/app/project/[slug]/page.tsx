import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProject, getProjectSlugs } from '@/lib/content';
import { mdxComponents } from "@/lib/mdx-components";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MDXErrorBoundary } from "@/components/ui/ErrorBoundary";
import { siteConfig } from "@/config/site-config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project Not Found" };

  const projectUrl = `${siteConfig.meta.url}/project/${slug}`;

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
    keywords: [
      ...(project.frontmatter.tags ?? []),
      ...(project.frontmatter.techStack ?? []),
    ],
    openGraph: {
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      url: projectUrl,
      type: "website",
      images: project.frontmatter.image
        ? [project.frontmatter.image]
        : [{ url: siteConfig.meta.ogImage, width: 400, height: 400 }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.frontmatter.title,
      description: project.frontmatter.description,
      creator: siteConfig.profile.username,
      images: project.frontmatter.image
        ? [project.frontmatter.image]
        : [siteConfig.meta.ogImage],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { frontmatter, content } = project;
  const projectUrl = `${siteConfig.meta.url}/project/${slug}`;
  const dateModified = frontmatter.updatedAt ?? frontmatter.date;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image ?? siteConfig.meta.ogImage,
    dateCreated: frontmatter.date,
    dateModified,
    creator: {
      "@type": "Person",
      name: siteConfig.profile.name,
      url: siteConfig.meta.url,
    },
    url: projectUrl,
    applicationCategory: "WebApplication",
    keywords: [
      ...(frontmatter.tags ?? []),
      ...(frontmatter.techStack ?? []),
    ].join(", "),
    ...(frontmatter.github ? { codeRepository: frontmatter.github } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/project"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--muted)" }}
        >
          <i className="bi bi-arrow-left text-sm" aria-hidden="true" />
          All Projects
        </Link>

        {frontmatter.image && (
          <div className="relative mb-8 h-64 overflow-hidden rounded-[14px] sm:h-80">
            <Image
              src={frontmatter.image}
              alt={frontmatter.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        )}

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="accent">{frontmatter.category}</Badge>
            {frontmatter.isPinned && (
              <Badge variant="outline">
                <i className="bi bi-pin-fill mr-1 text-xs" aria-hidden="true" />
                Featured
              </Badge>
            )}
            <span className="text-xs" style={{ color: "var(--faint)" }}>
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>

          <h1
            className="font-serif mb-3 text-4xl font-bold leading-tight tracking-tight"
            style={{ color: "var(--fg)", letterSpacing: "-0.02em" }}
          >
            {frontmatter.title}
          </h1>

          <p
            className="mb-6 text-lg leading-7"
            style={{ color: "var(--muted)" }}
          >
            {frontmatter.description}
          </p>

          <div className="flex flex-wrap gap-3">
            {frontmatter.live && (
              <Button
                href={frontmatter.live}
                variant="primary"
                icon="bi-box-arrow-up-right"
                external
              >
                Live Demo
              </Button>
            )}
            {frontmatter.github && (
              <Button
                href={frontmatter.github}
                variant="outline"
                icon="bi-github"
                external
              >
                Source Code
              </Button>
            )}
          </div>
        </header>

        {frontmatter.techStack && frontmatter.techStack.length > 0 && (
          <div
            className="mb-8 rounded-[14px] border p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="font-serif mb-3 text-base font-semibold"
              style={{ color: "var(--fg)" }}
            >
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {frontmatter.techStack.map((tech) => {
                const skill = siteConfig.skills.find((s) => s.name === tech);
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 text-sm font-medium"
                    style={{
                      background: "var(--bg)",
                      color: "var(--fg)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {skill && (
                      <i
                        className={`bi ${skill.icon} text-sm`}
                        style={{ color: skill.color }}
                        aria-hidden="true"
                      />
                    )}
                    {tech}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <MDXErrorBoundary>
          <article
            className="prose prose-lg max-w-none"
            style={{ color: "var(--muted)" }}
          >
            <MDXRemote source={content} components={mdxComponents} />
          </article>
        </MDXErrorBoundary>

        <div
          className="mt-12 flex items-center justify-between border-t pt-6"
          style={{ borderColor: "var(--border)" }}
        >
          <Link
            href="/project"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--muted)" }}
          >
            <i className="bi bi-arrow-left" aria-hidden="true" />
            All Projects
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--muted)" }}
          >
            Work Together
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
