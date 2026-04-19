'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSectionItemProps {
  id: string;
  section: {
    section_key: string;
    section_label: string;
    order_index: number;
    is_visible: boolean;
  };
  onToggleVisibility: (key: string) => void;
}

export function SortableSectionItem({ id, section, onToggleVisibility }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-5 bg-surface-container-low rounded-2xl border ${
        isDragging 
          ? 'border-primary shadow-2xl scale-[1.02] cursor-grabbing' 
          : 'border-outline-variant/10 hover:border-primary/30'
      } transition-all duration-200`}
    >
      <div className="flex items-center gap-5">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors cursor-grab active:cursor-grabbing"
          title="Geser untuk mengatur urutan"
        >
          <span className="material-symbols-outlined text-2xl select-none">drag_indicator</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center font-headline font-black text-sm text-secondary">
             {section.order_index}
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface tracking-tight">
              {section.section_label}
            </h4>
            <p className="text-xs font-body text-on-surface-variant tracking-wide">
              Key: {section.section_key}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggleVisibility(section.section_key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-label font-medium transition-all ${
            section.is_visible
              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
              : 'bg-error/10 text-error hover:bg-error/20'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {section.is_visible ? 'visibility' : 'visibility_off'}
          </span>
          {section.is_visible ? 'Visible' : 'Hidden'}
        </button>
      </div>
    </div>
  );
}
