import { getAllPosts } from '@/lib/content';
import { siteConfig, hasValidEmail } from '@/config/site';

function escapeXml(str: string): string {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const baseUrl = siteConfig.meta.url;
    const posts   = getAllPosts();

    const items = posts
      .map((post) => {
        const postUrl = `${baseUrl}/blog/${post.slug}`;
        return `
    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.frontmatter.description)}</description>
      <content:encoded><![CDATA[
        <p>${post.frontmatter.description}</p>
        <p>${escapeXml(post.excerpt)}</p>
        <p><a href="${postUrl}">Read the full article →</a></p>
      ]]></content:encoded>
      <author>${escapeXml(
        post.frontmatter.author ??
          (hasValidEmail(siteConfig.profile.email)
            ? siteConfig.profile.email
            : siteConfig.profile.name),
      )}</author>
      <category>${escapeXml(post.frontmatter.category)}</category>
      ${post.frontmatter.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ') ?? ''}
    </item>`;
      })
      .join('');

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.meta.title)} - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml(siteConfig.meta.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(rssContent, {
      headers: {
        'Content-Type':  'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.meta.title)} - Blog</title>
    <link>${siteConfig.meta.url}/blog</link>
    <description>Feed unavailable — please try again later</description>
  </channel>
</rss>`;

    return new Response(fallback, {
      status: 503,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Retry-After':  '3600',
      },
    });
  }
}
