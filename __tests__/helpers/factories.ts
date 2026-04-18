import { AchievementData } from '@/src/repositories/achievement.repository';
import { CertificateData } from '@/src/repositories/certificate.repository';
import { ProjectData } from '@/src/repositories/project.repository';
import { SkillCategoryData } from '@/src/repositories/skill.repository';
import { ExperienceData } from '@/src/repositories/experience.repository';
import { AboutData } from '@/src/repositories/about.repository';
import { ContactData } from '@/src/repositories/contact.repository';
import { HomeData } from '@/src/repositories/home.repository';
import { AdminData } from '@/src/repositories/admin.repository';

export const createAchievementData = (overrides?: Partial<AchievementData>): AchievementData => ({
  title: 'Default Achievement Title',
  description: 'Default description.',
  image_url: 'https://example.com/image.jpg',
  date: 'Januari 2025',
  ...overrides,
});

export const createCertificateData = (overrides?: Partial<CertificateData>): CertificateData => ({
  title: 'Default Certificate Title',
  issuer: 'Default Issuer',
  issue_date: 'Maret 2024',
  credential_url: 'https://example.com/cert',
  image_url: null,
  ...overrides,
});

export const createProjectData = (overrides?: Partial<ProjectData>): ProjectData => ({
  title: 'Default Project',
  description: 'Project description.',
  image_url: 'https://example.com/project.jpg',
  features: ['Feature 1', 'Feature 2'],
  link_url: 'https://github.com/dimassfeb',
  link_text: 'View Code',
  ...overrides,
});

export const createSkillCategoryData = (overrides?: Partial<SkillCategoryData>): SkillCategoryData => ({
  icon: 'Code',
  title: 'Backend',
  skills: ['Node.js', 'PostgreSQL'],
  color_class: 'blue',
  delay_class: 'delay-1',
  ...overrides,
});

export const createExperienceData = (overrides?: Partial<ExperienceData>): ExperienceData => ({
  role: 'Software Engineer',
  company: 'Tech Corp',
  start_date: '2022-01-01',
  end_date: null,
  description: ['Build clean architecture', 'Optimize SQL'],
  ...overrides,
});

export const createAboutData = (overrides?: Partial<AboutData>): AboutData => ({
  headline: 'Who I Am',
  paragraphs: ['Paragraph 1', 'Paragraph 2'],
  ...overrides,
});

export const createContactData = (overrides?: Partial<ContactData>): ContactData => ({
  headline: "Let's Connect",
  description: 'Reach out to me.',
  email: 'dimas@example.com',
  linkedin_url: 'https://linkedin.com/in/dimassfeb',
  ...overrides,
});

export const createHomeData = (overrides?: Partial<HomeData>): HomeData => ({
  badge_text: 'Available for hire',
  headline: "Hi, I'm Dimas",
  subheadline: 'Software Engineer',
  description: 'Building modern web apps.',
  cv_url: 'https://example.com/cv.pdf',
  ...overrides,
});

export const createAdminData = (overrides?: Partial<AdminData>): AdminData => ({
  id: 1,
  email: 'admin@example.com',
  password: 'hashed-password',
  ...overrides,
});
