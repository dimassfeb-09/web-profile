'use client';

import React, { useState, useEffect } from 'react';

const HomeManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    badge_text: '',
    headline: '',
    subheadline: '',
    description: '',
    cv_url: ''
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/admin/home');
        const json = await res.json();
        if (json.status === 200) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to update home section');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-64 bg-surface-container-low rounded-3xl animate-pulse"></div>;

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Home Section</h1>
        <p className="font-body text-on-surface-variant">Update the primary headline, subheadline, and CV download link of your portfolio.</p>
      </div>

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
            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm resize-none"
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
};

export default HomeManagement;
