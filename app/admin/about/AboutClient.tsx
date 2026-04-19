'use client';

import React, { useState } from 'react';
import { updateAboutAction } from '@/src/actions/about.actions';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';

interface AboutData {
  headline: string;
  paragraphs: string[];
}

interface AboutClientProps {
  initialData: AboutData;
}

export default function AboutClient({ initialData }: AboutClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    headline: initialData.headline,
    paragraphs: initialData.paragraphs.join('\n\n')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    const payload = {
      headline: formData.headline,
      paragraphs: formData.paragraphs.split('\n\n').map(p => p.trim()).filter(p => p !== '')
    };

    try {
      const result = await updateAboutAction(payload);
      if (result.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.message || 'Failed to update about section');
      }
    } catch (err) {
      alert('Failed to update about section');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <AdminHeader 
        title="About Section" 
        description="Manage the narrative of your professional personality and background."
      />

      <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
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
          <label className="font-label text-sm text-on-surface-variant ml-1">Paragraphs (Separate paragraphs with a double newline)</label>
          <textarea
            required
            rows={12}
            value={formData.paragraphs}
            onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
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
              About data saved successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
