import React from "react";
import { EducationService } from "@/src/services/education.service";
import { ProjectService } from "@/src/services/project.service";
import { AchievementService } from "@/src/services/achievement.service";
import { Metadata } from "next";
import EducationClient from "./EducationClient";
import { CertificateService } from "@/src/services/certificate.service";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin - Education | Dimas Febriyanto",
};

export default async function AdminEducationPage() {
  const [educationsRes, projectsRes, certificatesRes, achievementsRes] =
    await Promise.all([
      EducationService.getAllEducations(true),
      ProjectService.getAllProjects(true),
      CertificateService.getAllCertificates(true),
      AchievementService.getAllAchievements(true),
    ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <EducationClient
        initialData={educationsRes.data}
        projects={projectsRes.data.map((p: any) => ({
          id: String(p.id),
          title: p.title,
        }))}
        certificates={certificatesRes.data.map((c: any) => ({
          id: String(c.id),
          title: c.title,
        }))}
        achievements={achievementsRes.data.map((a: any) => ({
          id: String(a.id),
          title: a.title,
        }))}
      />
    </div>
  );
}
