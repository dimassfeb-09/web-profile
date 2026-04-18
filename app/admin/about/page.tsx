'use client';

import React, { useState, useEffect } from 'react';

const AboutManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    paragraphs: '' // UI as newline separated
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch('/api/admin/about');
        const json = await res.json();
        if (json.status === 200) {
          setFormData({
            headline: json.data.headline,
            paragraphs: json.data.paragraphs.join('\n\n')
          });
        }
      } catch (err) {
        console.error('Failed to fetch about data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    const payload = {
      headline: formData.headline,
      paragraphs: formData.paragraphs.split('\n\n').map(p => p.trim()).filter(p => p !== '')
    };

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to update about section');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-64 bg-surface-container-low rounded-3xl animate-pulse"></div>;

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">About Section</h1>
        <p className="font-body text-on-surface-variant">Manage the narrative of your professional personality and background.</p>
      </div>

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
};

export default AboutManagement;
