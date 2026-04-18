import React from 'react';

interface SkillCategoryProps {
  icon: string;
  title: string;
  skills: string[];
  colorClass: string;
  delayClass?: string;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ 
  icon, 
  title, 
  skills, 
  colorClass,
  delayClass = '' 
}) => {
  return (
    <div className={`bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 hover:bg-surface-container-low transition-colors duration-300 flex flex-col h-full relative overflow-hidden group ${delayClass}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass}/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>
      <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8">
        <span className={`material-symbols-outlined ${colorClass.replace('bg-', 'text-')}`}>{icon}</span>
      </div>
      <h3 className="font-headline text-xl font-bold text-on-surface mb-6 relative z-10">{title}</h3>
      <div className="flex flex-wrap gap-3 mt-auto relative z-10">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillCategory;
