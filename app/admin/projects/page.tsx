import React from 'react';
import { ProjectService } from '@/src/services/project.service';
import ProjectClient from './ProjectClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Management | Admin',
};

export default async function ProjectManagementPage() {
  // Fetch data directly from the service (Server-side)
  const response = await ProjectService.getAllProjects(true);
  
  // Map data to ensure serializable types and fix TypeScript 'id: undefined' warnings
  const mappedData = response.data.map(project => ({
    id: project.id || '',
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    features: project.features,
    link_url: project.link_url,
    link_text: project.link_text
  }));
  
  return <ProjectClient initialData={mappedData} />;
}
