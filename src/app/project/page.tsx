import type { Metadata } from 'next';
import { getAllProjects, getProjectCategories } from '@/lib/content';
import { PageHeader } from '@/components/ui/heading';
import { ContentGrid } from '@/components/ui/grid';
import { PageShell } from '@/components/layout/page-shell';

export const metadata: Metadata = {
  title: 'Projects',
  description: "A collection of things I've built — side projects, experiments, and open source work.",
};

export default function ProjectsPage() {
  const projects   = getAllProjects();
  const categories = getProjectCategories();
  return (
    <PageShell>
      <PageHeader
        eyebrow='Work'
        title='Projects'
        description="Things I've built — from experiments to production apps."
      />
      <ContentGrid
        items={projects}
        categories={categories}
        baseRoute='/project/'
        layout='grid'
        searchTechStack
        searchPlaceholder='Search projects…'
        emptyLabel='No projects found'
        emptyHint='Try a different search term, category, or tech'
      />
    </PageShell>
  );
}
