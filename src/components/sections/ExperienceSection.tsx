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
  tags?: string[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences: initialExperiences,
}) => {
  const [experiences, setExperiences] =
    React.useState<Experience[]>(initialExperiences);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [offset, setOffset] = React.useState(initialExperiences.length);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 4;

  // Extract unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    experiences.forEach((exp) => {
      exp.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [experiences]);

  const filteredExperiences = React.useMemo(() => {
    if (!selectedTag) return experiences;
    return experiences.filter((exp) => exp.tags?.includes(selectedTag));
  }, [experiences, selectedTag]);

  const groupedExperiences = React.useMemo(() => {
    const groups: {
      company: string;
      roles: Experience[];
    }[] = [];

    filteredExperiences.forEach((exp) => {
      const existingGroup = groups.find((g) => g.company === exp.company);
      if (existingGroup) {
        existingGroup.roles.push(exp);
      } else {
        groups.push({
          company: exp.company,
          roles: [exp],
        });
      }
    });

    return groups;
  }, [filteredExperiences]);

  const loadMoreExperiences = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/experience?limit=${PAGE_SIZE}&offset=${offset}`,
      );
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
        if (entries[0].isIntersecting && hasMore && !selectedTag) {
          loadMoreExperiences();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreExperiences, hasMore, selectedTag]);

  return (
    <section id="experience" className="pt-12 xs:pt-16 lg:pt-24 min-h-[400px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 xs:mb-16 gap-6">
        <div className="max-w-xl">
          <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
            Professional Journey.
          </h2>
          <p className="font-body text-on-surface-variant text-base xs:text-lg">
            Experience everything I've worked on throughout my career in
            software development.
          </p>
        </div>

        {/* Filter UI */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedTag === null
                ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {groupedExperiences.map((group, index) => (
          <ExperienceItem
            key={`${group.company}-${index}`}
            company={group.company}
            roles={group.roles}
          />
        ))}
      </div>

      {/* Sentinel Element for Infinite Scroll */}
      {!selectedTag && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-12"
        >
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
              <p className="text-zinc-400 text-sm font-medium">
                End of Professional Journey
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;
