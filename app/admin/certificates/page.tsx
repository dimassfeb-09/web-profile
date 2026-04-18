'use client';

import React, { useState, useEffect } from 'react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image_url: string;
}

interface CertificateFormData {
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  image_url: string;
}

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CertificateFormData>({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    image_url: ''
  });

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/certificates');
      const json = await res.json();
      if (json.status === 200) {
        setCertificates(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleEdit = (cert: Certificate) => {
    setEditingCertificate(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issue_date || '',
      credential_url: cert.credential_url || '',
      image_url: cert.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 200) {
        setCertificates(certificates.filter(c => c.id !== id));
      } else {
        alert(json.message || 'Failed to delete certificate');
      }
    } catch (err) {
      alert('Failed to delete certificate');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = editingCertificate 
        ? `/api/admin/certificates/${editingCertificate.id}` 
        : '/api/admin/certificates';
      const method = editingCertificate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const resJson = await res.json();
      if (resJson.status === 200 || resJson.status === 201) {
        setIsModalOpen(false);
        fetchCertificates();
        setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', image_url: '' });
        setEditingCertificate(null);
      } else {
        throw new Error(resJson.message || 'Failed to save certificate');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Manage Certificates</h1>
          <p className="font-body text-on-surface-variant">Keep your professional credentials up to date.</p>
        </div>
        <button
          onClick={() => { 
            setEditingCertificate(null); 
            setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', image_url: '' });
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 transition-all font-body text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Certificate
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-surface-container-low rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between group">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-xl">workspace_premium</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-on-surface">{cert.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant">
                    {cert.issuer} • <span className="opacity-80">{cert.issue_date}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => handleEdit(cert)}
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-2 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
          {certificates.length === 0 && (
            <div className="py-20 text-center bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/20">
              <p className="font-body text-on-surface-variant">No certificates added yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-surface rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="font-headline text-xl font-bold">{editingCertificate ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-2">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70dvh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Issuer</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Issue Date (e.g. Mar 2024)</label>
                  <input
                    type="text"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Credential URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Certificate Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 rounded-xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    editingCertificate ? 'Update Certificate' : 'Add Certificate'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;
