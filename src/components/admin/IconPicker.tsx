'use client';

import React, { useState, useMemo } from 'react';

// Curated list of tech and professional Material Symbols
const COMMON_ICONS = [
  // Development
  'code', 'terminal', 'database', 'storage', 'data_object', 'javascript', 'html', 'css', 
  'integration_instructions', 'api', 'memory', 'cpu', 'router', 'dns', 'cloud', 'cloud_done', 
  'settings_ethernet', 'browser_updated', 'web', 'ads_click', 'webhook', 'source',
  
  // Design & Creative
  'design_services', 'palette', 'brush', 'imagesmode', 'photo_library', 'auto_fix_high', 
  'layers', 'format_paint', 'aspect_ratio', 'draw', 'ink_pen', 'vector_library', 'font_download',

  // Business & Productivity
  'business_center', 'trending_up', 'monitoring', 'analytics', 'query_stats', 'payments', 
  'credit_card', 'account_balance', 'savings', 'receipt_long', 'assignment', 'checklist', 
  'schedule', 'event', 'alarm', 'hourglass_empty', 'speed', 'workspace_premium',

  // Communication & Users
  'chat', 'forum', 'mail', 'send', 'campaign', 'language', 'public', 'groups', 'person', 
  'person_add', 'support_agent', 'contact_support', 'psychology', 'group_work', 'diversity_3',

  // Security & Settings
  'security', 'shield', 'vpn_key', 'lock', 'lock_open', 'verified_user', 'admin_panel_settings', 
  'policy', 'settings', 'build', 'maintenance', 'construction', 'handyman',

  // General & Abstract
  'lightbulb', 'bolt', 'auto_awesome', 'star', 'favorite', 'rocket_launch', 'auto_graph', 
  'hub', 'share', 'link', 'attachment', 'folder', 'article', 'description', 'import_contacts',
  'school', 'history_edu', 'military_tech', 'emoji_objects', 'diamond'
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = useMemo(() => {
    return COMMON_ICONS.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex-grow flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 cursor-pointer hover:border-primary transition-all overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">
              {value || 'search'}
            </span>
          </div>
          <span className="text-sm font-body text-on-surface truncate">
            {value || 'Select an icon...'}
          </span>
          <span className="material-symbols-outlined ml-auto text-on-surface-variant text-lg">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-surface-container-high border border-outline-variant/30 rounded-2xl shadow-2xl p-4 animate-scale-up origin-top">
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                autoFocus
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
              />
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
              {filteredIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  title={icon}
                  onClick={() => {
                    onChange(icon);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`aspect-square rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all ${
                    value === icon ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {icon}
                  </span>
                </button>
              ))}
              {filteredIcons.length === 0 && (
                <div className="col-span-full py-8 text-center text-on-surface-variant font-body text-xs italic">
                  No icons found matching &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-outline-variant/10 text-[10px] text-on-surface-variant font-body italic">
              *Showing curated professional icons
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IconPicker;
