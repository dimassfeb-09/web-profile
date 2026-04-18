import React from 'react';

interface AchievementCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const AchievementCard = ({ title, description, imageUrl, date }: AchievementCardProps) => {
  return (
    <div className="group bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="aspect-[1024/500] w-full bg-surface-container-high overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline text-lg font-bold text-on-surface line-clamp-1">{title}</h3>
          <span className="font-label text-xs text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
            {date}
          </span>
        </div>
        <p className="font-body text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AchievementCard;
