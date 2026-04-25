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
    <section id="skills" className="relative pt-12 xs:pt-16 lg:pt-24">
      {/* Full-width background breakout container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 w-screen left-1/2 -translate-x-1/2">
        {/* Decorative background glow - now truly full-width */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative mb-16 xs:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary/40" />
          <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Expertise</span>
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
