import React from 'react';
import { HomeService } from '@/src/services/home.service';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Home Section Management | Admin',
};

export default async function HomeManagementPage() {
  // Fetch data directly from the service (Server-side)
  const response = await HomeService.getHomeData(true);
  
  // Provide empty object as fallback if data is missing, although service should handle it
  const data = response.data || {
    badge_text: '',
    headline: '',
    subheadline: '',
    description: '',
    cv_url: ''
  };

  return <HomeClient initialData={data} />;
}
