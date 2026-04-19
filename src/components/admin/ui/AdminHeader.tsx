import React from 'react';

interface AdminHeaderProps {
  title: string;
  description: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  icon?: string;
}

export default function AdminHeader({
  title,
  description,
  buttonLabel,
  onButtonClick,
  icon = 'add'
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="font-headline text-2xl xs:text-3xl font-bold text-on-surface">{title}</h1>
        <p className="font-body text-sm xs:text-base text-on-surface-variant max-w-xl">{description}</p>
      </div>
      {buttonLabel && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 active:scale-95 transition-all font-body text-sm shrink-0 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">{icon}</span>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
