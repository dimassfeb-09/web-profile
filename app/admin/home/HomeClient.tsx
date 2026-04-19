'use client';

import React, { useState } from 'react';
import { updateHomeAction } from '@/src/actions/home.actions';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';

interface HomeData {
  badge_text: string;
  headline: string;
  subheadline: string;
  description: string;
  cv_url: string;
}

interface HomeClientProps {
  initialData: HomeData;
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<HomeData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const result = await updateHomeAction(formData);
      if (result.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.message || 'Failed to update home section');
      }
    } catch (err) {
      alert('Failed to update home section');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <AdminHeader 
        title="Home Section" 
        description="Update the primary headline, subheadline, and CV download link of your portfolio."
      />

      <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
            <label className="font-label text-sm text-on-surface-variant ml-1">Badge Text</label>
            <input
              type="text"
              required
              value={formData.badge_text}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm text-on-surface-variant ml-1">CV Download URL</label>
            <input
              type="text"
              required
              value={formData.cv_url}
              onChange={(e) => setFormData({ ...formData, cv_url: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-label text-sm text-on-surface-variant ml-1">Headline</label>
          <input
            type="text"
            required
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-headline font-semibold text-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label text-sm text-on-surface-variant ml-1">Subheadline</label>
          <input
            type="text"
            required
            value={formData.subheadline}
            onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-label text-sm text-on-surface-variant ml-1">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm resize-none custom-scrollbar"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-10 py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Save Changes'}
          </button>
          
          {success && (
            <div className="flex items-center gap-2 text-emerald-500 font-label text-sm animate-fade-in-up">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Changes saved successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
