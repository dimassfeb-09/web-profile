'use client';

import React from 'react';

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
  <div className="bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div>
      <p className="text-on-surface-variant font-label text-sm mb-1">{title}</p>
      <p className="text-on-surface font-headline text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Dashboard Overview</h1>
        <p className="font-body text-on-surface-variant">Welcome to your portfolio management panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <StatCard 
          title="Total Projects" 
          value="8" 
          icon="folder_open" 
          color="bg-primary" 
        />
        <StatCard 
          title="Work Experience" 
          value="9 Items" 
          icon="work" 
          color="bg-secondary" 
        />
        <StatCard 
          title="Skills Listed" 
          value="15" 
          icon="psychology" 
          color="bg-tertiary" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             {['Add Project', 'Update Status', 'Edit Profile', 'Manage Skills'].map((action) => (
               <button key={action} className="p-4 rounded-2xl bg-surface-container-high border border-outline-variant/5 text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all text-left">
                 {action}
               </button>
             ))}
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">System Status</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high/50 border border-outline-variant/5">
                <span className="font-body text-sm text-on-surface">PostgreSQL Database</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-label text-[10px] font-bold uppercase tracking-wider">Connected</span>
             </div>
             <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high/50 border border-outline-variant/5">
                <span className="font-body text-sm text-on-surface">In-Memory Cache</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-label text-[10px] font-bold uppercase tracking-wider">Active</span>
             </div>
             <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high/50 border border-outline-variant/5">
                <span className="font-body text-sm text-on-surface">Supabase Storage</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-label text-[10px] font-bold uppercase tracking-wider">Verified</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
