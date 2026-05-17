"use client";

import React from "react";
import Badge from "../ui/Badge";

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
    <section className="min-h-[85dvh] lg:min-h-[760px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-28 pb-16 relative overflow-hidden">
      <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10">
        <Badge className="mb-6">{data.badge_text}</Badge>
        <h1 className="font-headline text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
          {data.headline} <br />
          <span className="text-primary">{data.subheadline}</span>
        </h1>
        <p className="font-body text-base xs:text-lg md:text-xl text-zinc-500 max-w-xl leading-relaxed mb-10 font-light">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          <a
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-label font-bold text-center tracking-wide transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,62,199,0.25)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            href="#projects"
          >
            View My Work
          </a>
          <a
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-label font-bold text-center tracking-wide transition-all duration-300 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            href={data.cv_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </div>
      </div>

      <div className="mt-8 lg:mt-0 lg:col-span-5 relative flex items-center justify-center lg:justify-end w-full min-h-[380px] lg:min-h-[460px] group/hero-card">
        <div className="absolute right-12 top-12 w-64 h-64 bg-primary/4 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-[270px] xs:max-w-[310px] mx-auto lg:mr-16 lg:ml-auto">
          <div
            className="absolute -top-20 xs:-top-24 sm:-top-14 lg:-top-18 left-6 xs:left-8 sm:left-auto sm:-left-18 lg:-left-24 w-[125px] xs:w-[145px] p-3.5 xs:p-4.5 rounded-3xl bg-zinc-900 text-white shadow-2xl -rotate-3 xs:-rotate-6 z-10 group-hover/hero-card:rotate-[-6deg] sm:group-hover/hero-card:rotate-[-22deg] group-hover/hero-card:-translate-y-6 xs:group-hover/hero-card:-translate-y-8 sm:group-hover/hero-card:-translate-y-12 group-hover/hero-card:-translate-x-0.5 xs:group-hover/hero-card:-translate-x-1 sm:group-hover/hero-card:-translate-x-24 will-change-transform pointer-events-none"
            style={{
              transition: "transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/80 block mb-1">
              Delivered
            </span>
            <h4 className="text-2xl xs:text-3xl font-headline font-bold mb-1">
              5+
            </h4>
            <p className="text-[9px] xs:text-[10px] text-zinc-400 font-light leading-normal">
              Production-ready digital projects completed.
            </p>
          </div>

          {/* Middle Card: Availability Status (Pushed bottom-right, vertically stacked behind on mobile) */}
          <div
            className="absolute -bottom-20 xs:-bottom-24 sm:-bottom-12 lg:-bottom-16 right-6 xs:right-8 sm:right-auto sm:-left-12 lg:-left-16 w-[125px] xs:w-[145px] p-3.5 xs:p-4.5 rounded-3xl bg-white border border-zinc-200/40 text-zinc-800 shadow-xl rotate-3 xs:rotate-6 z-10 group-hover/hero-card:rotate-[6deg] sm:group-hover/hero-card:rotate-[20deg] group-hover/hero-card:translate-y-6 xs:group-hover/hero-card:translate-y-8 sm:group-hover/hero-card:translate-y-12 group-hover/hero-card:translate-x-0.5 xs:group-hover/hero-card:translate-x-1 sm:group-hover/hero-card:-translate-x-20 will-change-transform pointer-events-none"
            style={{
              transition: "transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-widest text-zinc-400">
                Available
              </span>
            </div>
            <p className="text-[10px] xs:text-xs font-bold leading-snug mb-1">
              Full-time, Freelance
            </p>
            <p className="text-[8px] xs:text-[9px] text-zinc-400 font-light leading-normal">
              Ready for opportunities.
            </p>
          </div>

          {/* Front Card: Interactive Developer Profile Mock */}
          <div
            className="w-full p-5 xs:p-6 rounded-[2rem] xs:rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-zinc-200/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-20 hover:border-zinc-300/80 hover:bg-white/90 group-hover/hero-card:-translate-y-1 group-hover/hero-card:scale-[1.02] will-change-transform"
            style={{
              transition: "transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Profile Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base shadow-sm">
                DF
              </div>
              <div>
                <h4 className="font-headline font-bold text-zinc-900 text-sm leading-tight">
                  Dimas Febriyanto
                </h4>
                <span className="text-zinc-500 font-body text-[11px] font-light">
                  Software Engineer
                </span>
              </div>
            </div>

            {/* Main Focus Areas (Clean Solid Bullets) */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-bold text-zinc-700">
                  Flutter Mobile Apps
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-bold text-zinc-700">
                  Backend Golang & PostgreSQL
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-bold text-zinc-700">
                  ReactJS & NextJS
                </span>
              </div>
            </div>

            {/* Core Skills Badges */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-100">
              <span className="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 border border-zinc-100 text-zinc-500 rounded-lg">
                Flutter
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 border border-zinc-100 text-zinc-500 rounded-lg">
                Go
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 border border-zinc-100 text-zinc-500 rounded-lg">
                NextJS
              </span>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 border border-zinc-100 text-zinc-500 rounded-lg">
                PostgreSQL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
