import React from 'react';

interface AboutData {
  headline: string;
  paragraphs: string[];
}

interface AboutSectionProps {
  data: AboutData;
}

const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-12 lg:gap-16 items-start pt-12 xs:pt-16 lg:pt-24">
      <div className="lg:col-span-5 lg:sticky lg:top-32">
        <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6">
          {data.headline}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
      </div>
      <div className="lg:col-span-7 bg-surface-container-lowest p-6 xs:p-8 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] border border-outline-variant/10 group hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
        <div className="prose prose-base xs:prose-lg text-on-surface-variant font-body leading-relaxed max-w-none">
          {data.paragraphs.map((para, index) => (
            <p key={index} className={index < data.paragraphs.length - 1 ? 'mb-6' : ''}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
