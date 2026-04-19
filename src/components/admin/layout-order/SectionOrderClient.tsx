'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSectionItem } from './SortableSectionItem';
import { updateSectionOrdersAction } from '@/src/actions/section_order.actions';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';

interface Section {
  section_key: string;
  section_label: string;
  order_index: number;
  is_visible: boolean;
}

interface SectionOrderClientProps {
  initialSections: Section[];
}

export default function SectionOrderClient({ initialSections }: SectionOrderClientProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.section_key === active.id);
        const newIndex = items.findIndex((i) => i.section_key === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Recalculate order_index based on new position
        return newArray.map((item, index) => ({
          ...item,
          order_index: index + 1,
        }));
      });
    }
  };

  const toggleVisibility = (key: string) => {
    setSections((items) =>
      items.map((item) =>
        item.section_key === key ? { ...item, is_visible: !item.is_visible } : item
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      const result = await updateSectionOrdersAction(sections);
      if (result.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.message);
      }
    } catch {
      alert('Failed to save section orders');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset urutan ke data awal?')) {
      setSections(initialSections);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <AdminHeader 
        title="Layout & Section Order" 
        description="Atur urutan tampilan section pada halaman portfolio Anda dengan drag and drop."
      />

      <div className="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-label font-bold text-primary">
            <span className="material-symbols-outlined text-sm">info</span>
            Geser handle (⠿) untuk merubah urutan
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-6 py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-all text-xs font-label font-medium"
            >
              Reset Perubahan
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-primary text-white font-label font-medium text-xs tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Simpan Urutan'
              )}
            </button>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 text-emerald-500 font-label text-sm animate-fade-in-up">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Urutan section berhasil disimpan!
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext
              items={sections.map((s) => s.section_key)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.section_key}
                  id={section.section_key}
                  section={section}
                  onToggleVisibility={toggleVisibility}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
