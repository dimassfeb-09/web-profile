import { json } from '@sveltejs/kit';
import { AboutService } from '../../../../services/about.service';
import { SkillService } from '../../../../services/skill.service';
import { ExperienceService } from '../../../../services/experience.service';
import { ProjectService } from '../../../../services/project.service';
import { EducationService } from '../../../../services/education.service';
import { AchievementService } from '../../../../services/achievement.service';
import { CertificateService } from '../../../../services/certificate.service';
import { BlogService } from '../../../../services/blog.service';

const sort = 'newest' as const;

const handlers: Record<string, () => Promise<{ data: unknown }>> = {
	about: async () => {
		const r = await AboutService.getAboutData();
		return { data: r.data };
	},
	skills: async () => {
		const r = await SkillService.getAllSkills();
		return { data: r.data || [] };
	},
	experience: async () => {
		const r = await ExperienceService.getAllExperiences();
		return { data: r.data || [] };
	},
	projects: async () => {
		const r = await ProjectService.getAllProjects(false, sort);
		return {
			data: (r.data || []).map((p) => ({ ...p, tech_stack: p.tech_stack || [] }))
		};
	},
	education: async () => {
		const r = await EducationService.getAllEducations(false, sort);
		return {
			data: (r.data || []).map((edu) => ({
				...edu,
				id: edu.id || '',
				degree: edu.degree || null,
				major: edu.major || null,
				description: edu.description || null,
				logo_url: edu.logo_url || null,
				location: edu.location || null,
				gpa: edu.gpa || null,
				projects: edu.projects || [],
				certificates: edu.certificates || []
			}))
		};
	},
	achievements: async () => {
		const r = await AchievementService.getAllAchievements(false, sort);
		return {
			data: (r.data || []).map((ach) => ({
				...ach,
				id: ach.id || '',
				slug: ach.slug || '',
				image_hash: ach.image_hash || null
			}))
		};
	},
	certificates: async () => {
		const r = await CertificateService.getAllCertificates(false, sort);
		return { data: r.data || [] };
	},
	blog: async () => {
		const r = await BlogService.getAllBlogs({ onlyPublished: true });
		return { data: r.blogs || [] };
	}
};

export async function GET({ params }) {
	const handler = handlers[params.key];
	if (!handler) {
		return json({ status: 404, message: 'Unknown section', data: null }, { status: 404 });
	}
	try {
		const { data } = await handler();
		return json({ status: 200, message: 'OK', data });
	} catch (err) {
		console.error(`Error loading section "${params.key}":`, err);
		return json({ status: 500, message: 'Failed to load section', data: null }, { status: 500 });
	}
}