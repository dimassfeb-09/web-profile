'use client';

import React, { useState, useEffect } from 'react';
import ProjectCard from '../ui/ProjectCard';

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string; // Database field
  features: string[];
  link_url: string;
  link_text: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getColumnCount = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width >= 1536) return 4;
    if (width >= 1280) return 3;
    if (width >= 640) return 2;
    return 1;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/projects');
        const json = await res.json();
        
        if (json.status === 200) {
          setProjects(json.data);
          // Set initial visible count based on grid columns
          const cols = getColumnCount();
          // For mobile (1 col), we show 2 to have at least some content
          setVisibleCount(cols === 1 ? 2 : cols);
        } else {
          setError(json.message || 'Failed to fetch projects');
        }
      } catch (err) {
        setError('An error occurred while fetching projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLoadMore = () => {
    const cols = getColumnCount();
    const increment = cols === 1 ? 2 : cols;
    setVisibleCount(prev => Math.min(prev + increment, projects.length));
  };

  if (isLoading) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24 min-h-[400px] flex items-center justify-center" id="projects">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-body animate-pulse">Loading amazing projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24" id="projects">
        <div className="p-8 rounded-3xl bg-error/5 border border-error/10 text-center">
          <p className="text-error font-body mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-error/10 text-error rounded-full hover:bg-error/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-12 xs:pt-16 lg:pt-24" id="projects">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Featured Projects.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          A selection of my recent work and applications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-6 xs:gap-8">
        {projects.slice(0, visibleCount).map((project, index) => (
          <ProjectCard
            key={project.id || index}
            title={project.title}
            description={project.description}
            imageUrl={project.image_url} // Map image_url from DB to imageUrl prop
            features={project.features}
            linkUrl={project.link_url}
            linkText={project.link_text}
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
