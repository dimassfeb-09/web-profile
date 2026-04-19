import React from 'react';
import { AchievementService } from '@/src/services/achievement.service';
import AchievementClient from './AchievementClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Achievement Management | Admin',
};

export default async function AchievementManagementPage() {
  // Fetch data directly from the service (Server-side)
  const response = await AchievementService.getAllAchievements(true);
  
  // Map data to ensure serializable types and fix TypeScript 'undefined' warnings
  const mappedData = response.data.map(ach => ({
    id: ach.id || '',
    title: ach.title,
    description: ach.description,
    image_url: ach.image_url,
    date: ach.date ? (ach.date instanceof Date ? ach.date.toISOString() : ach.date) : null
  }));
  
  return <AchievementClient initialData={mappedData} />;
}
