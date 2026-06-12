'use client';

import { useEffect } from 'react';
import { trackProjectView } from '@/src/components/analytics/GA4Tracker';

interface ProjectTrackerProps {
  title: string;
  slug: string;
}

export default function ProjectTracker({ title, slug }: ProjectTrackerProps) {
  useEffect(() => {
    trackProjectView(title, slug);
  }, [title, slug]);

  return null;
}
