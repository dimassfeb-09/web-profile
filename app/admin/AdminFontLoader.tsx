'use client';

import { useEffect } from 'react';

export default function AdminFontLoader() {
  useEffect(() => {
    // Dynamically insert the Google Fonts link for Material Symbols
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    document.head.appendChild(link);

    return () => {
      // Clean up on unmount (leaving admin area)
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
