"use client";

import React from "react";
import ExperienceItem from "../ui/ExperienceItem";

interface Experience {
  id?: number;
  role: string;
  company: string;
  start_date: string | Date;
  end_date: string | Date | null;
  description: string[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences: initialExperiences,
}) => {
  const [experiences, setExperiences] = React.useState<Experience[]>(initialExperiences);
  const [offset, setOffset] = React.useState(initialExperiences.length);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 4;

  const loadMoreExperiences = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/experience?limit=${PAGE_SIZE}&offset=${offset}`);
      const result = await response.json();

      if (result.status === 200 && result.data) {
        const newExperiences = result.data;
        if (newExperiences.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setExperiences((prev) => [...prev, ...newExperiences]);
        setOffset((prev) => prev + newExperiences.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more experiences:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreExperiences();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreExperiences, hasMore]);

  return (
    <section id="experience" className="pt-12 xs:pt-16 lg:pt-24 min-h-[400px]">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Professional Journey.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          Experience everything I've worked on throughout my career in software
          development.
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

      {/* Sentinel Element for Infinite Scroll */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center mt-12">
        {isLoading && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-medium text-zinc-400 animate-pulse uppercase tracking-widest">
              Loading More Experience
            </p>
          </div>
        )}
        {!hasMore && experiences.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="h-px w-12 bg-zinc-200" />
            <p className="text-zinc-400 text-sm font-medium">End of Professional Journey</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
