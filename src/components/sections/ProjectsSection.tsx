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
}

interface ProjectsSectionProps {
  initialProjects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  initialProjects,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [offset, setOffset] = useState(initialProjects.length);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 6;

  const loadMoreProjects = React.useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects?limit=${PAGE_SIZE}&offset=${offset}`);
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
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProjects();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreProjects, hasMore]);

  return (
    <section id="projects" className="pt-16 xs:pt-24 lg:pt-32 pb-12">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Projects.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          A selection of my recent work and applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-6 xs:gap-8">
        {projects.map((project, index) => (
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
          />
        ))}
      </div>

      {/* Sentinel Element for Intersection Observer */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
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
            <p className="text-zinc-400 text-sm font-medium">You've reached the end</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
