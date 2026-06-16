import type { AnchorHTMLAttributes, ComponentProps, ImgHTMLAttributes } from 'react';
import NextImage from 'next/image';
import type { MDXComponents } from 'mdx/types';

function Link({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
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

function Image({ src = '', alt = '', width, height, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  if (src.startsWith('/') || src.startsWith('./')) {
    return (
      <NextImage
        src={src}
        alt={alt}
        width={Number(width) || 800}
        height={Number(height) || 450}
        className='rounded-lg'
        {...(props as Partial<ComponentProps<typeof NextImage>>)}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading='lazy' decoding='async' {...props} />;
}

export const mdxComponents: MDXComponents = {
  a:   Link as MDXComponents['a'],
  img: Image as MDXComponents['img'],
};
