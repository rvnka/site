'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error boundary]', error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <p
        className="font-serif mb-2 text-8xl font-bold"
        style={{
          color:         'var(--accent)',
          letterSpacing: '-0.04em',
          opacity:       0.3,
        }}
        aria-hidden="true"
      >
        500
      </p>

      <h1
        className="font-serif mb-3 text-3xl font-bold tracking-tight"
        style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}
      >
        Something Went Wrong
      </h1>

      <p
        className="mb-8 max-w-xs text-base"
        style={{ color: 'var(--muted)' }}
      >
        An unexpected error occurred. You can try again or head back home.
      </p>

      {error.digest && (
        <p
          className="mb-8 font-mono text-xs"
          style={{ color: 'var(--faint)' }}
        >
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex gap-3">
        <Button onClick={reset} variant="primary" icon="bi-arrow-clockwise">
          Try Again
        </Button>
        <Button href="/" variant="outline" icon="bi-house">
          Go Home
        </Button>
      </div>
    </div>
  );
}
