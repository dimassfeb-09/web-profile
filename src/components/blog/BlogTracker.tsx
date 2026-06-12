'use client';

import { useEffect } from 'react';
import { trackBlogRead } from '@/src/components/analytics/GA4Tracker';

interface BlogTrackerProps {
  title: string;
  slug: string;
}

export default function BlogTracker({ title, slug }: BlogTrackerProps) {
  useEffect(() => {
    trackBlogRead(title, slug);
  }, [title, slug]);

  return null;
}
