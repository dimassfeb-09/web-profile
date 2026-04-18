'use client';

import { usePathname } from 'next/navigation';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <TopNavBar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
