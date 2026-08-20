import { describe, expect, it } from 'vitest';
import {
	ProjectSchema,
	CertificateSchema,
	ExperienceSchema,
	AchievementSchema,
	SkillSchema,
	HomeSchema
} from '$lib/schemas/admin.schemas';

describe('ProjectSchema', () => {
	it('keeps all detail fields (no zod stripping)', () => {
		const out = ProjectSchema.parse({
			title: 't',
			description: 'short',
			image_url: 'https://img.example.com/a.jpg',
			features: ['f1'],
			link_url: 'https://example.com',
			link_text: 'Open',
			slug: 'my-project',
			long_description: 'long text',
			tech_stack: ['Python', 'FastAPI'],
			screenshots: ['https://img.example.com/s1.jpg'],
			status: 'completed',
			date: '2026-01-01',
			external_links: { GitHub: 'https://github.com/x' }
		});
		expect(out).toMatchObject({
			slug: 'my-project',
			long_description: 'long text',
			tech_stack: ['Python', 'FastAPI'],
			screenshots: ['https://img.example.com/s1.jpg'],
			status: 'completed',
			date: '2026-01-01',
			external_links: { GitHub: 'https://github.com/x' }
		});
	});

	it('rejects missing required fields', () => {
		expect(() => ProjectSchema.parse({ title: 't' })).toThrow();
	});
});

describe('CertificateSchema', () => {
	it('keeps description', () => {
		const out = CertificateSchema.parse({
			title: 'c',
			issuer: 'i',
			issue_date: '2026-01-01',
			credential_url: '',
			image_url: '',
			description: 'desc text'
		});
		expect(out.description).toBe('desc text');
	});
});

describe('ExperienceSchema', () => {
	it('keeps tags', () => {
		const out = ExperienceSchema.parse({
			role: 'dev',
			company: 'co',
			start_date: '2026-01-01',
			end_date: null,
			description: ['a', 'b'],
			tags: ['Go', 'Flutter']
		});
		expect(out.tags).toEqual(['Go', 'Flutter']);
	});

	it('allows omitting tags', () => {
		const out = ExperienceSchema.parse({
			role: 'dev',
			company: 'co',
			start_date: '2026-01-01',
			end_date: null,
			description: ['a']
		});
		expect(out.tags).toBeUndefined();
	});
});

describe('AchievementSchema', () => {
	it('keeps optional detail fields', () => {
		const out = AchievementSchema.parse({
			title: 'a',
			slug: 'my-ach',
			description: 'd',
			image_url: null,
			date: null,
			tech_stack: ['YOLO', 'PaddleOCR'],
			problem_statement: 'p',
			solution_overview: 's',
			credential_url: null
		});
		expect(out.tech_stack).toEqual(['YOLO', 'PaddleOCR']);
		expect(out.solution_overview).toBe('s');
	});

	it('rejects an invalid slug', () => {
		expect(() =>
			AchievementSchema.parse({ title: 'a', slug: 'Bad Slug!', description: 'd', image_url: null, date: null })
		).toThrow();
	});
});

describe('SkillSchema', () => {
	it('parses a full category', () => {
		const out = SkillSchema.parse({
			icon: 'code',
			title: 'Backend',
			skills: ['Go'],
			color_class: 'bg-red-500',
			delay_class: 'delay-100'
		});
		expect(out.skills).toEqual(['Go']);
	});
});

describe('HomeSchema', () => {
	it('parses valid home data', () => {
		const out = HomeSchema.parse({
			badge_text: 'hi',
			headline: 'Hello',
			subheadline: 'sub',
			description: 'desc',
			cv_url: 'https://example.com/cv.pdf'
		});
		expect(out.headline).toBe('Hello');
	});
});