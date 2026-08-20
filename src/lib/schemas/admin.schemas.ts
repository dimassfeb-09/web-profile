import { z } from 'zod';

export const ProjectSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().min(1),
	image_url: z.string().url(),
	features: z.array(z.string()),
	link_url: z.string().url(),
	link_text: z.string().min(1),
	slug: z.string().max(255).optional(),
	long_description: z.string().optional(),
	tech_stack: z.array(z.string()).optional(),
	screenshots: z.array(z.string()).optional(),
	status: z.string().optional(),
	date: z.string().nullable().optional(),
	external_links: z.record(z.string(), z.string()).nullable().optional(),
});

export const CertificateSchema = z.object({
	title: z.string().min(1).max(255),
	issuer: z.string().min(1).max(255),
	issue_date: z.string().nullable(),
	credential_url: z.string().url().nullable().or(z.literal('')),
	image_url: z.string().url().nullable().or(z.literal('')),
	description: z.string().optional(),
});

export const ExperienceSchema = z.object({
	role: z.string().min(1).max(200),
	company: z.string().min(1).max(200),
	start_date: z.string().min(1),
	end_date: z.string().nullable(),
	description: z.array(z.string().min(1)),
	tags: z.array(z.string()).optional(),
});

export const AchievementSchema = z.object({
	title: z.string().min(1).max(255),
	slug: z
		.string()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9-]+$/, 'Slug only contains lowercase, numbers and hyphens'),
	description: z.string().min(1),
	image_url: z.string().url().nullable(),
	date: z.string().nullable(),
	event_organizer: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	team_members: z.array(z.string()).nullable().optional(),
	tech_stack: z.array(z.string()).nullable().optional(),
	problem_statement: z.string().nullable().optional(),
	solution_overview: z.string().nullable().optional(),
	credential_url: z.string().url().nullable().optional(),
	image_hash: z.string().nullable().optional(),
});

export const SkillSchema = z.object({
	icon: z.string().min(1),
	title: z.string().min(1).max(100),
	skills: z.array(z.string().min(1)),
	color_class: z.string().min(1),
	delay_class: z.string().min(1),
});

export const HomeSchema = z.object({
	badge_text: z.string().min(1).max(100),
	headline: z.string().min(1),
	subheadline: z.string().min(1),
	description: z.string().min(1),
	cv_url: z.string().url(),
});