'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Home', href: '/admin/home', icon: 'home' },
  { name: 'About', href: '/admin/about', icon: 'person' },
  { name: 'Skills', href: '/admin/skills', icon: 'psychology' },
  { name: 'Experience', href: '/admin/experience', icon: 'work' },
  { name: 'Projects', href: '/admin/projects', icon: 'folder_open' },
  { name: 'Achievements', href: '/admin/achievements', icon: 'workspace_premium' },
  { name: 'Certificates', href: '/admin/certificates', icon: 'card_membership' },
  { name: 'Contact', href: '/admin/contact', icon: 'mail' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoginPage) return <>{children}</>;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const NavLink = ({ item, isCollapsed = false, onClick }: { item: any; isCollapsed?: boolean; onClick?: () => void }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={onClick}
        title={isCollapsed ? item.name : ''}
        className={`flex items-center gap-4 rounded-2xl transition-all duration-200 group ${
          isCollapsed ? 'justify-center p-3.5' : 'px-4 py-3.5'
        } ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }`}
      >
        <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill-1' : ''}`}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <span className="font-label text-sm font-medium tracking-wide">
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-surface flex selection:bg-primary/10 transition-colors duration-300">
      
      {/* 1. Sidebar - Desktop (xl and above) */}
      <aside className="hidden xl:flex w-72 bg-surface-container-low border-r border-outline-variant/10 flex-col sticky top-0 h-screen shrink-0">
        <div className="p-8">
          <Link href="/" className="font-headline text-xl font-black tracking-tighter text-on-surface">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-grow px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
        <div className="p-6 border-t border-outline-variant/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-error hover:bg-error/10 transition-all font-label text-sm font-medium tracking-wide"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Sidebar - Mini / Tablet (md up to xl) */}
      <aside className="hidden md:flex xl:hidden w-20 bg-surface-container-low border-r border-outline-variant/10 flex-col sticky top-0 h-screen shrink-0">
        <div className="py-8 flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-headline font-black text-xs">A</div>
        </div>
        <nav className="flex-grow px-3 space-y-2 flex flex-col items-center overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed />
          ))}
        </nav>
        <div className="p-3 border-t border-outline-variant/10 flex justify-center">
          <button 
            onClick={handleLogout}
            className="p-3.5 rounded-2xl text-error hover:bg-error/10 transition-all"
            title="Logout"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-h-screen min-w-0 bg-surface">
        {/* Header */}
        <header className="h-20 lg:h-24 px-6 md:px-10 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/5">
          {/* Mobile Menu Button - below md */}
          <div className="md:hidden">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
               <span className="material-symbols-outlined text-2xl">menu</span>
             </button>
          </div>
          
          <div className="flex items-center gap-4">
            <h2 className="font-headline text-lg font-semibold text-on-surface truncate">
              {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-label font-bold text-on-surface">Admin</span>
                <span className="text-[10px] text-on-surface-variant font-body">df@dimassfeb.com</span>
             </div>
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-label font-bold text-xs ring-1 ring-primary/20">
                DF
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-grow p-6 md:p-10 lg:p-12">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* 3. Mobile Menu Overlay - Drawer (below md) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute top-0 bottom-0 left-0 w-72 bg-surface p-6 flex flex-col animate-slide-right shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-headline text-lg font-black tracking-tighter text-on-surface">Admin Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar pr-1">
               {menuItems.map((item) => (
                  <NavLink key={item.href} item={item} onClick={() => setIsMobileMenuOpen(false)} />
               ))}
            </nav>
            
            <div className="mt-auto pt-6 border-t border-outline-variant/10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-error hover:bg-error/10 transition-all font-label text-sm font-medium tracking-wide"
              >
                <span className="material-symbols-outlined text-2xl">logout</span>
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
