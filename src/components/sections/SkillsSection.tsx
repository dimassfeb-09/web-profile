'use client';

import React, { useState, useEffect } from 'react';
import SkillCategory from '../ui/SkillCategory';

interface Category {
  id?: number;
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}

const SkillsSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/skills');
        const json = await res.json();
        
        if (json.status === 200) {
          setCategories(json.data);
        } else {
          setError(json.message || 'Failed to fetch skills');
        }
      } catch (err) {
        setError('An error occurred while fetching skills');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24 min-h-[300px] flex items-center justify-center" id="skills">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24" id="skills">
        <div className="p-8 rounded-3xl bg-error/5 border border-error/10 text-center">
          <p className="text-error font-body">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24" id="skills">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Technical Arsenal.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          A comprehensive toolkit for modern software development.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xs:gap-8">
        {categories.map((cat, index) => (
          <SkillCategory
            key={cat.id || index}
            icon={cat.icon}
            title={cat.title}
            skills={cat.skills}
            colorClass={cat.color_class}
            delayClass={cat.delay_class}
          />
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
