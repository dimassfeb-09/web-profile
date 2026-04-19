'use client';

import React, { useState } from 'react';
import IconPicker from '@/src/components/admin/IconPicker';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import { createSkillAction, updateSkillAction, deleteSkillAction } from '@/src/actions/skill.actions';
import { useRouter } from 'next/navigation';

interface SkillCategory {
  id: number;
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}

interface SkillClientProps {
  initialData: SkillCategory[];
}

export default function SkillClient({ initialData }: SkillClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<SkillCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    skills: '',
    color_class: '',
    delay_class: ''
  });

  const handleEdit = (cat: SkillCategory) => {
    setEditingCat(cat);
    setFormData({
      icon: cat.icon,
      title: cat.title,
      skills: cat.skills.join(', '),
      color_class: cat.color_class,
      delay_class: cat.delay_class
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setIsLoading(true);
    try {
      const result = await deleteSkillAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      let result;
      if (editingCat) {
        result = await updateSkillAction(editingCat.id, payload);
      } else {
        result = await createSkillAction(payload);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        setFormData({ icon: '', title: '', skills: '', color_class: '', delay_class: '' });
        setEditingCat(null);
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to save skills');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Skill Categories" 
        description="Manage your technical stacks and core competencies."
        buttonLabel="Add Category"
        onButtonClick={() => {
          setEditingCat(null);
          setFormData({ icon: '', title: '', skills: '', color_class: '', delay_class: '' });
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {initialData.map((cat) => (
          <div key={cat.id} className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-8 flex flex-col group">
            <div className={`w-14 h-14 rounded-2xl ${cat.color_class.replace('bg-opacity-10', 'bg-opacity-20')} flex items-center justify-center mb-6`}>
              <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-4">{cat.title}</h3>
            <div className="flex flex-wrap gap-2 mb-8 flex-grow">
              {cat.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 h-min rounded-xl bg-surface-container-high text-on-surface-variant font-label text-xs">
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                disabled={isLoading}
                onClick={() => handleEdit(cat)}
                className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(cat.id)}
                className="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all disabled:opacity-50"
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
        title={editingCat ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1 font-body">Select Category Icon</label>
              <IconPicker 
                value={formData.icon} 
                onChange={(iconName) => setFormData({ ...formData, icon: iconName })} 
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1">Category Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1">Skills (comma separated)</label>
            <input
              type="text"
              required
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, Next.js, TypeScript"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1">Color Class (Tailwind)</label>
              <input
                type="text"
                required
                value={formData.color_class}
                onChange={(e) => setFormData({ ...formData, color_class: e.target.value })}
                placeholder="e.g. bg-primary/10 text-primary"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1">Delay Class (Tailwind)</label>
              <input
                type="text"
                required
                value={formData.delay_class}
                onChange={(e) => setFormData({ ...formData, delay_class: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingCat ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
