import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AchievementCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string | Date | null;
  priority?: boolean;
}

const AchievementCard = ({ id, title, description, imageUrl, date, priority }: AchievementCardProps) => {
  const formatDate = (dateValue: string | Date | null) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <Link href={`/achievements/${id}`} className="group bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 block">
      <div className="aspect-[1024/500] w-full bg-surface-container-high overflow-hidden relative">
        <Image 
          src={imageUrl || '/placeholder.jpg'} 
          alt={`${title} - Achievement by Dimas Febriyanto`} 
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline text-lg font-bold text-on-surface line-clamp-1">{title}</h3>
          <span className="font-label text-xs text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
            {formatDate(date)}
          </span>
        </div>
        <p className="font-body text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-primary font-label text-xs font-bold tracking-wide">
          View Detail
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default AchievementCard;
