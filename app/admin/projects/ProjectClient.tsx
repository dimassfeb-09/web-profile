'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import ImageUploader from '@/src/components/admin/ui/ImageUploader';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/src/actions/project.actions';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
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
    link_text: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      features: project.features.length > 0 ? [...project.features] : [''],
      link_url: project.link_url,
      link_text: project.link_text
    });
    setSelectedFile(null);
    setIsModalOpen(true);
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

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeatureRow = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureRow = (index: number) => {
    if (formData.features.length === 1) {
      setFormData({ ...formData, features: [''] });
      return;
    }
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updatedFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalImageUrl = formData.image_url;

    try {
      // 1. If a new file is selected, upload it first using existing endpoint
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

      // 2. Submit Project Data via Server Action
      const payload = {
        ...formData,
        image_url: finalImageUrl,
        features: formData.features.map(f => f.trim()).filter(f => f !== '')
      };

      let result;
      if (editingProject) {
        result = await updateProjectAction(editingProject.id, payload);
      } else {
        result = await createProjectAction(payload);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', image_url: '', features: [''], link_url: '', link_text: '' });
        setSelectedFile(null);
        setEditingProject(null);
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
          setEditingProject(null);
          setFormData({ title: '', description: '', image_url: '', features: [''], link_url: '', link_text: '' });
          setSelectedFile(null);
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
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{project.title}</h3>
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
            
            <ImageUploader 
              value={formData.image_url}
              onChange={(file) => setSelectedFile(file)}
              onClear={() => setFormData({ ...formData, image_url: '' })}
              label="Project Image"
              maxSizeMB={2}
            />
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

          <div className="space-y-3">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Features List</label>
            <div className="space-y-3">
               {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 group animate-fade-in">
                     <div className="relative flex-grow">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                        />
                     </div>
                     <button
                       type="button"
                       onClick={() => removeFeatureRow(index)}
                       className="p-3 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 transition-all flex items-center justify-center"
                     >
                       <span className="material-symbols-outlined text-xl">delete</span>
                     </button>
                  </div>
               ))}
            </div>
            <button
              type="button"
              onClick={addFeatureRow}
              className="w-full py-3 mt-2 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-label text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Add Feature
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Link URL</label>
              <input
                type="text"
                required
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Link Text</label>
              <input
                type="text"
                required
                value={formData.link_text}
                onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
            >
              {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
