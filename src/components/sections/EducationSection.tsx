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
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <section id="education" className="pt-20 lg:pt-32 scroll-mt-20">
      <div className="max-w-2xl mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-on-surface mb-4">
          Education.
        </h2>
        <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed">
          My academic journey, campus involvements, and certifications that have
          shaped my professional foundation.
        </p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:left-[19px] before:w-[1px] before:bg-outline-variant/20 before:h-full">
        {educations.map((edu) => (
          <div key={edu.id} className="relative pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-1 w-[40px] h-[40px] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary ring-8 ring-primary/5 group-hover:ring-primary/10 transition-all"></div>
            </div>

            {/* Content Card */}
            <div className="bg-surface-container-low/50 border border-outline-variant/10 rounded-[2rem] p-6 lg:p-8 transition-all hover:border-primary/20 group-hover:bg-surface-container-low">
              <div className="flex flex-col gap-6">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {edu.logo_url && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-white border border-outline-variant/10 flex-shrink-0">
                        <Image
                          src={edu.logo_url}
                          alt={edu.institution}
                          fill
                          sizes="48px"
                          className="object-contain p-1.5"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-on-surface leading-none mb-1.5">
                        {edu.institution}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {edu.degree} {edu.major ? `in ${edu.major}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider bg-surface-container-high px-3 py-1 rounded-full">
                      {formatDate(edu.start_date)} —{" "}
                      {edu.is_current ? "Present" : formatDate(edu.end_date)}
                    </span>
                    {edu.location && (
                      <span className="text-[11px] text-on-surface-variant/50 mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          location_on
                        </span>
                        {edu.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description & GPA */}
                <div className="max-w-3xl">
                  {edu.description && (
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {edu.description}
                    </p>
                  )}
                  {edu.gpa && (
                    <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                      GPA: {edu.gpa} / 4.0
                    </span>
                  )}
                </div>

                {/* Simplified 2-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-2 pt-6 border-t border-outline-variant/10">
                  {/* Left: Experience (Activities & Achievements) */}
                  <div className="space-y-6">
                    {edu.activities && edu.activities.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
                          Experience
                        </h4>
                        <div className="space-y-3">
                          {edu.activities.map((act, i) => (
                            <div key={i} className="flex flex-col">
                              <span className="text-sm font-bold text-on-surface leading-tight">
                                {act.title}
                              </span>
                              <span className="text-[11px] text-on-surface-variant/60 mt-0.5">
                                {act.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
                          Achievements
                        </h4>
                        <div className="space-y-2">
                          {edu.achievements.map((ach) => (
                            <Link
                              key={ach.id}
                              href={`/achievements/${ach.slug}`}
                              target="_blank"
                              className="group/a flex items-center gap-2 text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors"
                            >
                              <span className="w-1 h-1 rounded-full bg-primary/20 group-hover/a:bg-primary transition-colors"></span>
                              <span className="truncate">{ach.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Output (Projects & Certificates) */}
                  <div className="space-y-6">
                    {edu.projects && edu.projects.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
                          Projects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.projects.map((proj) => (
                            <Link
                              key={proj.id}
                              href={`/projects/${proj.slug}`}
                              target="_blank"
                              className="px-2.5 py-1 rounded-lg bg-surface-container-high/50 border border-outline-variant/5 text-[10px] font-medium text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all"
                            >
                              {proj.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {edu.certificates && edu.certificates.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
                          Certificates
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {edu.certificates.map((cert) => (
                            <a
                              key={cert.id}
                              href={cert.credential_url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-surface-container-high/50 border border-outline-variant/5 text-[10px] font-medium text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all"
                            >
                              {cert.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
