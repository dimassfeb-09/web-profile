'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import ImageUploader from '@/src/components/admin/ui/ImageUploader';
import { createAchievementAction, updateAchievementAction, deleteAchievementAction } from '@/src/actions/achievement.actions';
import { slugify } from '@/src/lib/utils/slugify';
import { useDebounce } from 'use-debounce';

interface Achievement {
  id: string;
  slug: string;
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
  image_hash?: string | null;
}

interface AchievementClientProps {
  initialData: Achievement[];
}

export default function AchievementClient({ initialData }: AchievementClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ loading: boolean; available: boolean | null }>({ loading: false, available: null });


  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    image_url: '',
    image_hash: '',
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
      slug: achievement.slug || '',
      description: achievement.description,
      image_url: achievement.image_url || '',
      image_hash: achievement.image_hash || '',
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
    setIsSlugManuallyEdited(true); // Don't auto-sync when editing existing
    setSlugStatus({ loading: false, available: true });
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
    let finalImageHash = formData.image_hash;

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
          finalImageHash = uploadJson.data.hash;
        } else {
          throw new Error(uploadJson.message || 'Image upload failed');
        }
      }

      const payload = {
        ...formData,
        tech_stack: formData.tech_stack ? formData.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : null,
        team_members: formData.team_members ? formData.team_members.split(',').map(s => s.trim()).filter(Boolean) : null,
        image_url: finalImageUrl || null,
        image_hash: finalImageHash || null,
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
        setFormData({ title: '', slug: '', description: '', image_url: '', image_hash: '', date: '', event_organizer: '', category: '', team_members: '', tech_stack: '', problem_statement: '', solution_overview: '', credential_url: '' });
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

  const handleSlugBlur = () => {
    setFormData({ ...formData, slug: slugify(formData.slug) });
  };

  const [debouncedSlug] = useDebounce(formData.slug, 300);

  React.useEffect(() => {
    const checkSlug = async () => {
      if (!debouncedSlug) {
        setSlugStatus({ loading: false, available: null });
        return;
      }
      setSlugStatus({ loading: true, available: null });
      try {
        const res = await fetch(`/api/admin/achievements/check-slug?slug=${debouncedSlug}${editingAchievement ? `&excludeId=${editingAchievement.id}` : ''}`);
        const data = await res.json();
        setSlugStatus({ loading: false, available: data.available });
      } catch {
        setSlugStatus({ loading: false, available: null });
      }
    };
    checkSlug();
  }, [debouncedSlug, editingAchievement]);

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Achievements" 
        description="Display your awards and special recognition."
        buttonLabel="Add Achievement"
        onButtonClick={() => {
          setEditingAchievement(null);
          setFormData({ title: '', slug: '', description: '', image_url: '', image_hash: '', date: '', event_organizer: '', category: '', team_members: '', tech_stack: '', problem_statement: '', solution_overview: '', credential_url: '' });
          setSelectedFile(null);
          setIsSlugManuallyEdited(false);
          setSlugStatus({ loading: false, available: null });
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
              onChange={(e) => {
                const newTitle = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  title: newTitle,
                  slug: isSlugManuallyEdited ? (prev.slug || '') : slugify(newTitle)
                }));
              }}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="font-label text-xs text-on-surface-variant font-body">Slug</label>
              <span className="text-[10px] text-on-surface-variant/60 font-body">{(formData.slug || '').length}/100</span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.slug}
              onChange={(e) => {
                const newSlug = e.target.value.toLowerCase().replace(/[\s_-]+/g, '-');
                setIsSlugManuallyEdited(newSlug !== '');
                setFormData({ ...formData, slug: newSlug });
              }}
              onBlur={handleSlugBlur}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
            <div className="flex justify-between items-center px-1">
              <p className="text-[11px] text-on-surface-variant/60 font-body">
                URL Preview: https://www.dimassfeb.com/achievements/{formData.slug || 'slug-otomatis'}
              </p>
              {slugStatus.loading ? (
                <span className="text-[10px] text-primary animate-pulse font-body">Checking...</span>
              ) : slugStatus.available === true ? (
                <span className="text-[10px] text-green-500 flex items-center gap-1 font-body">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Slug tersedia
                </span>
              ) : slugStatus.available === false ? (
                <span className="text-[10px] text-error flex items-center gap-1 font-body">
                  <span className="material-symbols-outlined text-[12px]">cancel</span>
                  Slug sudah dipakai
                </span>
              ) : null}
            </div>
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
              disabled={isLoading || slugStatus.available === false}
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
