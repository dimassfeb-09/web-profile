'use client';

import React from 'react';
import AdminModal from './AdminModal';
import { cn } from '@/src/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  isLoading = false
}: ConfirmDialogProps) {
  const getColorClasses = () => {
    switch (type) {
      case 'danger': return 'bg-error text-on-error hover:bg-error/90';
      case 'warning': return 'bg-warning text-on-warning hover:bg-warning/90';
      default: return 'bg-primary text-on-primary hover:bg-primary/90';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger': return 'delete';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger': return 'text-error bg-error/10';
      case 'warning': return 'text-warning bg-warning/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", getIconColor())}>
          <span className="material-symbols-outlined text-3xl font-variation-fill-1">{getIcon()}</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-on-surface-variant leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 rounded-2xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-label text-sm font-bold disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 px-6 py-3.5 rounded-2xl transition-all font-label text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-black/5",
              getColorClasses()
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
