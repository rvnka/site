import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Real-time status of services and systems.',
};

import type { ReactNode } from 'react';

export default function StatusLayout({ children }: { children: ReactNode }) {
  return children;
}
