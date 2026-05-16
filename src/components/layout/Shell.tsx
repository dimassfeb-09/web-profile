'use client';

import { usePathname } from 'next/navigation';

export default function Shell({ 
  children
}: { 
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className={!isAdmin ? "pb-24 lg:pb-0" : ""}>
      {children}
    </div>
  );
}
