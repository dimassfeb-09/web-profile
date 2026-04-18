'use client';

import React, { useState, useEffect } from 'react';

interface AboutData {
  headline: string;
  paragraphs: string[];
}

const AboutSection = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/about');
        const json = await res.json();
        
        if (json.status === 200) {
          setData(json.data);
        } else {
          setError(json.message || 'Failed to fetch about data');
        }
      } catch (err) {
        setError('An error occurred while fetching about data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-12 lg:gap-16 items-start pt-12 xs:pt-16 lg:pt-24 min-h-[400px]" id="about">
        <div className="lg:col-span-5 h-24 bg-surface-container-high rounded-2xl animate-pulse"></div>
        <div className="lg:col-span-7 h-64 bg-surface-container-high rounded-[2rem] animate-pulse"></div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="pt-12 xs:pt-16 lg:pt-24" id="about">
        <div className="p-8 rounded-3xl bg-error/5 border border-error/10 text-center">
          <p className="text-error font-body">{error || 'Data could not be loaded'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-12 lg:gap-16 items-start pt-12 xs:pt-16 lg:pt-24" id="about">
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
