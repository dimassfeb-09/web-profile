import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, icon, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest/50 backdrop-blur-sm border border-outline-variant/20 ${className}`}>
      {icon}
      <span className="font-label text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
        {children}
      </span>
    </div>
  );
};

export default Badge;
