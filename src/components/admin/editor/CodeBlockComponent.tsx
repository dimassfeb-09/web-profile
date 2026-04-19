'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Check, Copy, ChevronDown, Search, X } from 'lucide-react';

const CodeBlockComponent = ({ node: { attrs: { language, filename } }, updateAttributes, extension, node, editor }: NodeViewProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const languages = useMemo(() => extension.options.lowlight.listLanguages() as string[], [extension]);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return languages;
    return languages.filter(lang => lang.toLowerCase().includes(query));
  }, [languages, searchQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const selectLanguage = (lang: string) => {
    updateAttributes({ language: lang });
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <NodeViewWrapper className="code-block relative group my-8">
      {/* Header / Toolbar */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5 rounded-t-xl"
        contentEditable={false}
      >
        <div className="flex items-center gap-4 flex-wrap">
          {/* Language & Filename Group */}
          <div className="flex items-center gap-2">
            {/* Custom Searchable Language Selector */}
            <div className="relative" ref={dropdownRef}>
              {editor.isEditable ? (
                <>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 text-[10px] font-bold text-white/60 hover:text-primary transition-all uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/5 hover:border-primary/50 whitespace-nowrap"
                  >
                    {language || 'auto'}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left">
                      {/* Search Input */}
                      <div className="p-3 border-b border-white/5 flex items-center gap-3">
                        <Search className="w-3.5 h-3.5 text-white/40" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search language..."
                          className="bg-transparent border-none outline-none text-xs text-white/80 placeholder:text-white/40 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Options List */}
                      <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        <button
                          onClick={() => selectLanguage('auto')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors mb-0.5 ${
                            !language || language === 'auto' 
                              ? 'bg-primary/20 text-primary font-bold' 
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          Auto Detect
                        </button>
                        
                        <div className="h-px bg-white/5 my-1 mx-2" />
                        
                        {filteredLanguages.length > 0 ? (
                          filteredLanguages.map((lang) => (
                            <button
                              key={lang}
                              onClick={() => selectLanguage(lang)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors mb-0.5 capitalize ${
                                language === lang
                                  ? 'bg-primary/20 text-primary font-bold'
                                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {lang}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-white/30">
                            Not found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,82,255,0.6)]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                      {language || 'code'}
                    </span>
                  </div>
                  
                  {filename && (
                    <>
                      <div className="w-px h-2.5 bg-white/10" />
                      <span className="text-[10px] font-medium text-white/50 font-mono tracking-tight">
                        {filename}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Editor</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-95"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-[10px] font-bold text-green-400">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="m-0 p-6 bg-[#171717] text-gray-300 rounded-b-xl font-mono text-sm leading-relaxed overflow-x-auto selection:bg-primary/30">
        <NodeViewContent as={"code" as any} className={`language-${language}`} />
      </pre>

      {/* Background Glow Effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-[2rem] -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
