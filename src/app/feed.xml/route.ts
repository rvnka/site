import { getAllPosts } from '@/lib/content';
import { siteConfig } from '@/config/site-config';

export async function GET() {
  try {
    const baseUrl = siteConfig.meta.url;
    const posts = getAllPosts();

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.meta.title)} - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml(siteConfig.meta.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>

    ${posts
      .map((post) => {
        const postUrl = `${baseUrl}/blog/${post.slug}`;
        const publishDate = new Date(post.frontmatter.date).toUTCString();
        const bodyText = escapeXml(post.excerpt);

        return `
    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${publishDate}</pubDate>
      <description>${escapeXml(post.frontmatter.description)}</description>
      <content:encoded><![CDATA[
        <p>${post.frontmatter.description}</p>
        <p>${bodyText}</p>
        <p><a href="${postUrl}">Read the full article →</a></p>
      ]]></content:encoded>
      <author>${escapeXml(post.frontmatter.author ?? siteConfig.profile.email)}</author>
      <category>${escapeXml(post.frontmatter.category)}</category>
      ${post.frontmatter.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ") ?? ""}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new Response(rssContent, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[feed.xml] Failed to generate RSS feed:", message);

    const errorFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.meta.title)} - Blog</title>
    <link>${siteConfig.meta.url}/blog</link>
    <description>Feed unavailable - please try again later</description>
  </channel>
</rss>`;

    return new Response(errorFeed, {
      status: 503,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Retry-After": "3600",
      },
    });
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
