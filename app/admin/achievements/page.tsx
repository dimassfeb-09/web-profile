import React from 'react';
import { AchievementService } from '@/src/services/achievement.service';
import AchievementClient from './AchievementClient';
import SortFilter from '@/src/components/common/SortFilter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Achievement Management | Admin',
};

export default async function AchievementManagementPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  // Fetch data directly from the service (Server-side)
  const response = await AchievementService.getAllAchievements(true, sort);
  
  // Map data to ensure serializable types and fix TypeScript 'undefined' warnings
  const mappedData = response.data.map(ach => ({
    id: ach.id || '',
    title: ach.title,
    description: ach.description,
    image_url: ach.image_url,
    date: ach.date ? (ach.date instanceof Date ? ach.date.toISOString() : ach.date) : null
  }));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SortFilter />
      </div>
      <AchievementClient initialData={mappedData} />
    </div>
  );
}
