'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';
import AdminModal from '@/src/components/admin/ui/AdminModal';
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from '@/src/actions/experience.actions';

interface Experience {
  id: number;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string[];
}

interface ExperienceClientProps {
  initialData: Experience[];
}

export default function ExperienceClient({ initialData }: ExperienceClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    start_date: '',
    end_date: '',
    description: '',
    isCurrent: false
  });

  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      start_date: formatDateForInput(exp.start_date),
      end_date: formatDateForInput(exp.end_date),
      description: exp.description.join('\n'),
      isCurrent: exp.end_date === null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    setIsLoading(true);
    try {
      const result = await deleteExperienceAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (!formData.isCurrent && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      alert('End date cannot be earlier than start date');
      setIsLoading(false);
      return;
    }

    const payload = {
      role: formData.role,
      company: formData.company,
      start_date: formData.start_date,
      end_date: formData.isCurrent ? null : formData.end_date,
      description: formData.description.split('\n').map(d => d.trim()).filter(d => d !== '')
    };

    try {
      let result;
      if (editingExp) {
        result = await updateExperienceAction(editingExp.id, payload);
      } else {
        result = await createExperienceAction(payload);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        setFormData({ role: '', company: '', start_date: '', end_date: '', description: '', isCurrent: false });
        setEditingExp(null);
        router.refresh();
      } else {
        alert(result.message || 'Failed to save experience');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Experience History" 
        description="Manage your professional journey with exact dates."
        buttonLabel="Add Experience"
        onButtonClick={() => {
          setEditingExp(null);
          setFormData({ role: '', company: '', start_date: '', end_date: '', description: '', isCurrent: false });
          setIsModalOpen(true);
        }}
      />

      <div className="space-y-4">
        {initialData.map((exp) => (
          <div key={exp.id} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/20 transition-all">
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-headline text-xl font-bold text-on-surface">{exp.role}</h3>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {formatDisplayDate(exp.start_date)} — {formatDisplayDate(exp.end_date)}
                </span>
              </div>
              <p className="font-label text-sm text-primary font-semibold">{exp.company}</p>
              <div className="text-sm text-on-surface-variant font-body">
                 {exp.description.length} points of achievements
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                disabled={isLoading}
                onClick={() => handleEdit(exp)}
                className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(exp.id)}
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
        title={editingExp ? 'Edit Experience' : 'Add Experience'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1">Role / Position</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs text-on-surface-variant ml-1">Company</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 ml-1">
               <input 
                type="checkbox" 
                id="isCurrent"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
               />
               <label htmlFor="isCurrent" className="font-label text-sm text-on-surface cursor-pointer">I currently work here</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-xs text-on-surface-variant ml-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
                />
              </div>
              <div className="space-y-2">
                <label className={`font-label text-xs ml-1 ${formData.isCurrent ? 'text-on-surface-variant/40' : 'text-on-surface-variant'}`}>
                  End Date
                </label>
                <input
                  type="date"
                  required={!formData.isCurrent}
                  disabled={formData.isCurrent}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-body ${
                    formData.isCurrent 
                    ? 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant/30 cursor-not-allowed' 
                    : 'bg-surface-container-high border-outline-variant/20 focus:outline-none focus:border-primary'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs text-on-surface-variant ml-1">Description (separate each line for bullet points)</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none custom-scrollbar font-body"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingExp ? 'Update Experience' : 'Create Experience'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
