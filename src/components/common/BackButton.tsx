'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/src/lib/utils';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ href, label = 'Kembali ke Beranda', className }) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "group inline-flex items-center gap-3 text-on-surface-variant hover:text-primary transition-all duration-300 font-label font-bold text-sm",
        className
      )}
    >
      <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm">
        <span className="material-symbols-outlined text-base">arrow_back</span>
      </div>
      {label}
    </Link>
  );
};

export default BackButton;
