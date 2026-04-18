'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
}

interface AchievementFormData {
  title: string;
  description: string;
  image_url: string;
  date: string;
}

const AchievementManagement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<AchievementFormData>({
    title: '',
    description: '',
    image_url: '',
    date: ''
  });

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/achievements');
      const json = await res.json();
      if (json.status === 200) {
        setAchievements(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      image_url: achievement.image_url,
      date: achievement.date || ''
    });
    setPreviewUrl(achievement.image_url);
    setSelectedFile(null);
    setIsModalOpen(true);
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
      setPreviewUrl(editingAchievement?.image_url || null);
      return;
    }

    // Set Preview
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.status === 200) {
        setAchievements(achievements.filter(a => a.id !== id));
      } else {
        alert(json.message || 'Failed to delete achievement');
      }
    } catch (err) {
      alert('Failed to delete achievement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = formData.image_url;

    try {
      // 1. If a new file is selected, upload it to the achievements bucket
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadRes = await fetch('/api/admin/upload?bucket=achievements', {
          method: 'POST',
          body: uploadFormData
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.status === 200) {
          finalImageUrl = uploadJson.data.url;
        } else {
          throw new Error(uploadJson.message || 'Image upload failed');
        }
      }

      // 2. Submit Achievement Data
      const payload = {
        ...formData,
        image_url: finalImageUrl
      };

      const url = editingAchievement 
        ? `/api/admin/achievements/${editingAchievement.id}` 
        : '/api/admin/achievements';
      const method = editingAchievement ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      if (resJson.status === 200 || resJson.status === 201) {
        setIsModalOpen(false);
        fetchAchievements();
        setFormData({ title: '', description: '', image_url: '', date: '' });
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingAchievement(null);
      } else {
        throw new Error(resJson.message || 'Failed to save achievement');
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
          <h1 className="font-headline text-3xl font-bold text-on-surface">Manage Achievements</h1>
          <p className="font-body text-on-surface-variant">Manage your career milestones and recognition.</p>
        </div>
        <button
          onClick={() => { 
            setEditingAchievement(null); 
            setFormData({ title: '', description: '', image_url: '', date: '' });
            setPreviewUrl(null);
            setSelectedFile(null);
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 transition-all font-body text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Achievement
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-surface-container-low rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group">
              <div className="aspect-[1024/500] w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden">
                <img src={achievement.image_url} alt={achievement.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-headline text-lg font-bold text-on-surface">{achievement.title}</h3>
                <span className="font-label text-xs text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                  {achievement.date}
                </span>
              </div>
              <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{achievement.description}</p>
              
              <div className="flex items-center gap-3 mt-auto">
                <button
                  onClick={() => handleEdit(achievement)}
                  className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(achievement.id)}
                  className="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="col-span-full py-20 text-center bg-surface-container-low rounded-[2rem] border-2 border-dashed border-outline-variant/20">
              <p className="font-body text-on-surface-variant">No achievements found. Start by adding one!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="font-headline text-xl font-bold">{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-2">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75dvh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Date (e.g. Jan 2025)</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Achievement Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-12 px-4 flex items-center gap-3 rounded-xl bg-surface-container-high border border-outline-variant/20 cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
                >
                  <span className="material-symbols-outlined text-primary text-xl">cloud_upload</span>
                  <span className="text-sm font-body text-on-surface-variant truncate">
                    {selectedFile ? selectedFile.name : (editingAchievement ? 'Change image' : 'Upload image')}
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

              {previewUrl && (
                <div className="space-y-2 animate-fade-in">
                   <div className="w-full aspect-[1024/500] rounded-2xl overflow-hidden border border-outline-variant/20">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                   </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body"
                />
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
                    editingAchievement ? 'Update Achievement' : 'Create Achievement'
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

export default AchievementManagement;
