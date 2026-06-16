import type { Metadata } from 'next';
import { siteConfig, activeSocial, hasValidEmail } from '@/config/site';
import { PageHeader } from '@/components/ui/heading';
import { SocialLinks } from '@/components/ui/social';
import { ContactForm } from './form';
import { PageShell } from '@/components/layout/page-shell';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch — let's work on something great together.",
};

export default function ContactPage() {
  const hasEmail = hasValidEmail(siteConfig.profile.email);
  const hasSocial = activeSocial.length > 0;

  return (
    <PageShell>
      <PageHeader
        eyebrow='Contact'
        title='Say Hello 👋'
        description={
          hasSocial
            ? 'Have a project, question, or just want to chat? Reach out via the form or find me on social media.'
            : "Have a project, question, or just want to chat? I'd love to hear from you."
        }
      />

      <div className='grid gap-8 sm:grid-cols-5'>
        {hasSocial && (
          <aside className='sm:col-span-2' aria-label='Social media links'>
            <div className='surface rounded-2xl p-6'>
              <h2 className='font-serif mb-4 text-lg font-semibold' style={{ color: 'var(--fg)' }}>
                Find Me Online
              </h2>
              <SocialLinks links={activeSocial} variant='card' />
            </div>
          </aside>
        )}

        {hasEmail && (
          <div className={hasSocial ? 'sm:col-span-3' : 'sm:col-span-5'}>
            <div className='surface rounded-2xl p-6'>
              <h2 className='font-serif mb-5 text-lg font-semibold' style={{ color: 'var(--fg)' }}>
                Send a Message
              </h2>
              <ContactForm recipientEmail={siteConfig.profile.email!} />
            </div>
          </div>
        )}

        {!hasEmail && !hasSocial && (
          <div className='sm:col-span-5'>
            <div className='surface rounded-2xl p-6 text-center'>
              <p className='text-sm' style={{ color: 'var(--muted)' }}>Contact information is not yet available.</p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
