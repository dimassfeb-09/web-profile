'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image_url: '',
    features: [''], // Initializing with one empty feature
    link_url: '',
    link_text: ''
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/projects');
      const json = await res.json();
      if (json.status === 200) {
        setProjects(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
    setPreviewUrl(project.image_url);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // Feature Helpers
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Size (Max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      alert(`File is too large! Maximum size allowed is 2MB. (Selected: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      e.target.value = '';
      setSelectedFile(null);
      setPreviewUrl(editingProject?.image_url || null);
      return;
    }

    // Set Preview
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = formData.image_url;

    try {
      // 1. If a new file is selected, upload it first
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

      // 2. Submit Project Data
      const payload = {
        ...formData,
        image_url: finalImageUrl,
        features: formData.features.map(f => f.trim()).filter(f => f !== '')
      };

      const url = editingProject 
        ? `/api/admin/projects/${editingProject.id}` 
        : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProjects();
        setFormData({ title: '', description: '', image_url: '', features: [''], link_url: '', link_text: '' });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingProject(null);
      } else {
        const errorJson = await res.json();
        throw new Error(errorJson.message || 'Failed to save project');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Manage Projects</h1>
          <p className="font-body text-on-surface-variant">Add, edit, or remove projects. (Max image size: 2MB)</p>
        </div>
        <button
          onClick={() => { 
            setEditingProject(null); 
            setFormData({ title: '', description: '', image_url: '', features: [''], link_url: '', link_text: '' });
            setPreviewUrl(null);
            setSelectedFile(null);
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 transition-all font-body text-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-surface-container-low rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group">
              <div className="aspect-[1024/500] w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden">
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{project.title}</h3>
              <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{project.description}</p>
              
              <div className="flex items-center gap-3 mt-auto">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="font-headline text-xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-2">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75dvh] overflow-y-auto custom-scrollbar">
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
                
                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Project Image (Max 2MB)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-11 px-4 flex items-center gap-3 rounded-xl bg-surface-container-high border border-outline-variant/20 cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">cloud_upload</span>
                    <span className="text-sm font-body text-on-surface-variant truncate">
                      {selectedFile ? selectedFile.name : (editingProject ? 'Change current image' : 'Upload image')}
                    </span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="space-y-2">
                   <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Image Preview (Aspect 1024:500)</label>
                   <div className="w-full aspect-[1024/500] rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-high">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                   </div>
                </div>
              )}

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

              {/* Dynamic Features List */}
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
                  disabled={isUploading}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    editingProject ? 'Update Project' : 'Create Project'
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

export default ProjectManagement;
