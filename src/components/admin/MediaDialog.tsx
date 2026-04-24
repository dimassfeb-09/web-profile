'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon, ImagePlay, Loader2, Search } from 'lucide-react';

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}

type Tab = 'upload' | 'link' | 'giphy';

export default function MediaDialog({ isOpen, onClose, onInsert, onUpload }: MediaDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Giphy state
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLinkUrl('');
      setSearchQuery('');
      setGifs([]);
      setActiveTab('upload');
    }
  }, [isOpen]);

  // Handle outside click
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await onUpload(file);
      if (url) {
        onInsert(url);
        onClose();
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (linkUrl.trim()) {
      onInsert(linkUrl.trim());
      onClose();
    }
  };

  const searchGifs = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setApiKeyMissing(false);
    setErrorMsg('');
    
    // Check for Giphy API Key in env
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    
    if (!apiKey) {
      setIsSearching(false);
      setApiKeyMissing(true);
      return;
    }

    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=20&rating=g`);
      const data = await res.json();
      if (res.ok && data.data) {
        setGifs(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch GIFs from Giphy');
      }
    } catch (error: any) {
      console.error('Error fetching GIFs:', error);
      setErrorMsg('Network error: Failed to reach Giphy. If you are using an adblocker, it might be blocking the request.');
    } finally {
      setIsSearching(false);
    }
  };

  const getTrendingGifs = async () => {
    setIsSearching(true);
    setErrorMsg('');
    const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
    if (!apiKey) {
      setIsSearching(false);
      setApiKeyMissing(true);
      return;
    }

    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20&rating=g`);
      const data = await res.json();
      if (res.ok && data.data) {
        setGifs(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to load trending GIFs');
      }
    } catch (error: any) {
      console.error('Error fetching trending GIFs:', error);
      setErrorMsg('Network error: Failed to reach Giphy. If you are using an adblocker, it might be blocking the request.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'giphy' && gifs.length === 0 && !searchQuery && !apiKeyMissing) {
      getTrendingGifs();
    }
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        ref={dialogRef}
        className="bg-surface w-full max-w-lg rounded-3xl shadow-xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
          <h3 className="font-headline font-bold text-lg text-on-surface">Add Media</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-outline-variant/10">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-bold transition-colors ${activeTab === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-bold transition-colors ${activeTab === 'link' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <LinkIcon className="w-4 h-4" /> Link
          </button>
          <button
            onClick={() => setActiveTab('giphy')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-bold transition-colors ${activeTab === 'giphy' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <ImagePlay className="w-4 h-4" /> Giphy
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center py-8">
              <input 
                type="file" 
                id="media-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label 
                htmlFor="media-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-outline-variant/40 rounded-2xl cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <span className="text-sm font-bold text-on-surface-variant">Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-on-surface">Click to upload image or GIF</span>
                    <span className="text-xs text-on-surface-variant mt-1">Supports JPG, PNG, WEBP, GIF (Max 5MB)</span>
                  </>
                )}
              </label>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="flex flex-col gap-4 py-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Image or GIF URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.gif"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit(e)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/50"
                  required
                />
              </div>
              <button 
                type="button"
                onClick={handleLinkSubmit}
                disabled={!linkUrl}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold disabled:opacity-50 transition-all hover:opacity-90"
              >
                Insert Media
              </button>
            </div>
          )}

          {activeTab === 'giphy' && (
            <div className="flex flex-col gap-4 h-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search GIFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchGifs()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/50"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <button 
                  onClick={searchGifs}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90"
                >
                  Search
                </button>
              </div>

              {apiKeyMissing && (
                <div className="p-4 bg-error/10 text-error rounded-xl text-sm text-center">
                  <strong>API Key Missing!</strong><br />
                  Please add <code className="bg-error/20 px-1 rounded">NEXT_PUBLIC_GIPHY_API_KEY</code> to your .env file to use Giphy search.
                </div>
              )}

              {errorMsg && !apiKeyMissing && (
                <div className="p-4 bg-error/10 text-error rounded-xl text-sm text-center">
                  {errorMsg}
                </div>
              )}

              {isSearching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 overflow-y-auto pb-4">
                  {gifs.map((gif) => (
                    <button
                      key={gif.id}
                      onClick={() => {
                        onInsert(gif.images.original.url);
                        onClose();
                      }}
                      className="relative rounded-xl overflow-hidden aspect-video bg-surface-container-low group hover:ring-2 hover:ring-primary transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={gif.images.fixed_height_small.url} 
                        alt={gif.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                  {gifs.length === 0 && !apiKeyMissing && (
                    <div className="col-span-2 text-center py-8 text-on-surface-variant text-sm">
                      No GIFs found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
