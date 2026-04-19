'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (file: File | null) => void;
  onClear: () => void;
  label?: string;
  maxSizeMB?: number;
  aspectRatio?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onClear,
  label = "Upload Image",
  maxSizeMB = 5,
  aspectRatio = "aspect-[1024/500]",
  className
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (value) setPreviewUrl(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Size
    const MAX_SIZE = maxSizeMB * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`File is too large! Maximum size allowed is ${maxSizeMB}MB.`);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    onChange(file);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange(null);
    onClear();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="font-label text-xs text-on-surface-variant ml-1 font-body">
        {label} (Max {maxSizeMB}MB)
      </label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group w-full overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer bg-surface-container-low min-h-[140px] flex flex-col items-center justify-center gap-3",
          aspectRatio
        )}
      >
        {previewUrl ? (
          <>
            <Image 
              src={previewUrl} 
              alt="Preview" 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <span className="text-white text-xs font-label">Change Image</span>
              <button 
                onClick={handleClear}
                className="p-2 rounded-full bg-error text-white hover:bg-error-container hover:text-on-error-container transition-all"
                title="Remove image"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-on-surface-variant group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
            <span className="text-sm font-label">Click to upload image</span>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}
