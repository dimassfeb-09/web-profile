import React from "react";

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
  delayClass = "",
}) => {
  // Extract text color from colorClass (e.g., bg-blue-500 -> text-blue-500)
  const textColor = colorClass.replace("bg-", "text-");
  const bgColor = colorClass.replace("bg-", "bg-"); // just to be safe

  return (
    <div
      className={`group relative p-8 rounded-[2rem] border border-zinc-200/50 bg-white hover:bg-zinc-50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col h-full overflow-hidden ${delayClass}`}
    >
      {/* Decorative Gradient Glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full ${bgColor}`}
      />

      {/* Header Area */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:rotate-6 bg-zinc-50 border border-zinc-100 flex-shrink-0`}
        >
          <span className={`material-symbols-outlined text-2xl ${textColor}`}>
            {icon}
          </span>
        </div>
        <div>
          <h3 className="font-headline text-xl font-bold text-zinc-900 leading-none mb-1">
            {title}
          </h3>
          <div
            className={`h-1 w-8 rounded-full ${bgColor} opacity-40 group-hover:w-12 transition-all duration-500`}
          />
        </div>
      </div>

      {/* Skills list as modern badges */}
      <div className="flex flex-wrap gap-2.5 mt-auto relative z-10">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-1.5 text-[13px] font-medium text-zinc-600 bg-white border border-zinc-200/50 rounded-full shadow-sm hover:border-primary/30 hover:text-primary transition-colors duration-300 select-none"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Background Accent */}
      <div className="absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
        <span
          className={`material-symbols-outlined text-8xl scale-150 rotate-12`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};

export default SkillCategory;
