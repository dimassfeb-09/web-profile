'use client';

import React, { useState, useEffect } from 'react';
import IconPicker from '@/src/components/admin/IconPicker';

interface SkillCategory {
  id: number;
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}

const SkillManagement = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<SkillCategory | null>(null);

  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    skills: '',
    color_class: '',
    delay_class: ''
  });

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      const json = await res.json();
      if (json.status === 200) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

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
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    const url = editingCat ? `/api/admin/skills/${editingCat.id}` : '/api/admin/skills';
    const method = editingCat ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchSkills();
        setFormData({ icon: '', title: '', skills: '', color_class: '', delay_class: '' });
        setEditingCat(null);
      }
    } catch (err) {
      alert('Failed to save skills');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Skill Categories</h1>
          <p className="font-body text-on-surface-variant">Manage your technical stacks and core competencies.</p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 transition-all font-body text-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-surface-container-low rounded-3xl animate-pulse"></div>)
        ) : (
          categories.map((cat) => (
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
                  onClick={() => handleEdit(cat)}
                  className="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-surface rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="font-headline text-xl font-bold">{editingCat ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface p-2">
                 <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                  className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body"
                >
                  {editingCat ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillManagement;
