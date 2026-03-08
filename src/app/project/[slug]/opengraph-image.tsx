import { ImageResponse } from 'next/og';
import { getProject } from '@/lib/content';
import { OGImage, OG_SIZE } from '@/lib/og/template';

export const size        = OG_SIZE;
export const contentType = 'image/png';

interface Props { params: Promise<{ slug: string }> }

export default async function ProjectOGImage({ params }: Props) {
  const { slug } = await params;
  const project  = getProject(slug);

  return new ImageResponse(
    <OGImage
      title={project?.frontmatter.title ?? 'Project'}
      description={project?.frontmatter.description}
      category={project?.frontmatter.category}
      metaLabel="Project"
      chips={project?.frontmatter.techStack?.slice(0, 5)}
    />,
    { ...size },
  );
}
