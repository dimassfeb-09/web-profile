'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  stats: {
    projects: number;
    experience: number;
    skills: number;
    blogs: number;
    achievements: number;
    certificates: number;
  };
}

const StatCard = ({ title, value, icon, color, href }: { title: string, value: string, icon: string, color: string, href: string }) => (
  <Link href={href} className="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden">
    {/* Background Glow */}
    <div className={`absolute -right-8 -top-8 w-24 h-24 ${color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
    
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="relative z-10">
      <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60 group-hover:text-primary transition-colors">{title}</p>
      <p className="text-on-surface font-headline text-3xl font-bold tracking-tight">{value}</p>
    </div>
  </Link>
);

export default function DashboardClient({ stats }: DashboardClientProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const quickActions = [
    { name: 'Add Project', icon: 'add_circle', href: '/admin/projects', color: 'text-primary' },
    { name: 'Write Blog', icon: 'edit_note', href: '/admin/blog/create', color: 'text-secondary' },
    { name: 'Add Experience', icon: 'work_history', href: '/admin/experience', color: 'text-tertiary' },
    { name: 'Update Skills', icon: 'psychology', href: '/admin/skills', color: 'text-error' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="font-body text-on-surface-variant opacity-80">Welcome back! Here's what's happening with your portfolio.</p>
        </div>
        <div className="flex items-center gap-4">
          {isMounted && (
            <p className="hidden sm:block text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-widest">
              Last Updated: {new Date().toLocaleTimeString()}
            </p>
          )}
          <button 
            onClick={() => router.refresh()} 
            className="p-3 rounded-2xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <StatCard 
          title="Total Projects" 
          value={stats.projects.toString()} 
          icon="folder_open" 
          color="bg-primary" 
          href="/admin/projects"
        />
        <StatCard 
          title="Blog Posts" 
          value={stats.blogs.toString()} 
          icon="article" 
          color="bg-secondary" 
          href="/admin/blog"
        />
        <StatCard 
          title="Experience Items" 
          value={stats.experience.toString()} 
          icon="work" 
          color="bg-tertiary" 
          href="/admin/experience"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">bolt</span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
             {quickActions.map((action) => (
               <Link 
                 key={action.name} 
                 href={action.href}
                 className="relative p-5 rounded-[1.5rem] bg-surface-container-high/50 border border-outline-variant/5 text-on-surface font-label text-sm font-bold hover:bg-surface-container-lowest hover:border-primary/30 hover:text-primary transition-all duration-300 flex flex-col gap-4 group overflow-hidden"
               >
                 {/* Decorative background element */}
                 <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-[3] transition-transform duration-700 ease-out" />
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1`}>
                      <span className={`material-symbols-outlined text-2xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                        {action.icon}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      arrow_forward
                    </span>
                 </div>
                 
                 <span className="relative z-10 tracking-tight">{action.name}</span>
               </Link>
             ))}
          </div>
        </div>

        {/* System Summary */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">analytics</span>
            Content Summary
          </h3>
          <div className="space-y-4">
             {[
               { label: 'Skills & Tech Stack', value: stats.skills, icon: 'psychology', color: 'bg-blue-500', href: '/admin/skills' },
               { label: 'Achievements & Awards', value: stats.achievements, icon: 'workspace_premium', color: 'bg-amber-500', href: '/admin/achievements' },
               { label: 'Professional Certificates', value: stats.certificates, icon: 'card_membership', color: 'bg-emerald-500', href: '/admin/certificates' },
             ].map((item) => (
               <Link 
                 key={item.label} 
                 href={item.href}
                 className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high/50 border border-outline-variant/5 group hover:bg-white hover:shadow-sm hover:border-primary/20 transition-all duration-300"
               >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <span className="font-body text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-lg text-on-surface">{item.value}</span>
                    <span className="material-symbols-outlined text-sm text-primary opacity-0 group-hover:opacity-100 transition-all">chevron_right</span>
                  </div>
               </Link>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
