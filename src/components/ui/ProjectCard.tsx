import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string | null;
  features: string[];
  linkUrl: string;
  linkText: string;
  priority?: boolean;
  slug?: string;
  techStack?: string[];
}

const DynamicTechStack: React.FC<{ techStack: string[] }> = ({ techStack }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(techStack.length);
  const [isCalculated, setIsCalculated] = React.useState(false);

  React.useLayoutEffect(() => {
    const calculateFit = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) return;

      const containerWidth = container.offsetWidth;
      let currentWidth = 0;
      let count = 0;
      const gap = 6; // gap-1.5 is 6px

      // First, find the "+N" element if it exists to reserve space
      const moreIndicator = children.find(child => child.dataset.more === "true");
      const moreWidth = moreIndicator ? moreIndicator.offsetWidth + gap : 40; // fallback 40px

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.dataset.more === "true") continue;

        const childWidth = child.offsetWidth + gap;
        
        // If adding this child exceeds width (leaving space for +N if not the last)
        if (currentWidth + childWidth > containerWidth - (i < techStack.length - 1 ? moreWidth : 0)) {
          break;
        }
        
        currentWidth += childWidth;
        count++;
      }

      setVisibleCount(count);
      setIsCalculated(true);
    };

    // Initial calculation
    calculateFit();

    // Recalculate on resize
    const observer = new ResizeObserver(calculateFit);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [techStack]);

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center flex-nowrap gap-1.5 mb-4 overflow-hidden min-h-[26px] ${!isCalculated ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
    >
      {techStack.slice(0, isCalculated ? visibleCount : techStack.length).map((tag, index) => (
        <span
          key={index}
          className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[10px] font-medium border border-outline-variant/10 whitespace-nowrap flex-shrink-0"
        >
          {tag}
        </span>
      ))}
      {(techStack.length > visibleCount) && (
        <span 
          data-more="true"
          className="text-[10px] text-on-surface-variant/40 whitespace-nowrap flex-shrink-0"
        >
          +{techStack.length - visibleCount}
        </span>
      )}
    </div>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  features,
  linkUrl,
  linkText,
  priority = false,
  slug,
  techStack = [],
}) => {
  const fallbackImage = "/images/project-placeholder.jpeg";
  const [imgSrc, setImgSrc] = React.useState(imageUrl || fallbackImage);

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="aspect-[1024/500] w-full bg-surface-container-high relative overflow-hidden">
        {slug ? (
          <Link
            href={`/projects/${slug}`}
            className="block w-full h-full relative"
          >
            <Image
              alt={`${title} - App Project by Dimas Febriyanto`}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              src={imgSrc}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              onError={() => setImgSrc(fallbackImage)}
            />
          </Link>
        ) : (
          <Image
            alt={`${title} - App Project by Dimas Febriyanto`}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={imgSrc}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onError={() => setImgSrc(fallbackImage)}
          />
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <DynamicTechStack techStack={techStack} />
        <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
          {title}
        </h3>
        <p className="text-on-surface-variant font-body text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="mb-8 flex-grow">
          <ul className="space-y-3">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-3 group/feat">
                <span className="material-symbols-outlined text-[18px] text-primary/60 mt-0.5 group-hover/feat:text-primary transition-colors">
                  check_circle
                </span>
                <span className="text-sm font-body text-on-surface-variant leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4">
          {slug && (
            <Link
              href={`/projects/${slug}`}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
            >
              More Detail
            </Link>
          )}
          <a
            className="inline-flex justify-center items-center py-2 px-5 rounded-full bg-on-surface text-surface font-label font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all duration-300"
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
