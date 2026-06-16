import type { Metadata } from 'next';
import { AboutView } from './view';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Ringga — student, developer, and builder.',
};

export default function AboutPage() {
  return <AboutView />;
}
