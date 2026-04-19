import React from 'react';
import { AboutService } from '@/src/services/about.service';
import AboutClient from './AboutClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Management | Admin',
};

export default async function AboutManagementPage() {
  const response = await AboutService.getAboutData(true);
  const data = response.data || { headline: '', paragraphs: [] };

  return <AboutClient initialData={data} />;
}
