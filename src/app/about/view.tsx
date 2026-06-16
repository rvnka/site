'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { siteConfig, hasLocation, hasValidEmail } from '@/config/site';
import { Btn } from '@/components/ui/btn';
import { PageHeader } from '@/components/ui/heading';
import { PageShell } from '@/components/layout/page-shell';
import { useStaggerAnimation } from '@/hooks/use-anime';

export function AboutView() {
  return (
    <PageShell>
      <PageHeader
        eyebrow='About'
        title={<>Hey, I&apos;m {siteConfig.profile.name} 👋</>}
        description={siteConfig.profile.bio}
        className='mb-12'
      />

      <section
        className='surface surface-hover mb-16 flex flex-col items-center gap-6 rounded-2xl p-6 sm:flex-row sm:items-start'
      >
        <Image
          src={siteConfig.profile.avatar}
          alt={siteConfig.profile.name}
          width={96}
          height={96}
          className='h-24 w-24 flex-shrink-0 rounded-full border object-cover transition-transform duration-300 hover:scale-105'
          style={{ borderColor: 'var(--border)' }}
        />
        <div>
          <h2 className='font-serif text-xl font-bold' style={{ color: 'var(--fg)' }}>
            {siteConfig.profile.name}
          </h2>
          <p className='text-sm' style={{ color: 'var(--muted)' }}>{siteConfig.profile.username}</p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {hasLocation(siteConfig.profile.location) && <InfoChip icon='bi-geo-alt' label={siteConfig.profile.location!} />}
            <InfoChip icon='bi-calendar3' label={`Coding since ${siteConfig.profile.startYear}`} />
            {hasValidEmail(siteConfig.profile.email) && <InfoChip icon='bi-envelope' label={siteConfig.profile.email!} />}
            {siteConfig.profile.available && <InfoChip icon='bi-circle-fill' label='Available for work' accent />}
          </div>
        </div>
      </section>

      <TimelineSection title='Timeline' icon='bi-briefcase'>
        {siteConfig.timeline.map((item) => (
          <TimelineItem key={item.year} year={item.year} title={item.title} description={item.description} />
        ))}
      </TimelineSection>

      <TimelineSection title='Education' icon='bi-mortarboard'>
        {siteConfig.education.map((item) => (
          <TimelineItem key={item.institution} year={item.year} title={item.institution} description={item.description} />
        ))}
      </TimelineSection>

      <SkillsSection />

      <div className='flex flex-wrap items-center gap-3 border-t pt-12' style={{ borderColor: 'var(--border)' }}>
        <Btn href='/project' variant='primary' icon='bi-grid'>View Projects</Btn>
        <Btn href='/contact' variant='outline' icon='bi-envelope'>Contact Me</Btn>
      </div>
    </PageShell>
  );
}

function SkillsSection() {
  const skillsRef = useStaggerAnimation<HTMLDivElement>(
    '.skill-item',
    { opacity: [0, 1], translateY: [15, 0], filter: ['blur(4px)', 'blur(0px)'], duration: 500, ease: 'outQuad' },
    [],
  );

  return (
    <section className='mb-12' ref={skillsRef}>
      <h2 className='font-serif mb-6 text-2xl font-bold tracking-tight' style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}>
        Tech Stack
      </h2>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {siteConfig.skills.map((skill) => (
          <div
            key={skill.name}
            className='skill-item surface flex items-center gap-3 rounded-2xl p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
          >
            <i className={`bi ${skill.icon} text-xl`} style={{ color: skill.color }} aria-hidden='true' />
            <span className='text-sm font-medium' style={{ color: 'var(--fg)' }}>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineSection({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  const ref = useStaggerAnimation<HTMLDivElement>(
    '.timeline-item',
    { opacity: [0, 1], translateX: [-12, 0], filter: ['blur(3px)', 'blur(0px)'], duration: 500, ease: 'outQuad' },
    [],
  );

  return (
    <section className='mb-16' ref={ref}>
      <div className='mb-6 flex items-center gap-2'>
        <i className={`bi ${icon} text-xl`} style={{ color: 'var(--accent)' }} aria-hidden='true' />
        <h2 className='font-serif text-2xl font-bold tracking-tight' style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}>
          {title}
        </h2>
      </div>
      <div className='flex flex-col gap-4'>{children}</div>
    </section>
  );
}

function TimelineItem({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className='timeline-item surface surface-hover rounded-2xl p-5'>
      <p className='mb-1 text-xs font-bold uppercase tracking-[0.3em]' style={{ color: 'var(--accent)' }}>
        {year}
      </p>
      <h3 className='font-serif mb-2 text-lg font-semibold' style={{ color: 'var(--fg)' }}>{title}</h3>
      <p className='text-sm leading-relaxed' style={{ color: 'var(--muted)' }}>{description}</p>
    </div>
  );
}

function InfoChip({ icon, label, accent }: { icon: string; label: string; accent?: boolean }) {
  return (
    <span
      className='badge-interactive inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium'
      style={{
        background: accent ? 'color-mix(in srgb, #22c55e 12%, transparent)' : 'var(--bg)',
        color: accent ? '#22c55e' : 'var(--muted)',
        border: `1px solid ${accent ? 'color-mix(in srgb, #22c55e 30%, transparent)' : 'var(--border)'}`,
      }}
    >
      <i className={`bi ${icon} text-xs`} aria-hidden='true' />
      {label}
    </span>
  );
}
