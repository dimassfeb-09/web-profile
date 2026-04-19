'use server';

import { ProjectService } from '@/src/services/project.service';
import { revalidateTag } from 'next/cache';

export async function createProjectAction(data: {
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
}) {
  try {
    const result = await ProjectService.createProject(data);
    revalidateTag('projects', { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return { status: 500, message };
  }
}

export async function updateProjectAction(id: string, data: Partial<{
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
}>) {
  try {
    const result = await ProjectService.updateProject(id, data);
    revalidateTag('projects', { expire: 0 });
    revalidateTag(`project_${id}`, { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return { status: 500, message };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const result = await ProjectService.deleteProject(id);
    revalidateTag('projects', { expire: 0 });
    revalidateTag(`project_${id}`, { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return { status: 500, message };
  }
}
