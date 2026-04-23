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
    <section className="pt-12 xs:pt-16 lg:pt-24 min-h-[400px]">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Tech Stack.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          A curated set of tools, frameworks, and technologies I've worked with
          across the full development lifecycle.
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
