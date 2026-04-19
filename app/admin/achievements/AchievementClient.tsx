'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import ImageUploader from '@/src/components/admin/ui/ImageUploader';
import { createAchievementAction, updateAchievementAction, deleteAchievementAction } from '@/src/actions/achievement.actions';

interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  date: string | null;
  event_organizer?: string | null;
  category?: string | null;
  team_members?: string[] | null;
  tech_stack?: string[] | null;
  problem_statement?: string | null;
  solution_overview?: string | null;
  credential_url?: string | null;
}

interface AchievementClientProps {
  initialData: Achievement[];
}

export default function AchievementClient({ initialData }: AchievementClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    date: '',
    event_organizer: '',
    category: '',
    team_members: '',
    tech_stack: '',
    problem_statement: '',
    solution_overview: '',
    credential_url: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      image_url: achievement.image_url || '',
      date: formatDateForInput(achievement.date),
      event_organizer: achievement.event_organizer || '',
      category: achievement.category || '',
      team_members: achievement.team_members ? achievement.team_members.join(', ') : '',
      tech_stack: achievement.tech_stack ? achievement.tech_stack.join(', ') : '',
      problem_statement: achievement.problem_statement || '',
      solution_overview: achievement.solution_overview || '',
      credential_url: achievement.credential_url || ''
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    setIsLoading(true);
    try {
      const result = await deleteAchievementAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to delete achievement');
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
        ...formData,
        tech_stack: formData.tech_stack ? formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : null,
        team_members: formData.team_members ? formData.team_members.split(',').map(s => s.trim()).filter(Boolean) : null,
        image_url: finalImageUrl || null,
        date: formData.date || null
      };

      let result;
      if (editingAchievement) {
        result = await updateAchievementAction(editingAchievement.id, payload);
      } else {
        result = await createAchievementAction(payload);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', image_url: '', date: '', event_organizer: '', category: '', team_members: '', tech_stack: '', problem_statement: '', solution_overview: '', credential_url: '' });
        setSelectedFile(null);
        setEditingAchievement(null);
        router.refresh();
      } else {
        throw new Error(result.message || 'Failed to save achievement');
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
        title="Achievements" 
        description="Display your awards and special recognition."
        buttonLabel="Add Achievement"
        onButtonClick={() => {
          setEditingAchievement(null);
          setFormData({ title: '', description: '', image_url: '', date: '', event_organizer: '', category: '', team_members: '', tech_stack: '', problem_statement: '', solution_overview: '', credential_url: '' });
          setSelectedFile(null);
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.map((achievement, index) => (
          <div key={achievement.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group">
            {achievement.image_url ? (
               <div className="aspect-video w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden relative">
                 <Image 
                   src={achievement.image_url} 
                   alt={achievement.title} 
                   fill 
                   priority={index < 3}
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-cover" 
                 />
               </div>
            ) : (
               <div className="aspect-video w-full rounded-2xl bg-surface-container-high mb-6 flex items-center justify-center">
                 <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">emoji_events</span>
               </div>
            )}
            
            <h3 className="font-headline text-lg font-bold text-on-surface mb-2">{achievement.title}</h3>
            <p className="font-body text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{achievement.description}</p>
            
            <div className="flex items-center gap-3">
              <button
                disabled={isLoading}
                onClick={() => handleEdit(achievement)}
                className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(achievement.id)}
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
        title={editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Achievement Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <ImageUploader 
            value={formData.image_url}
            onChange={(file) => setSelectedFile(file)}
            onClear={() => setFormData({ ...formData, image_url: '' })}
            label="Achievement Image/Proof"
            maxSizeMB={2}
            aspectRatio="aspect-video"
          />

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Date (Optional)</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Event Organizer (Optional)</label>
              <input
                type="text"
                value={formData.event_organizer}
                onChange={(e) => setFormData({ ...formData, event_organizer: e.target.value })}
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Category (Optional)</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Problem Statement (Optional)</label>
            <textarea
              rows={3}
              value={formData.problem_statement}
              onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Solution Overview (Optional)</label>
            <textarea
              rows={3}
              value={formData.solution_overview}
              onChange={(e) => setFormData({ ...formData, solution_overview: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Team Members (comma separated)</label>
            <input
              type="text"
              value={formData.team_members}
              onChange={(e) => setFormData({ ...formData, team_members: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Credential URL (Optional)</label>
            <input
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
            >
              {isLoading ? 'Saving...' : editingAchievement ? 'Update Achievement' : 'Create Achievement'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
