import { ProjectService } from './project.service';
import { ExperienceService } from './experience.service';
import { SkillService } from './skill.service';
import { BlogService } from './blog.service';
import { AchievementService } from './achievement.service';
import { CertificateService } from './certificate.service';

export const DashboardService = {
  async getStats() {
    // bypassCache=true for admin
    const [projects, experience, skills, blogs, achievements, certificates] = await Promise.all([
      ProjectService.getAllProjects(true),
      ExperienceService.getAllExperiences(true),
      SkillService.getAllSkills(true),
      BlogService.getAllBlogs({ bypassCache: true }),
      AchievementService.getAllAchievements(true),
      CertificateService.getAllCertificates(true)
    ]);

    return {
      projects: projects.data?.length || 0,
      experience: experience.data?.length || 0,
      skills: skills.data?.length || 0,
      blogs: blogs.blogs?.length || 0,
      achievements: achievements.data?.length || 0,
      certificates: certificates.data?.length || 0
    };
  }
};
