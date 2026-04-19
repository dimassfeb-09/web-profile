'use client';

import React, { useEffect } from 'react';
import { cn } from '@/src/lib/utils';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  isLarge?: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  isLarge = false
}: AdminModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 xs:p-6 sm:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={cn(
          "relative w-full bg-surface rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90dvh]",
          isLarge ? "max-w-4xl" : "max-w-2xl",
          className
        )}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
          <h2 className="font-headline text-lg sm:text-xl font-bold text-on-surface">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-all"
            aria-label="Close modal"
          >
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}
