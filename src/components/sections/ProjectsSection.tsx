"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "../ui/ProjectCard";

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
  slug?: string;
  tech_stack?: string[];
}

interface ProjectsSectionProps {
  initialProjects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  initialProjects,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [offset, setOffset] = useState(initialProjects.length);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 6;

  // Extract unique tags from tech_stack
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tech_stack?.forEach((tech) => tags.add(tech));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((project) => project.tech_stack?.includes(selectedTag));
  }, [projects, selectedTag]);

  const loadMoreProjects = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects?limit=${PAGE_SIZE}&offset=${offset}&bypassCache=true`,
      );
      const result = await response.json();

      if (result.status === 200 && result.data) {
        const newProjects = result.data;
        if (newProjects.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setProjects((prev) => [...prev, ...newProjects]);
        setOffset((prev) => prev + newProjects.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more projects:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !selectedTag) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreProjects, hasMore, selectedTag]);

  return (
    <section id="projects" className="pt-16 xs:pt-24 lg:pt-32 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 xs:mb-16 gap-6">
        <div className="max-w-xl">
          <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
            Projects.
          </h2>
          <p className="font-body text-on-surface-variant text-base xs:text-lg">
            A selection of my recent work and applications.
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

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-6 xs:gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id || index}
            title={project.title}
            description={project.description}
            imageUrl={project.image_url}
            features={project.features}
            linkUrl={project.link_url}
            linkText={project.link_text}
            priority={index <= 1}
            slug={project.slug}
            techStack={project.tech_stack}
          />
        ))}
      </div>

      {/* Sentinel Element for Intersection Observer */}
      {!selectedTag && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-8"
        >
          {isLoading && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-medium text-zinc-400 animate-pulse uppercase tracking-widest">
                Loading More Projects
              </p>
            </div>
          )}
          {!hasMore && projects.length > 0 && (
            <div className="flex flex-col items-center gap-2 py-8">
              <div className="h-px w-12 bg-zinc-200" />
              <p className="text-zinc-400 text-sm font-medium">
                You&apos;ve reached the end
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
