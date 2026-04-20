import React from 'react';
import Badge from '../ui/Badge';

interface HomeData {
  badge_text: string;
  headline: string;
  subheadline: string;
  description: string;
  cv_url: string;
}

interface HeroSectionProps {
  data: HomeData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <section className="min-h-[80dvh] xl:min-h-[716px] flex flex-col items-center justify-center text-center relative pt-12 overflow-hidden">
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-60"></div>
      
      <Badge className="mb-8">
        {data.badge_text}
      </Badge>
      <h1 className="font-headline text-4xl xs:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-on-surface max-w-4xl leading-[1.1] mb-8">
        <span className="sr-only">Dimas Febriyanto - </span>
        {data.headline} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{data.subheadline}</span>
      </h1>
      <p className="font-body text-base xs:text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-12 font-light">
        {data.description}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <a
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-label font-medium tracking-wide transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,62,199,0.3)] hover:-translate-y-1 active:translate-y-0"
          href="#projects"
        >
          View My Work
        </a>
        <a
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-container-highest text-on-surface font-label font-medium tracking-wide transition-all duration-300 hover:bg-surface-variant"
          href={data.cv_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
