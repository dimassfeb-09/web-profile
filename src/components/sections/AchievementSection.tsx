'use client';

import React, { useState, useEffect } from 'react';
import AchievementCard from '../ui/AchievementCard';

interface Achievement {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
}

const AchievementSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/achievements');
        const json = await res.json();
        
        if (json.status === 200) {
          setAchievements(json.data);
        } else {
          setError(json.message || 'Failed to fetch achievements');
        }
      } catch (err) {
        setError('An error occurred while fetching achievements');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);


  if (isLoading) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24" id="achievements">
        <div className="mb-12 xs:mb-16">
          <div className="h-10 w-64 bg-surface-container-high rounded-full animate-pulse mb-4"></div>
          <div className="h-6 w-96 bg-surface-container-high rounded-full animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="aspect-[1024/700] bg-surface-container-low rounded-[2rem] animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error || achievements.length === 0) return null;

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24" id="achievements">
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
            title={achievement.title}
            description={achievement.description}
            imageUrl={achievement.image_url}
            date={achievement.date || ''}
          />
        ))}
      </div>
    </section>
  );
};

export default AchievementSection;
