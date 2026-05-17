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
  // Map clean colors for gradient borders and accents
  const getThemeColors = (title: string, color: string) => {
    const cleanTitle = title.toLowerCase();
    let themeColor = "primary";
    let bgGlow = "bg-primary/20";
    let dotColor = "bg-primary";
    let textHover = "group-hover:text-primary";
    let shadowHover = "hover:shadow-primary/8";
    
    if (color.includes("emerald") || color.includes("green") || cleanTitle.includes("backend")) {
      themeColor = "emerald-500";
      bgGlow = "bg-emerald-500/20";
      dotColor = "bg-emerald-500";
      textHover = "group-hover:text-emerald-600";
      shadowHover = "hover:shadow-emerald-500/10";
    } else if (color.includes("blue") || cleanTitle.includes("frontend")) {
      themeColor = "blue-500";
      bgGlow = "bg-blue-500/20";
      dotColor = "bg-blue-500";
      textHover = "group-hover:text-blue-600";
      shadowHover = "hover:shadow-blue-500/10";
    } else if (color.includes("purple") || color.includes("violet") || cleanTitle.includes("mobile") || cleanTitle.includes("flutter")) {
      themeColor = "violet-500";
      bgGlow = "bg-violet-500/20";
      dotColor = "bg-violet-500";
      textHover = "group-hover:text-violet-600";
      shadowHover = "hover:shadow-violet-500/10";
    } else if (color.includes("amber") || color.includes("orange")) {
      themeColor = "amber-500";
      bgGlow = "bg-amber-500/20";
      dotColor = "bg-amber-500";
      textHover = "group-hover:text-amber-600";
      shadowHover = "hover:shadow-amber-500/10";
    }
    
    return { themeColor, bgGlow, dotColor, textHover, shadowHover };
  };

  const { themeColor, bgGlow, dotColor, textHover, shadowHover } = getThemeColors(title, colorClass);

  // SVG Icon Picker
  const renderCategoryIcon = () => {
    const cleanTitle = title.toLowerCase();
    
    if (cleanTitle.includes("mobile") || cleanTitle.includes("flutter")) {
      return (
        <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <path d="M12 18h.01" />
          <path d="M9 6h6" />
        </svg>
      );
    }
    if (cleanTitle.includes("backend") || cleanTitle.includes("go") || cleanTitle.includes("database")) {
      return (
        <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      );
    }
    if (cleanTitle.includes("frontend") || cleanTitle.includes("web") || cleanTitle.includes("react")) {
      return (
        <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    }
    
    // Default bracket/code icon for general toolings
    return (
      <svg className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  };

  return (
    <div
      className={`group relative p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-zinc-200/30 hover:border-zinc-300/80 hover:bg-white/90 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.06)] ${shadowHover} hover:-translate-y-1.5 flex flex-col h-full overflow-hidden transition-all duration-500 ${delayClass}`}
    >


      {/* Decorative Gradient Glow Sphere */}
      <div
        className={`absolute -top-16 -right-16 w-36 h-36 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full ${bgGlow} pointer-events-none`}
      />

      {/* Header Area */}
      <div className="flex items-center gap-4.5 mb-8 relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 bg-white border border-zinc-150 text-zinc-500 group-hover:text-primary flex-shrink-0`}
        >
          {renderCategoryIcon()}
        </div>
        <div>
          <h3 className={`font-headline text-xl font-bold text-zinc-900 leading-tight mb-1 transition-colors ${textHover}`}>
            {title}
          </h3>
          <div
            className={`h-1 w-8 rounded-full ${dotColor} opacity-40 group-hover:w-14 transition-all duration-500`}
          />
        </div>
      </div>

      {/* Skills list as modern interactive badges */}
      <div className="flex flex-wrap gap-2.5 mt-auto relative z-10">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="group/chip px-3.5 py-2 text-xs font-bold text-zinc-700 bg-white/80 border border-zinc-100/50 rounded-2xl shadow-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-300 select-none flex items-center gap-1.5"
          >
            {/* Tiny live status bead */}
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-50 group-hover/chip:opacity-100 group-hover/chip:animate-pulse transition-opacity`} />
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillCategory;
