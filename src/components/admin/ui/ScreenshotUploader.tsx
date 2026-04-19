'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { Trash2, ImagePlus } from 'lucide-react';

export type ScreenshotItem = 
  | { type: 'url'; url: string; id: string }
  | { type: 'file'; file: File; previewUrl: string; id: string };

interface ScreenshotUploaderProps {
  existingUrls: string[];
  maxImages?: number;
  maxSizeMB?: number;
  onFilesChange: (files: File[]) => void;
  onUrlsChange: (urls: string[]) => void;
  className?: string;
}

export default function ScreenshotUploader({
  existingUrls,
  maxImages = 8,
  maxSizeMB = 3,
  onFilesChange,
  onUrlsChange,
  className
}: ScreenshotUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mixed state to display both existing DB urls and new local files in one grid
  const [items, setItems] = useState<ScreenshotItem[]>([]);

  // Initialize existing URLs on mount or when existingUrls change externally
  useEffect(() => {
    const urlItems: ScreenshotItem[] = existingUrls.map((url, i) => ({
      type: 'url',
      url,
      // Create a stable ID for re-renders
      id: `url-${i}-${url}`
    }));
    
    // We only want to map URLs, and preserve currently selected local files
    setItems((prev) => {
      const currentFiles = prev.filter(item => item.type === 'file');
      return [...urlItems, ...currentFiles];
    });
  }, [existingUrls]);

  // Sync internal file array to parent
  useEffect(() => {
    const fileItems = items.filter(item => item.type === 'file') as { type: 'file', file: File, previewUrl: string, id: string }[];
    onFilesChange(fileItems.map(f => f.file));
  }, [items, onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentTotal = items.length;
    if (currentTotal + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images in total. You are trying to add ${files.length} to ${currentTotal} existing images.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const MAX_SIZE = maxSizeMB * 1024 * 1024;
    const newItems: ScreenshotItem[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image format.`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        alert(`${file.name} is too large! Maximum size allowed is ${maxSizeMB}MB.`);
        continue;
      }

      newItems.push({
        type: 'file',
        file,
        previewUrl: URL.createObjectURL(file),
        id: `file-${Date.now()}-${file.name}`
      });
    }

    setItems(prev => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (idToRemove: string) => {
    const itemToRemove = items.find(i => i.id === idToRemove);
    if (!itemToRemove) return;

    if (itemToRemove.type === 'file') {
      URL.revokeObjectURL(itemToRemove.previewUrl);
    } else {
      // If removing an existing URL, notify parent to update the URL array
      const currentUrlItems = items.filter(item => item.type === 'url') as { type: 'url', url: string, id: string }[];
      const updatedUrls = currentUrlItems.filter(i => i.id !== idToRemove).map(i => i.url);
      onUrlsChange(updatedUrls);
    }

    setItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const currentCount = items.length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center px-1">
        <label className="font-label text-xs text-on-surface-variant font-body">
          Gallery Screenshots ({currentCount}/{maxImages})
        </label>
        <div className="text-[10px] text-on-surface-variant/70 font-label">
          Max {maxSizeMB}MB per image
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className="group relative aspect-[9/16] bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm animate-fade-in"
          >
            <Image
              src={item.type === 'url' ? item.url : item.previewUrl}
              alt={`Screenshot ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:bg-error-container hover:text-on-error-container transition-all shadow-lg hover:scale-110 active:scale-95"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            {item.type === 'file' && (
              <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                New
              </div>
            )}
          </div>
        ))}
        
        {currentCount < maxImages && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[9/16] bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low transition-all rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 group text-on-surface-variant"
          >
            <div className="p-3 rounded-full bg-surface-container-high group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ImagePlus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-label font-medium uppercase tracking-wider group-hover:text-primary transition-colors">
              Add Image
            </span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
    </div>
  );
}
