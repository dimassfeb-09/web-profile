"use client";

import React from "react";
import SkillCategory from "../ui/SkillCategory";

interface Category {
  id?: number;
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}

interface SkillsSectionProps {
  categories: Category[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  return (
    <section
      id="skills"
      className="relative pt-12 xs:pt-16 lg:pt-24 scroll-mt-20"
    >

      <div className="relative mb-12 sm:mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary/40" />
          <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">
            Expertise
          </span>
        </div>
        <h2 className="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
          Tech Stack<span className="text-primary">.</span>
        </h2>
        <p className="font-body text-zinc-500 text-lg xs:text-xl max-w-2xl leading-relaxed">
          A curated set of tools, frameworks, and technologies I use to build
          high-performance digital experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xs:gap-8">
        {categories.map((cat, index) => (
          <div
            key={cat.id || index}
            className="transition-all duration-500 animate-scale-up"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <SkillCategory
              icon={cat.icon}
              title={cat.title}
              skills={cat.skills}
              colorClass={cat.color_class}
              delayClass={cat.delay_class}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
