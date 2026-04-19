'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import ImageUploader from '@/src/components/admin/ui/ImageUploader';
import ScreenshotUploader from '@/src/components/admin/ui/ScreenshotUploader';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/src/actions/project.actions';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
  slug?: string;
  long_description?: string | null;
  tech_stack?: string[];
  screenshots?: string[];
  status?: string;
  date?: string | Date | null;
  external_links?: Record<string, string> | null;
}

interface ProjectClientProps {
  initialData: Project[];
}

export default function ProjectClient({ initialData }: ProjectClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    features: [''],
    link_url: '',
    link_text: '',
    slug: '',
    long_description: '',
    tech_stack: '',
    screenshots: [] as string[],
    status: 'completed',
    date: '',
    // External links as array of objects for editing convenience, converted to Record on submit
    external_links: [{ label: '', url: '' }]
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);

  const formatDateForInput = (dateStr: string | Date | undefined | null) => {
    if (!dateStr) return '';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);

    // Convert Record<string, string> to [{label, url}]
    const linksArray = project.external_links 
      ? Object.entries(project.external_links).map(([label, url]) => ({ label, url }))
      : [{ label: '', url: '' }];

    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      features: project.features.length > 0 ? [...project.features] : [''],
      link_url: project.link_url,
      link_text: project.link_text,
      slug: project.slug || '',
      long_description: project.long_description || '',
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      screenshots: project.screenshots || [],
      status: project.status || 'completed',
      date: formatDateForInput(project.date),
      external_links: linksArray.length > 0 ? linksArray : [{ label: '', url: '' }]
    });
    setSelectedFile(null);
    setScreenshotFiles([]);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      features: [''],
      link_url: '',
      link_text: '',
      slug: '',
      long_description: '',
      tech_stack: '',
      screenshots: [],
      status: 'completed',
      date: '',
      external_links: [{ label: '', url: '' }]
    });
    setSelectedFile(null);
    setScreenshotFiles([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setIsLoading(true);
    try {
      const result = await deleteProjectAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  // Row helpers for dynamic arrays
  const handleRowChange = (field: 'features' | 'screenshots', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addRow = (field: 'features' | 'screenshots') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeRow = (field: 'features' | 'screenshots', index: number) => {
    if (formData[field].length === 1) {
      setFormData({ ...formData, [field]: [''] });
      return;
    }
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  // External Link helpers
  const handleLinkChange = (index: number, key: 'label' | 'url', value: string) => {
    const updated = [...formData.external_links];
    updated[index][key] = value;
    setFormData({ ...formData, external_links: updated });
  };

  const addLinkRow = () => {
    setFormData({ ...formData, external_links: [...formData.external_links, { label: '', url: '' }] });
  };

  const removeLinkRow = (index: number) => {
    if (formData.external_links.length === 1) {
      setFormData({ ...formData, external_links: [{ label: '', url: '' }] });
      return;
    }
    const updated = formData.external_links.filter((_, i) => i !== index);
    setFormData({ ...formData, external_links: updated });
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

      // Upload screenshots
      const uploadedScreenshotUrls: string[] = [];
      for (const file of screenshotFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload?bucket=project-screenshots', {
          method: 'POST',
          body: fd
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || 'Screenshot upload failed');
        }
        uploadedScreenshotUrls.push(json.data.url);
      }

      // Convert links array back to record
      const externalLinksRecord: Record<string, string> = {};
      formData.external_links.forEach(link => {
        if (link.label.trim() && link.url.trim()) {
          externalLinksRecord[link.label.trim()] = link.url.trim();
        }
      });

      const payload = {
        ...formData,
        image_url: finalImageUrl,
        features: formData.features.map(f => f.trim()).filter(f => f !== ''),
        tech_stack: formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        screenshots: [...formData.screenshots, ...uploadedScreenshotUrls].filter(Boolean),
        external_links: externalLinksRecord,
        date: formData.date || null
      };

      let result;
      if (editingProject) {
        result = await updateProjectAction(editingProject.id, payload);
      } else {
        result = await createProjectAction(payload);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        resetForm();
        router.refresh();
      } else {
        throw new Error(result.message || 'Failed to save project');
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
        title="Manage Projects" 
        description="Add, edit, or remove projects. Images are automatically optimized."
        buttonLabel="Add Project"
        onButtonClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {initialData.map((project) => (
          <div key={project.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group h-full">
            <div className="aspect-[1024/500] w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden relative">
              <Image 
                src={project.image_url} 
                alt={project.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105" 
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline text-lg font-bold text-on-surface">{project.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-tighter ${
                project.status?.toLowerCase() === 'completed' 
                  ? 'bg-green-100/50 text-green-700 border-green-200' 
                  : 'bg-amber-100/50 text-amber-700 border-amber-200'
              }`}>
                {project.status || 'completed'}
              </span>
            </div>
            <p className="font-body text-xs text-primary mb-2 opacity-70">slug: {project.slug || '-'}</p>
            <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{project.description}</p>
            
            <div className="flex items-center gap-3 mt-auto">
              <button
                disabled={isLoading}
                onClick={() => handleEdit(project)}
                className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(project.id)}
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
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        isLarge
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Project Slug (URL part)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. keuanganku"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                  />
                </div>
             </div>
            
            <ImageUploader 
              value={formData.image_url}
              onChange={(file) => setSelectedFile(file)}
              onClear={() => setFormData({ ...formData, image_url: '' })}
              label="Project Main Image"
              maxSizeMB={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              >
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Release/Project Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Short Description (Card)</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Long Description (Detail Page)</label>
            <textarea
              rows={5}
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar whitespace-pre-wrap"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Tech Stack (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Flutter, Dart, Supabase"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Features Section */}
             <div className="space-y-3">
                <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Features List</label>
                <div className="space-y-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 animate-fade-in group">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => handleRowChange('features', index, e.target.value)}
                            placeholder={`Feature ${index + 1}`}
                            className="flex-grow px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                          />
                          <button
                            type="button"
                            onClick={() => removeRow('features', index)}
                            className="p-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                      </div>
                    ))}
                </div>
                <div className="flex gap-2">
                   <button
                     type="button"
                     onClick={() => addRow('features')}
                     className="flex-grow py-2 border border-dashed border-outline-variant/30 rounded-xl text-subtle-on-surface hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-label text-[10px] font-semibold uppercase tracking-wider"
                   >
                     <span className="material-symbols-outlined text-sm">add_circle</span>
                     Add Feature
                   </button>
                   <div className="w-[44px] flex-shrink-0" />
                </div>
             </div>

             {/* Screenshots Section */}
             <ScreenshotUploader
               existingUrls={formData.screenshots}
               onFilesChange={setScreenshotFiles}
               onUrlsChange={(urls) => setFormData({ ...formData, screenshots: urls })}
               maxImages={8}
               maxSizeMB={3}
             />
          </div>

          <div className="space-y-3">
             <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Additional External Links</label>
             <div className="space-y-3">
                {formData.external_links.map((link, index) => (
                   <div key={index} className="flex items-center gap-2 animate-fade-in group">
                      <div className="flex-grow grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. GitHub)"
                          value={link.label}
                          onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                          className="px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLinkRow(index)}
                        className="p-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                   </div>
                ))}
             </div>
             <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addLinkRow}
                  className="flex-grow py-2.5 border border-dashed border-outline-variant/30 rounded-xl text-subtle-on-surface hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-label text-[10px] font-semibold uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add External Link
                </button>
                <div className="w-[44px] flex-shrink-0" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Primary CTA URL</label>
              <input
                type="text"
                required
                placeholder="Main project URL or Store link"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Primary CTA Text</label>
              <input
                type="text"
                required
                placeholder="e.g. Play Store"
                value={formData.link_text}
                onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
          >
            {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
