import type { Metadata } from 'next';
import { getAllProjects, getProjectCategories } from '@/lib/content';
import { ProjectGrid } from './ProjectGrid';

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of things I have built. side projects, experiments, and open source work.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getProjectCategories();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--accent)' }}
        >
          Work
        </p>
        <h1
          className="font-serif mb-3 text-4xl font-bold tracking-tight"
          style={{ color: 'var(--fg)', letterSpacing: '-0.02em' }}
        >
          Projects
        </h1>
        <p className="text-base" style={{ color: 'var(--muted)' }}>
          Things I&apos;ve built from experiments to production apps.
        </p>
      </div>

      <ProjectGrid projects={projects} categories={categories} />
    </div>
  );
}
