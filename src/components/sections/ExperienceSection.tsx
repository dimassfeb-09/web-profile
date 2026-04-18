import React from 'react';
import ExperienceItem from '../ui/ExperienceItem';

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

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section className="pt-12 xs:pt-16 lg:pt-24 min-h-[400px]">
      <div className="mb-12 xs:mb-16">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
          Professional Journey.
        </h2>
        <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
          My experience in building and shipping software.
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
    </section>
  );
};

export default ExperienceSection;
