'use client';

import React, { useState, useEffect } from 'react';

const ContactManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    email: '',
    linkedin_url: ''
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await fetch('/api/admin/contact');
        const json = await res.json();
        if (json.status === 200) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch contact data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to update contact section');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-64 bg-surface-container-low rounded-3xl animate-pulse"></div>;

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">Contact Details</h1>
        <p className="font-body text-on-surface-variant">Manage how visitors can reach out to you professionally.</p>
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
          <label className="font-label text-sm text-on-surface-variant ml-1">Footer Description</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
            <label className="font-label text-sm text-on-surface-variant ml-1">Public Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label text-sm text-on-surface-variant ml-1">LinkedIn Profile URL</label>
            <input
              type="url"
              required
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
            />
          </div>
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
              Contact information updated!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactManagement;
