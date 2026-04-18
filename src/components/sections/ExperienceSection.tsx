'use client';

import React, { useState, useEffect } from 'react';
import ExperienceItem from '../ui/ExperienceItem';

interface Experience {
  id?: number;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string[];
}

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/experience');
        const json = await res.json();
        
        if (json.status === 200) {
          setExperiences(json.data);
        } else {
          setError(json.message || 'Failed to fetch experiences');
        }
      } catch (err) {
        setError('An error occurred while fetching experiences');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24 min-h-[300px] flex items-center justify-center" id="experience">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-body animate-pulse">Retrieving experience history...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24" id="experience">
        <div className="p-8 rounded-3xl bg-error/5 border border-error/10 text-center">
          <p className="text-error font-body mb-4">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24" id="experience">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Professional Journey.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          My experience in building and shipping software.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {experiences.map((exp, index) => (
          <ExperienceItem
            key={exp.id || index}
            role={exp.role}
            company={exp.company}
            start_date={exp.start_date}
            end_date={exp.end_date}
            description={exp.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
