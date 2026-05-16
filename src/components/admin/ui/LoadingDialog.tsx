'use client';

import React from 'react';
import { cn } from '@/src/lib/utils';

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
}

export default function LoadingDialog({
  isOpen,
  message = 'Loading...'
}: LoadingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" />
      
      {/* Container */}
      <div className="relative bg-surface p-8 rounded-[2rem] shadow-2xl animate-scale-up flex flex-col items-center gap-4 min-w-[200px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-headline font-medium text-on-surface text-center">{message}</p>
      </div>
    </div>
  );
}
