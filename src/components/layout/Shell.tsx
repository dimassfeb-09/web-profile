'use client';

import { usePathname } from 'next/navigation';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

export default function Shell({ 
  children,
  cvUrl
}: { 
  children: React.ReactNode;
  cvUrl: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <TopNavBar cvUrl={cvUrl} />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
