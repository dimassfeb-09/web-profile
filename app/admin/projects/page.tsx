import React from 'react';
import { ProjectService } from '@/src/services/project.service';
import ProjectClient from './ProjectClient';
import SortFilter from '@/src/components/common/SortFilter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Management | Admin',
};

export default async function ProjectManagementPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  // Fetch data directly from the service (Server-side)
  const response = await ProjectService.getAllProjects(true, sort);
  
  // Map data to ensure serializable types and fix TypeScript 'id: undefined' warnings
  const mappedData = response.data.map(project => ({
    id: project.id || '',
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    features: project.features,
    link_url: project.link_url,
    link_text: project.link_text,
    created_at: project.created_at,
    slug: project.slug || '',
    long_description: project.long_description || '',
    tech_stack: project.tech_stack || [],
    screenshots: project.screenshots || [],
    status: project.status || 'completed',
    date: project.date || '',
    external_links: project.external_links || {}
  }));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SortFilter />
      </div>
      <ProjectClient initialData={mappedData} />
    </div>
  );
}
