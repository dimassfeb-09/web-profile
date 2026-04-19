'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import ImageUploader from '@/src/components/admin/ui/ImageUploader';
import { createCertificateAction, updateCertificateAction, deleteCertificateAction } from '@/src/actions/certificate.actions';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
  description?: string;
}

interface CertificateClientProps {
  initialData: Certificate[];
}

export default function CertificateClient({ initialData }: CertificateClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    image_url: '',
    description: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: formatDateForInput(cert.issue_date),
      credential_url: cert.credential_url || '',
      image_url: cert.image_url || '',
      description: cert.description || '',
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    setIsLoading(true);
    try {
      const result = await deleteCertificateAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to delete certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImageUrl = formData.image_url;

    try {
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok) {
          finalImageUrl = uploadJson.data.url;
        } else {
          throw new Error(uploadJson.message || 'Image upload failed');
        }
      }

      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        credential_url: formData.credential_url || null,
        image_url: finalImageUrl || null,
        description: formData.description
      };

      let result;
      if (editingCert) {
        result = await updateCertificateAction(editingCert.id, payload);
      } else {
        result = await createCertificateAction(payload);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', image_url: '', description: '' });
        setSelectedFile(null);
        setEditingCert(null);
        router.refresh();
      } else {
        throw new Error(result.message || 'Failed to save certificate');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Certificates" 
        description="Manage your professional certifications and licenses."
        buttonLabel="Add Certificate"
        onButtonClick={() => {
          setEditingCert(null);
          setFormData({ title: '', issuer: '', issue_date: '', credential_url: '', image_url: '', description: '' });
          setSelectedFile(null);
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.map((cert) => (
          <div key={cert.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group">
            <div className="aspect-[4/3] w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden relative">
              {cert.image_url ? (
                 <Image 
                   src={cert.image_url} 
                   alt={cert.title} 
                   fill 
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-cover" 
                 />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                   <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                 </div>
              )}
            </div>
            
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">{cert.title}</h3>
            <p className="font-label text-sm text-primary font-semibold mb-2">{cert.issuer}</p>
            <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-6 flex-grow">{cert.description}</p>
            
            <div className="flex items-center gap-3">
              <button
                disabled={isLoading}
                onClick={() => handleEdit(cert)}
                className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(cert.id)}
                className="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add Certificate'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Certificate Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Issuer</label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <ImageUploader 
            value={formData.image_url}
            onChange={(file) => setSelectedFile(file)}
            onClear={() => setFormData({ ...formData, image_url: '' })}
            label="Certificate Proof (Image)"
            maxSizeMB={2}
            aspectRatio="aspect-[4/3]"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Issue Date</label>
              <input
                type="date"
                required
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Credential URL (Optional)</label>
              <input
                type="text"
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
            >
              {isLoading ? 'Saving...' : editingCert ? 'Update Certificate' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
