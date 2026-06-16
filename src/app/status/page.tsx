'use client';

import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { useAnimation } from '@/hooks/use-anime';
import { getOverallStatus, getStatusColor, getStatusLabel, systemStatus, type StatusLevel } from '@/config/status';

const STATUS_DESC: Record<StatusLevel, string> = {
  operational: 'All systems are running smoothly and operational.',
  degraded: 'Some services are experiencing degraded performance.',
  offline: 'Some services are currently offline.',
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function StatusPage() {
  const containerRef = useAnimation<HTMLDivElement>(
    { opacity: [0, 1], translateY: [18, 0], duration: 520, ease: 'outQuad' },
    [],
  );

  const overall = getOverallStatus();
  const overallColor = getStatusColor(overall);

  return (
    <div ref={containerRef} className='min-h-screen'>
      <PageShell width='sm' top='py-20'>
        <div className='mb-8 text-center'>
          <p className='mb-2 text-xs font-semibold uppercase tracking-[0.3em]' style={{ color: 'var(--accent)' }}>
            Status
          </p>
          <h1 className='font-serif text-3xl font-bold tracking-tight text-balance' style={{ color: 'var(--fg)' }}>
            System Status
          </h1>
          <p className='mt-3 text-base leading-7' style={{ color: 'var(--muted)' }}>
            Current snapshot of services and systems.
          </p>
        </div>

        <section className='surface surface-hover mb-8 rounded-2xl p-6'>
          <div className='flex items-center gap-4'>
            <span className='inline-block h-4 w-4 rounded-full shadow-sm' style={{ backgroundColor: overallColor }} aria-hidden='true' />
            <div className='text-left'>
              <h2 className='text-lg font-semibold' style={{ color: 'var(--fg)' }}>{getStatusLabel(overall)}</h2>
              <p className='text-sm' style={{ color: 'var(--faint)' }}>{STATUS_DESC[overall]}</p>
            </div>
          </div>
        </section>

        <section className='space-y-3'>
          <h3 className='text-sm font-semibold uppercase tracking-[0.3em]' style={{ color: 'var(--muted)' }}>
            Services
          </h3>
          <div className='grid gap-3 md:grid-cols-2'>
            {systemStatus.map((service) => (
              <article
                key={service.name}
                className='surface surface-hover rounded-2xl p-4'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='inline-block h-2.5 w-2.5 rounded-full' style={{ backgroundColor: getStatusColor(service.status) }} aria-hidden='true' />
                      <h4 className='font-medium' style={{ color: 'var(--fg)' }}>{service.name}</h4>
                    </div>
                    <p className='mt-1 text-xs leading-5' style={{ color: 'var(--faint)' }}>{service.description}</p>
                  </div>
                  <span className='text-xs font-semibold uppercase tracking-[0.2em]' style={{ color: getStatusColor(service.status) }}>
                    {service.status}
                  </span>
                </div>
                <p className='mt-3 text-xs' style={{ color: 'var(--muted)' }}>
                  Last checked: {dateFormatter.format(new Date(service.lastUpdated))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className='surface mt-8 rounded-2xl border-dashed p-6' style={{ borderColor: 'var(--border)' }}>
          <h3 className='font-semibold' style={{ color: 'var(--fg)' }}>How to interpret status</h3>
          <div className='mt-3 space-y-3 text-sm' style={{ color: 'var(--muted)' }}>
            {[
              { color: '#22c55e', label: 'Operational', desc: 'Normal.' },
              { color: '#f59e0b', label: 'Degraded', desc: 'Slow.' },
              { color: '#ef4444', label: 'Offline', desc: 'Down.' },
            ].map(({ color, label, desc }) => (
              <div key={label} className='flex gap-3'>
                <span className='mt-1 h-2 w-2 rounded-full' style={{ backgroundColor: color }} aria-hidden='true' />
                <div>
                  <strong style={{ color: 'var(--fg)' }}>{label}</strong> — {desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-sm font-medium transition-colors duration-200 hover:text-[var(--accent)]'
            style={{ color: 'var(--muted)' }}
          >
            ← Back to home
          </Link>
        </div>
      </PageShell>
    </div>
  );
}
