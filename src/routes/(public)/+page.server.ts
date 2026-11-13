import { HomeService } from ../../services/home.service;
import { SectionOrderService } from ../../services/section_order.service;
import { AboutService } from ../../services/about.service;
import { ContactService } from ../../services/contact.service;
import { SkillService } from ../../services/skill.service;
import { ExperienceService } from ../../services/experience.service;
import { ProjectService } from ../../services/project.service;
import { EducationService } from ../../services/education.service;
import { AchievementService } from ../../services/achievement.service;
import { CertificateService } from ../../services/certificate.service;
import { BlogService } from ../../services/blog.service;

export const config = {
	isr: {
		expiration: 3600
	}
};

// SSR homepage: every section is rendered server-side so crawlers / agents that
// don't run JS (curl, search indexers, AI fetchers) get the full content in the
// initial HTML instead of shimmer placeholders. Payloads mirror
// src/routes/api/section/[key]/+server.ts exactly, so the rendered output is
// identical to what SectionLoader used to fetch client-side.
const sort = 'newest' as const;

export async function load() {
	const [homeData, sectionOrderResult, aboutData, contactResult, skillsResult] = await Promise.all([
		HomeService.getHomeData(),
		SectionOrderService.getAllSections(),
		AboutService.getAboutData(),
		ContactService.getContactData(),
		SkillService.getAllSkills(),
	]);

	if (!homeData.data) {
		throw new Error('Home data not found');
	}

	const visibleSections = (sectionOrderResult.data || [])
		.filter((s) => s.is_visible)
		.sort((a, b) => a.order_index - b.order_index);

	// allSettled: one failing section must not 500 the whole homepage — it
	// renders the same "failed to load" fallback the client loader used to show.
	const [experience, projects, education, achievements, certificates, blog] =
		await Promise.allSettled([
			ExperienceService.getAllExperiences().then((r) => r.data || []),
			ProjectService.getAllProjects(false, sort).then((r) =>
				(r.data || []).map((p) => ({ ...p, tech_stack: p.tech_stack || [] }))
			),
			EducationService.getAllEducations(false, sort).then((r) =>
				(r.data || []).map((edu) => ({
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
			),
			AchievementService.getAllAchievements(false, sort).then((r) =>
				(r.data || []).map((ach) => ({
					...ach,
					id: ach.id || '',
					slug: ach.slug || '',
					image_hash: ach.image_hash || null
				}))
			),
			CertificateService.getAllCertificates(false, sort).then((r) => r.data || []),
			BlogService.getAllBlogs({ onlyPublished: true }).then((r) => r.blogs || [])
		]);

	const sections = {
		experience: experience.status === 'fulfilled' ? experience.value : [],
		projects: projects.status === 'fulfilled' ? projects.value : [],
		education: education.status === 'fulfilled' ? education.value : [],
		achievements: achievements.status === 'fulfilled' ? achievements.value : [],
		certificates: certificates.status === 'fulfilled' ? certificates.value : [],
		blog: blog.status === 'fulfilled' ? blog.value : []
	} as const;

	const failedSections: string[] = [];
	for (const [key, result] of Object.entries({
		experience,
		projects,
		education,
		achievements,
		certificates,
		blog
	})) {
		if (result.status === 'rejected') {
			console.error(`Error loading homepage section "${key}" (SSR):`, result.reason);
			failedSections.push(key);
		}
	}

	return {
		homeData: homeData.data,
		visibleSections,
		aboutData: aboutData.data,
		contactData: contactResult.data,
		skillsData: skillsResult.data || [],
		sections,
		failedSections
	};
}
