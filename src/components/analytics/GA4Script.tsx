'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { trackPageView } from './GA4Tracker';

export default function GA4Script() {
  const pathname = usePathname();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  // Validate GA4 Measurement ID format (starts with G- followed by at least one alphanumeric character)
  const isValid = !!measurementId && /^G-[a-zA-Z0-9]+$/.test(measurementId);

  useEffect(() => {
    if (isValid) {
      trackPageView(pathname);
    }
  }, [pathname, isValid]);

  if (!isValid) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-inline-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
