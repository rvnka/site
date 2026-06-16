import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getOverallStatus, getStatusColor, getStatusLabel } from '@/config/status';

export function Footer() {
  const year = new Date().getFullYear();
  const githubLink = siteConfig.social.find((s) => s.icon === 'bi-github');
  const overallStatus = getOverallStatus();

  return (
    <footer className='mt-20 border-t' style={{ borderColor: 'var(--border)' }}>
      <div className='mx-auto max-w-3xl px-6 py-10 text-center'>
        <div className='mb-6 flex items-center justify-center gap-2'>
          <span
            className='inline-block h-2 w-2 rounded-full'
            style={{ backgroundColor: getStatusColor(overallStatus) }}
            aria-hidden='true'
          />
          <Link
            href='/status'
            className='text-xs font-medium transition-colors duration-200 hover:text-[var(--accent)]'
            style={{ color: 'var(--faint)' }}
            title='View system status'
          >
            {getStatusLabel(overallStatus)}
          </Link>
        </div>

        <nav aria-label='Footer navigation'>
          <ul className='mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className='text-sm transition-colors duration-200 hover:text-[var(--accent)]'
                  style={{ color: 'var(--faint)' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href='/feed.xml'
                className='text-sm transition-colors duration-200 hover:text-[var(--accent)]'
                style={{ color: 'var(--faint)' }}
              >
                RSS
              </a>
            </li>
            <li>
              <a
                href='/sitemap.xml'
                className='text-sm transition-colors duration-200 hover:text-[var(--accent)]'
                style={{ color: 'var(--faint)' }}
              >
                Sitemap
              </a>
            </li>
          </ul>
        </nav>

        <p className='text-sm' style={{ color: 'var(--faint)' }}>
          Built with <span className='heart' aria-hidden='true'>♡</span> by{' '}
          {githubLink ? (
            <a
              href={githubLink.href}
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium transition-colors hover:text-[var(--accent)]'
              style={{ color: 'var(--muted)' }}
            >
              {siteConfig.profile.username}
            </a>
          ) : (
            <span style={{ color: 'var(--muted)' }}>{siteConfig.profile.username}</span>
          )}
        </p>
        <p className='mt-1 text-xs' style={{ color: 'var(--faint)' }}>
          © {siteConfig.profile.startYear} – {year} {siteConfig.profile.name}
        </p>
      </div>
    </footer>
  );
}
