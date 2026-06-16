'use client';

import { useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

const COPY_STATES: Record<CopyState, { label: string; icon: string; bg: string; border: string; color: string }> = {
  idle:   { label: 'Copy Link',            icon: 'bi-link-45deg',         bg: 'var(--bg)',   border: 'var(--border)', color: 'var(--muted)' },
  copied: { label: 'Copied!',              icon: 'bi-check2',             bg: 'color-mix(in srgb, #22c55e 12%, transparent)', border: 'color-mix(in srgb, #22c55e 30%, transparent)', color: '#22c55e' },
  error:  { label: 'Failed. try manually', icon: 'bi-exclamation-circle', bg: 'color-mix(in srgb, #f43f5e 12%, transparent)', border: 'color-mix(in srgb, #f43f5e 30%, transparent)', color: '#f43f5e' },
};

const SHARE_LINKS = (title: string, url: string) => [
  { label: 'Share on Twitter / X', icon: 'bi-twitter-x', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
  { label: 'Share on LinkedIn',    icon: 'bi-linkedin',  href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
];

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  try {
    const ta = Object.assign(document.createElement('textarea'), {
      value: text,
      style: { cssText: 'position:fixed;opacity:0' },
    });
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const state = COPY_STATES[copyState];

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    const next: CopyState = ok ? 'copied' : 'error';
    setCopyState(next);
    setTimeout(() => setCopyState('idle'), next === 'copied' ? 2000 : 3000);
  };

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {SHARE_LINKS(title, url).map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          target='_blank'
          rel='noopener noreferrer'
          className='social-hover flex h-9 w-9 items-center justify-center rounded-[10px] border'
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <i className={`bi ${s.icon} social-icon relative z-10 text-sm`} aria-hidden='true' />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label={state.label}
        className='flex h-9 items-center gap-2 rounded-[10px] border px-3 text-sm font-medium transition-all duration-200'
        style={{ background: state.bg, border: `1px solid ${state.border}`, color: state.color }}
      >
        <i className={`bi ${state.icon} text-sm`} aria-hidden='true' />
        {state.label}
      </button>
    </div>
  );
}
