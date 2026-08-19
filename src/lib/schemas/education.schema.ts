import { z } from 'zod';

export const EducationActivitySchema = z.object({
  title: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const EducationAchievementSchema = z.object({
  title: z.string().min(1).max(255),
  date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const EducationGallerySchema = z.object({
  url: z.string().url(),
  caption: z.string().nullable().optional(),
  type: z.enum(['image', 'video']).default('image'),
});

export const EducationSchema = z.object({
  institution: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug only contains lowercase, numbers and hyphens'),
  degree: z.string().max(100).nullable().optional(),
  major: z.string().max(255).nullable().optional(),
  start_date: z.string().min(1),
  end_date: z.string().nullable().optional(),
  is_current: z.boolean().default(false),
  description: z.string().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  gpa: z.number().min(0).max(4).nullable().optional(),
  gallery: z.array(EducationGallerySchema).default([]),
  activities: z.array(EducationActivitySchema).default([]),
  project_ids: z.array(z.string()).default([]),
  certificate_ids: z.array(z.string()).default([]),
  achievement_ids: z.array(z.string()).default([]),
});

export type EducationInput = z.infer<typeof EducationSchema>;
export type EducationActivityInput = z.infer<typeof EducationActivitySchema>;
export type EducationAchievementInput = z.infer<typeof EducationAchievementSchema>;
export type EducationGalleryInput = z.infer<typeof EducationGallerySchema>;
