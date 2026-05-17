"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Activity {
  title: string;
  role: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

interface Achievement {
  id: string;
  title: string;
  slug: string;
  date?: string | null;
  description?: string | null;
}

interface RelatedProject {
  id: string;
  title: string;
  slug: string;
}

interface RelatedCertificate {
  id: string;
  title: string;
  credential_url?: string | null;
}

interface Education {
  id: string;
  institution: string;
  degree?: string | null;
  major?: string | null;
  start_date: string | Date;
  end_date?: string | Date | null;
  is_current: boolean;
  description?: string | null;
  logo_url?: string | null;
  location?: string | null;
  gpa?: number | null;
  activities?: Activity[];
  achievements?: Achievement[];
  projects?: RelatedProject[];
  certificates?: RelatedCertificate[];
}

interface EducationSectionProps {
  educations: Education[];
}

export default function EducationSection({
  educations,
}: EducationSectionProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    if (!mounted) return "...";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <section id="education" className="pt-20 lg:pt-32 scroll-mt-20 relative">
      {/* Clean Section Header */}
      <div className="max-w-2xl mb-16 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-zinc-300" />
          <span className="text-zinc-400 font-semibold text-xs uppercase tracking-[0.2em]">
            Academic
          </span>
        </div>
        <h2 className="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
          Education<span className="text-primary">.</span>
        </h2>
        <p className="font-body text-zinc-500 text-base xs:text-lg leading-relaxed font-light">
          My academic journey, campus involvements, and certifications that have
          shaped my professional foundation.
        </p>
      </div>

      {/* Clean Flat Timeline Line */}
      <div className="relative border-l border-zinc-200 pl-8 ml-3 space-y-16 py-2">
        {educations.map((edu) => (
          <div key={edu.id} className="relative group">
            {/* Minimal Timeline Bullet */}
            <div className="absolute -left-[38px] top-4 w-4 h-4 rounded-full bg-white border border-zinc-300 flex items-center justify-center group-hover:border-primary transition-colors duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-primary transition-colors duration-300" />
            </div>

            <div className="flex flex-col gap-6">
              {/* Institution Header Block */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {edu.logo_url && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-white border border-zinc-200 flex-shrink-0 flex items-center justify-center p-1 shadow-sm">
                      <Image
                        src={edu.logo_url}
                        alt={edu.institution}
                        fill
                        sizes="48px"
                        className="object-contain p-0.5"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors duration-300">
                      {edu.institution}
                    </h3>
                    <p className="font-body text-sm text-zinc-600 mt-0.5 font-medium">
                      {edu.degree} {edu.major ? `in ${edu.major}` : ""}
                      {edu.gpa && (
                        <span className="text-zinc-400 font-normal ml-2.5 pl-2.5 border-l border-zinc-200">
                          GPA: {Number(edu.gpa).toFixed(2)} / 4.00
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Date & Location */}
                <div className="flex flex-row sm:flex-col sm:items-end gap-3 text-xs text-zinc-400 font-medium sm:text-right">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-zinc-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {`${formatDate(edu.start_date)} — ${edu.is_current ? "Present" : formatDate(edu.end_date)}`}
                  </span>
                  {edu.location && (
                    <span className="flex items-center gap-1.5 sm:justify-end">
                      <svg
                        className="w-3.5 h-3.5 text-zinc-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {edu.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {edu.description && (
                <p className="font-body text-zinc-500 text-sm leading-relaxed max-w-3xl font-light">
                  {edu.description}
                </p>
              )}

              {/* Minimal Clean Details Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100">
                {/* Left Column: Activities & Achievements */}
                <div className="space-y-6">
                  {/* Activities */}
                  {edu.activities && edu.activities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Activities & Involvements
                      </h4>
                      <div className="space-y-4">
                        {edu.activities.map((act, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-zinc-800 leading-tight">
                                {act.title}
                              </span>
                              <span className="text-[11px] text-zinc-400 mt-0.5">
                                {act.role}{" "}
                                {act.start_date &&
                                  `(${formatDate(act.start_date)} - ${act.end_date ? formatDate(act.end_date) : "Present"})`}
                              </span>
                              {act.description && (
                                <p className="text-xs text-zinc-400 mt-1.5 font-light leading-relaxed">
                                  {act.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Competitions & Awards
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {edu.achievements.map((ach) => (
                          <Link
                            key={ach.id}
                            href={`/achievements/${ach.slug}`}
                            target="_blank"
                            className="group/ach flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-100 hover:border-primary/20 hover:bg-zinc-50/50 transition-all duration-300"
                          >
                            <svg
                              className="w-3.5 h-3.5 text-zinc-300 group-hover/ach:text-primary transition-colors duration-300 shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-zinc-700 truncate group-hover/ach:text-primary transition-colors duration-300">
                                {ach.title}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Projects & Certificates */}
                <div className="space-y-6">
                  {/* Projects */}
                  {edu.projects && edu.projects.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Academic Outputs
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {edu.projects.map((proj) => (
                          <Link
                            key={proj.id}
                            href={`/projects/${proj.slug}`}
                            target="_blank"
                            className="group/proj flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 hover:border-primary/20 hover:bg-zinc-50/50 transition-all duration-300"
                          >
                            <span className="text-xs font-bold text-zinc-700 truncate group-hover/proj:text-primary transition-colors duration-300">
                              {proj.title}
                            </span>
                            <svg
                              className="w-3 h-3 text-zinc-300 group-hover/proj:text-primary group-hover/proj:translate-x-0.5 transition-all duration-300"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates */}
                  {edu.certificates && edu.certificates.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        Certifications
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {edu.certificates.map((cert) => (
                          <a
                            key={cert.id}
                            href={cert.credential_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cert flex items-center justify-between p-2.5 rounded-xl border border-zinc-100 hover:border-primary/20 hover:bg-zinc-50/50 transition-all duration-300"
                          >
                            <span className="text-xs font-bold text-zinc-700 truncate group-hover/cert:text-primary transition-colors duration-300">
                              {cert.title}
                            </span>
                            <svg
                              className="w-3 h-3 text-zinc-300 group-hover/cert:text-primary group-hover/cert:translate-x-0.5 transition-all duration-300"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
