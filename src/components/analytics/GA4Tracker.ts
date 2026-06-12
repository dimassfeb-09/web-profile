'use client';

// Declare gtag on window for TS safety
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Sends a page_view event to Google Analytics.
 */
export function trackPageView(pathname: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pathname,
    });
  }
}

/**
 * Sends a blog_read event when a visitor views a blog post.
 */
export function trackBlogRead(title: string, slug: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'blog_read', {
      blog_title: title,
      blog_slug: slug,
    });
  }
}

/**
 * Sends a project_view event when a visitor views a project detail page.
 */
export function trackProjectView(title: string, slug: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'project_view', {
      project_title: title,
      project_slug: slug,
    });
  }
}

/**
 * Sends a contact_submit event when the contact form is submitted successfully.
 */
export function trackContactSubmit() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'contact_submit', {
      form_location: 'contact_page',
    });
  }
}
