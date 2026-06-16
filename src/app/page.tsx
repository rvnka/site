import Image from 'next/image';
import { siteConfig, activeSocial } from '@/config/site';
import { getFeaturedProjects, getLatestPosts } from '@/lib/content';
import { PageShell } from '@/components/layout/page-shell';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';
import { SocialLinks } from '@/components/ui/social';
import { SectionHeading } from '@/components/ui/heading';
import { TypeWriter } from '@/components/ui/typewriter';

export default function HomePage() {
  const pinnedProjects = getFeaturedProjects();
  const latestPosts    = getLatestPosts(3);

  return (
    <PageShell top='py-12'>

      {/* ── Hero / Profile ───────────────────────────────────── */}
      <section className='anim pb-16 pt-12 text-center' aria-label='Profile'>
        <div className='avatar-wrapper relative mx-auto mb-7 h-28 w-28'>
          <div className='avatar-ring absolute inset-[-5px] rounded-full' aria-hidden='true' />
          <Image
            src={siteConfig.profile.avatar}
            alt={siteConfig.profile.name}
            width={112} height={112}
            priority
            className='relative z-10 block h-28 w-28 rounded-full border-2 object-cover shadow-md transition-all duration-300 hover:scale-[1.04]'
            style={{ borderColor: 'var(--border)' }}
          />
          {siteConfig.profile.available && (
            <span
              className='status-dot absolute bottom-1.5 right-1.5 z-20 h-3.5 w-3.5 rounded-full border-2'
              style={{ background: '#22c55e', borderColor: 'var(--bg)' }}
              title='Available for work'
              aria-label='Available for work'
            />
          )}
        </div>

        <h1
          className='font-serif mb-1 text-4xl font-bold'
          style={{ letterSpacing: '-0.02em', color: 'var(--fg)' }}
        >
          {siteConfig.profile.name}
        </h1>
        <p className='mb-3 text-base font-medium' style={{ color: 'var(--muted)' }}>
          {siteConfig.profile.username}
        </p>
        <p className='mb-5 text-lg font-medium' style={{ color: 'var(--muted)' }}>
          <TypeWriter words={siteConfig.roles} />
        </p>
        <p className='mx-auto mb-8 max-w-lg text-base leading-7' style={{ color: 'var(--muted)' }}>
          {siteConfig.profile.bio}
        </p>

        {activeSocial.length > 0 && <SocialLinks links={activeSocial} />}

        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Btn href='/project' variant='primary' icon='bi-grid'>View Projects</Btn>
          <Btn href='/contact' variant='outline' icon='bi-send'>Get In Touch</Btn>
        </div>
      </section>

      {/* ── Main Content: sections stagger in ────────────────── */}
      <div className='anim-sections'>

        {/* Tech Stack */}
        <section className='mb-16' aria-label='Tech Stack'>
          <SectionHeading eyebrow="Skills" title="Tech Stack" description="Tools and technologies I work with" />
          <div className='anim-stagger mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {siteConfig.skills.map((skill) => (
              <div
                key={skill.name}
                className='flex items-center gap-3 rounded-[14px] border p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md'
                style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
              >
                <i className={`bi ${skill.icon} text-xl`} style={{ color: skill.color }} aria-hidden='true' />
                <span className='text-sm font-medium' style={{ color: 'var(--fg)' }}>{skill.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        {pinnedProjects.length > 0 && (
          <section className='mb-16' aria-label='Featured Projects'>
            <SectionHeading
              eyebrow='Work'
              title='Featured Projects'
              description="Things I've built that I'm proud of"
              action={{ label: 'All Projects', href: '/project' }}
            />
            <div className='anim-stagger mt-6 grid gap-5 sm:grid-cols-2'>
              {pinnedProjects.map((project) => (
                <Card key={project.slug} item={project} href={`/project/${project.slug}`} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Articles */}
        {latestPosts.length > 0 && (
          <section className='mb-16' aria-label='Latest Articles'>
            <SectionHeading
              eyebrow='Writing'
              title='Latest Articles'
              description='Thoughts, tutorials, and dev diaries'
              action={{ label: 'All Posts', href: '/blog' }}
            />
            <div className='anim-stagger mt-6 flex flex-col gap-3'>
              {latestPosts.map((post) => (
                <Card key={post.slug} item={post} href={`/blog/${post.slug}`} layout='compact' />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className='anim-scale mb-20 rounded-[14px] border p-8 text-center'
          aria-label='Contact call to action'
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 1px 3px var(--shadow)' }}
        >
          <i className='bi bi-chat-heart mb-4 block text-4xl' style={{ color: 'var(--accent)' }} aria-hidden='true' />
          <h2 className='font-serif mb-2 text-2xl font-bold' style={{ color: 'var(--fg)' }}>
            Let&apos;s Work Together
          </h2>
          <p className='mx-auto mb-6 max-w-sm text-sm leading-relaxed' style={{ color: 'var(--muted)' }}>
            Have a project in mind? Reach out through the contact page or any of the social links above.
          </p>
          <Btn href='/contact' variant='primary' size='lg' icon='bi-send'>Say Hello</Btn>
        </section>

      </div>
    </PageShell>
  );
}
