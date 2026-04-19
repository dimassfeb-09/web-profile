'use client';

import React, { useState, useEffect } from 'react';
import ProjectCard from '../ui/ProjectCard';

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

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ initialProjects }) => {
  const [projects] = useState<Project[]>(initialProjects);
  const [visibleCount, setVisibleCount] = useState(6);
  const [mounted, setMounted] = useState(false);

  const getColumnCount = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width >= 1536) return 4;
    if (width >= 1280) return 3;
    if (width >= 640) return 2;
    return 1;
  };

  useEffect(() => {
    // Only set mounted and calculate columns on client
    setMounted(true);
    const cols = getColumnCount();
    setVisibleCount(cols === 1 ? 2 : cols);
  }, []); // Run once on mount

  const handleLoadMore = () => {
    const cols = getColumnCount();
    const increment = cols === 1 ? 2 : cols;
    setVisibleCount(prev => Math.min(prev + increment, projects.length));
  };

  return (
    <section className="pt-16 xs:pt-24 lg:pt-32 pb-12">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Featured Projects.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          A selection of my recent work and applications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-6 xs:gap-8">
        {(mounted ? projects.slice(0, visibleCount) : projects.slice(0, 3)).map((project, index) => (
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

      {visibleCount < projects.length && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-8 py-4 rounded-full border border-outline-variant text-on-surface font-label font-medium transition-all duration-300 hover:bg-surface-container-high hover:border-outline active:scale-95"
          >
            Load More Projects
            <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">
              expand_more
            </span>
          </button>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
