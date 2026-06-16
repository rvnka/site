import type { SocialLink } from '@/types';

interface SocialLinksProps {
  links: readonly SocialLink[];
  variant?: 'icon' | 'icon-label' | 'card';
  className?: string;
}

function isExternal(href: string): boolean {
  return !href.startsWith('mailto:') && !href.startsWith('/');
}

export function SocialLinks({ links, variant = 'icon', className = '' }: SocialLinksProps) {
  if (variant === 'card') {
    return (
      <nav aria-label='Social media links'>
        <ul className={`flex flex-col gap-2.5 ${className}`.trim()}>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={isExternal(link.href) ? '_blank' : undefined}
                rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
                aria-label={link.username ? `${link.label} - ${link.username}` : link.label}
                className='group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2'
                style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
              >
                <div
                  className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border'
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                >
                  <i className={`bi ${link.icon} text-sm`} style={{ color: 'var(--accent)' }} aria-hidden='true' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-xs font-medium' style={{ color: 'var(--fg)' }}>{link.label}</p>
                  {link.username && <p className='truncate text-xs' style={{ color: 'var(--faint)' }}>{link.username}</p>}
                </div>
                <i className='bi bi-arrow-right flex-shrink-0 text-xs transition-transform duration-200 group-hover:translate-x-0.5' style={{ color: 'var(--faint)' }} aria-hidden='true' />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  const withLabel = variant === 'icon-label';
  return (
    <nav aria-label='Social media links'>
      <ul className={`flex flex-wrap items-center justify-center gap-3 ${className}`.trim()}>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              aria-label={link.username ? `${link.label} - ${link.username}` : link.label}
              target={isExternal(link.href) ? '_blank' : undefined}
              rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
              className={[
                'social-hover border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
                withLabel
                  ? 'flex items-center gap-2 rounded-full px-3 py-2'
                  : 'flex h-10 w-10 items-center justify-center rounded-full',
              ].join(' ')}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
            >
              <i className={`bi ${link.icon} social-icon text-base`} aria-hidden='true' />
              {withLabel && link.username && (
                <span className='relative z-10 text-sm font-medium transition-colors duration-300' style={{ color: 'var(--muted)' }}>
                  {link.username}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
