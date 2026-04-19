import React from 'react';
import AchievementCard from '../ui/AchievementCard';

interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  date: string | Date | null;
}

interface AchievementSectionProps {
  achievements: Achievement[];
}

const AchievementSection: React.FC<AchievementSectionProps> = ({ achievements }) => {
  if (achievements.length === 0) return null;

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24 min-h-[400px]">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Achievements.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          Recognition and milestones attained throughout my journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id || index}
            id={achievement.id}
            title={achievement.title}
            description={achievement.description}
            imageUrl={achievement.image_url}
            date={achievement.date || ''}
            priority={index < 2}
          />
        ))}
      </div>
    </section>
  );
};

export default AchievementSection;
