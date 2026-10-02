import { z } from 'zod';
import { HomeService } from '../../services/home.service';
import { AboutService } from '../../services/about.service';
import { ContactService } from '../../services/contact.service';
import { ProjectService } from '../../services/project.service';
import { AchievementService } from '../../services/achievement.service';
import { EducationService } from '../../services/education.service';
import { ExperienceService } from '../../services/experience.service';
import { SkillService } from '../../services/skill.service';
import { CertificateService } from '../../services/certificate.service';
import { BlogService } from '../../services/blog.service';
import {
	HomeSchema,
	ProjectSchema,
	AchievementSchema,
	ExperienceSchema,
	SkillSchema,
	CertificateSchema
} from '$lib/schemas/admin.schemas';
import { EducationSchema } from '$lib/schemas/education.schema';

export type McpDomain =
	| 'home'
	| 'about'
	| 'contact'
	| 'projects'
	| 'achievements'
	| 'educations'
	| 'experience'
	| 'skills'
	| 'certificates'
	| 'blog';

export type McpData = Record<string, unknown>;

export interface McpEntry {
	/** 'single' domains (home/about/contact) hold one row: no create, no delete, no id. */
	kind: 'single' | 'collection';
	/** Field list for the tool description, derived from the schema so it cannot drift. */
	fields: string;
	/** null when the admin API has no schema for this domain (about/contact/blog). */
	schema: z.ZodType | null;
	list(limit?: number): Promise<unknown[]>;
	get(id: string): Promise<unknown>;
	create(data: McpData): Promise<unknown>;
	update(id: string, data: McpData): Promise<unknown>;
	remove(id: string): Promise<void>;
}

/** Most services answer with a {status,message,data} envelope; blog answers with the raw row. */
const unwrap = (result: unknown): unknown =>
	result !== null && typeof result === 'object' && 'status' in result && 'data' in result
		? (result as { data: unknown }).data
		: result;

/** Pull just the rows out of whichever shape a service returns. */
const rows = async (result: unknown): Promise<unknown[]> => {
	const value = unwrap(result);
	return Array.isArray(value) ? value : [];
};

const cap = (list: unknown[], limit?: number): unknown[] =>
	limit === undefined ? list : list.slice(0, limit);

/** Field names straight from the zod shape, `?` marking optional. Public API only. */
const describeShape = (schema: z.ZodType | null): string => {
	const shape = (schema as z.ZodObject<z.ZodRawShape> | null)?.shape;
	if (!shape) return "unvalidated - use the service's own field names";
	return Object.keys(shape)
		.map((key) => `${key}${(shape[key] as z.ZodType).safeParse(undefined).success ? '?' : ''}`)
		.join(', ');
};

const single = (
	schema: z.ZodType | null,
	read: () => Promise<unknown>,
	write: (data: McpData) => Promise<unknown>
): McpEntry => ({
	kind: 'single',
	fields: describeShape(schema),
	schema,
	list: async () => [unwrap(await read())],
	get: async () => unwrap(await read()),
	create: async () => {
		throw new Error('This section is a singleton and always exists - use update_content instead.');
	},
	update: async (_id, data) => await write(data),
	remove: async () => {
		throw new Error('This section is a singleton and cannot be deleted.');
	}
});

/** Domains with no getById service (experience, skills) resolve an id against their list. */
const resolveById = async (list: () => Promise<unknown[]>, id: string): Promise<unknown> =>
	(await list()).find((row) => String((row as { id?: unknown } | null)?.id) === id) ?? null;

const listProjects = async (): Promise<unknown[]> => rows(await ProjectService.getAllProjects());
const listAchievements = async (): Promise<unknown[]> =>
	rows(await AchievementService.getAllAchievements());
const listEducations = async (): Promise<unknown[]> => rows(await EducationService.getAllEducations());
const listExperience = async (): Promise<unknown[]> => rows(await ExperienceService.getAllExperiences());
const listSkills = async (): Promise<unknown[]> => rows(await SkillService.getAllSkills());
const listCertificates = async (): Promise<unknown[]> =>
	rows(await CertificateService.getAllCertificates());

export const REGISTRY = {
	home: single(
		HomeSchema,
		async () => await HomeService.getHomeData(),
		async (data) => await HomeService.updateHomeData(data as never)
	),
	about: single(
		null,
		async () => await AboutService.getAboutData(),
		async (data) => await AboutService.updateAboutData(data as never)
	),
	contact: single(
		null,
		async () => await ContactService.getContactData(),
		async (data) => await ContactService.updateContactData(data as never)
	),

	projects: {
		kind: 'collection',
		fields: describeShape(ProjectSchema),
		schema: ProjectSchema,
		list: async (limit) => cap(await listProjects(), limit),
		get: async (id) => unwrap(await ProjectService.getProjectById(id)),
		create: async (data) => unwrap(await ProjectService.createProject(data as never)),
		update: async (id, data) => unwrap(await ProjectService.updateProject(id, data as never)),
		remove: async (id) => {
			await ProjectService.deleteProject(id);
		}
	},

	achievements: {
		kind: 'collection',
		fields: describeShape(AchievementSchema),
		schema: AchievementSchema,
		list: async (limit) => cap(await listAchievements(), limit),
		get: async (id) => unwrap(await AchievementService.getAchievementById(id)),
		create: async (data) => unwrap(await AchievementService.createAchievement(data as never)),
		update: async (id, data) => unwrap(await AchievementService.updateAchievement(id, data as never)),
		remove: async (id) => {
			await AchievementService.deleteAchievement(id);
		}
	},

	educations: {
		kind: 'collection',
		fields: describeShape(EducationSchema),
		schema: EducationSchema,
		list: async (limit) => cap(await listEducations(), limit),
		get: async (id) => unwrap(await EducationService.getEducationById(id)),
		create: async (data) => unwrap(await EducationService.createEducation(data as never)),
		update: async (id, data) => unwrap(await EducationService.updateEducation(id, data as never)),
		remove: async (id) => {
			await EducationService.deleteEducation(id);
		}
	},

	experience: {
		kind: 'collection',
		fields: describeShape(ExperienceSchema),
		schema: ExperienceSchema,
		list: async (limit) => cap(await listExperience(), limit),
		get: async (id) => await resolveById(listExperience, id),
		create: async (data) => unwrap(await ExperienceService.createExperience(data as never)),
		update: async (id, data) =>
			unwrap(await ExperienceService.updateExperience(Number(id), data as never)),
		remove: async (id) => {
			await ExperienceService.deleteExperience(Number(id));
		}
	},

	skills: {
		kind: 'collection',
		fields: describeShape(SkillSchema),
		schema: SkillSchema,
		list: async (limit) => cap(await listSkills(), limit),
		get: async (id) => await resolveById(listSkills, id),
		create: async (data) => unwrap(await SkillService.createSkill(data as never)),
		update: async (id, data) =>
			unwrap(await SkillService.updateSkill(Number(id), data as never)),
		remove: async (id) => {
			await SkillService.deleteSkill(Number(id));
		}
	},

	certificates: {
		kind: 'collection',
		fields: describeShape(CertificateSchema),
		schema: CertificateSchema,
		list: async (limit) => cap(await listCertificates(), limit),
		get: async (id) => unwrap(await CertificateService.getCertificateById(id)),
		create: async (data) => unwrap(await CertificateService.createCertificate(data as never)),
		update: async (id, data) =>
			unwrap(await CertificateService.updateCertificate(id, data as never)),
		remove: async (id) => {
			await CertificateService.deleteCertificate(id);
		}
	},

	blog: {
		kind: 'collection',
		// ponytail: no schema here, matching the admin API. `content` must be Tiptap
		// JSONContent - authoring rich text through MCP is the weak spot, not validation.
		fields: describeShape(null),
		schema: null,
		list: async (limit) => cap((await BlogService.getAllBlogs({ limit: limit ?? 50 })).blogs, limit),
		get: async (id) => await BlogService.getBlogById(id),
		create: async (data) => await BlogService.createBlog(data as never),
		update: async (id, data) => await BlogService.updateBlog(id, data as never),
		remove: async (id) => {
			const ok = await BlogService.deleteBlog(id);
			if (!ok) throw new Error('Blog post not found');
		}
	}
} satisfies Record<McpDomain, McpEntry>;

export const DOMAINS = Object.keys(REGISTRY) as McpDomain[];

export const SINGLETONS = DOMAINS.filter((domain) => REGISTRY[domain].kind === 'single');

export const isDomain = (value: unknown): value is McpDomain =>
	typeof value === 'string' && Object.hasOwn(REGISTRY, value);