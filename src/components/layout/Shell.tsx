'use client';

import { usePathname } from 'next/navigation';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

export default function Shell({ 
  children,
  cvUrl,
  contactData,
  navLinks
}: { 
  children: React.ReactNode;
  cvUrl: string;
  contactData?: Partial<{
    linkedin_url: string;
    github_url: string;
    instagram_url: string;
    twitter_url: string;
    email: string;
    headline: string;
    description: string;
  }> | null;
  navLinks?: { name: string; href: string }[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <TopNavBar cvUrl={cvUrl} navLinks={navLinks} />}
      {children}
      {!isAdmin && <Footer data={contactData || undefined} />}
    </>
  );
}
