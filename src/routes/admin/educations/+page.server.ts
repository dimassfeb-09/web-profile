import { EducationService } from '../../../services/education.service';
import { ProjectService } from '../../../services/project.service';
import { CertificateService } from '../../../services/certificate.service';
import { AchievementService } from '../../../services/achievement.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [educationsRes, projectsRes, certificatesRes, achievementsRes] = await Promise.all([
		EducationService.getAllEducations(true),
		ProjectService.getAllProjects(true),
		CertificateService.getAllCertificates(true),
		AchievementService.getAllAchievements(true)
	]);

	const formatDate = (date: string | Date | null | undefined) => {
		if (!date) return null;
		return date instanceof Date ? date.toISOString() : date;
	};

	const mappedData = educationsRes.data.map((edu) => ({
		id: edu.id || '',
		slug: edu.slug || '',
		institution: edu.institution,
		degree: edu.degree || null,
		major: edu.major || null,
		start_date: formatDate(edu.start_date) || '',
		end_date: formatDate(edu.end_date),
		is_current: edu.is_current || false,
		description: edu.description || null,
		logo_url: edu.logo_url || null,
		location: edu.location || null,
		gpa: edu.gpa ?? null,
		gallery: edu.gallery || [],
		activities: edu.activities || [],
		project_ids: edu.project_ids || [],
		certificate_ids: edu.certificate_ids || [],
		achievement_ids: edu.achievement_ids || []
	}));

	return {
		educations: mappedData,
		projects: projectsRes.data.map((p) => ({ id: String(p.id), title: p.title })),
		certificates: certificatesRes.data.map((c) => ({ id: String(c.id), title: c.title })),
		achievements: achievementsRes.data.map((a) => ({ id: String(a.id), title: a.title }))
	};
};