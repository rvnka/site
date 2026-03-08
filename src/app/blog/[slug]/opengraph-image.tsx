import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/content';
import { OGImage, OG_SIZE } from '@/lib/og/template';

export const size        = OG_SIZE;
export const contentType = 'image/png';

interface Props { params: Promise<{ slug: string }> }

export default async function PostOGImage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  const date = post?.frontmatter.date
    ? new Date(post.frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : undefined;

  return new ImageResponse(
    <OGImage
      title={post?.frontmatter.title ?? 'Blog Post'}
      description={post?.frontmatter.description}
      category={post?.frontmatter.category}
      metaLabel={date}
    />,
    { ...size },
  );
}
