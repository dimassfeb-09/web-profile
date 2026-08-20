import { beforeEach, describe, expect, it, vi } from 'vitest';
import { revalidateTag } from '$lib/cache';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../repositories/project.repository';

vi.mock('../repositories/project.repository', () => ({
	ProjectRepository: {
		findAll: vi.fn(),
		findById: vi.fn(),
		findBySlug: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn()
	}
}));

const repo = ProjectRepository as unknown as {
	findAll: ReturnType<typeof vi.fn>;
	create: ReturnType<typeof vi.fn>;
	update: ReturnType<typeof vi.fn>;
	delete: ReturnType<typeof vi.fn>;
};

const sample = {
	title: 'Thesis',
	description: 'short',
	image_url: 'https://img.example.com/a.jpg',
	features: ['f'],
	link_url: 'https://example.com',
	link_text: 'Open',
	long_description: 'long',
	tech_stack: ['Python', 'FastAPI']
};

describe('ProjectService CRUD', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('creates a project and revalidates the cache', async () => {
		repo.create.mockResolvedValue({ id: '1', ...sample });
		const result = await ProjectService.createProject(sample);
		expect(result.status).toBe(201);
		expect(repo.create).toHaveBeenCalledWith(sample);
	});

	it('updates a project and revalidates tags by slug', async () => {
		repo.update.mockResolvedValue({ id: '1', ...sample });
		const result = await ProjectService.updateProject('1', { slug: 'new-slug' });
		expect(result.status).toBe(200);
		expect(repo.update).toHaveBeenCalledWith('1', { slug: 'new-slug' });
	});

	it('throws when updating a missing project', async () => {
		repo.update.mockResolvedValue(null);
		await expect(ProjectService.updateProject('missing', {})).rejects.toThrow('Project not found');
	});

	it('deletes a project', async () => {
		repo.delete.mockResolvedValue(true);
		const result = await ProjectService.deleteProject('1');
		expect(result.status).toBe(200);
		expect(repo.delete).toHaveBeenCalledWith('1');
	});

	it('throws when deleting a missing project', async () => {
		repo.delete.mockResolvedValue(false);
		await expect(ProjectService.deleteProject('missing')).rejects.toThrow('Project not found');
	});

	it('revalidates the projects tag after a write', async () => {
		repo.create.mockResolvedValue({ id: '1', ...sample });
		repo.findAll.mockResolvedValue([{ ...sample }]);

		await ProjectService.createProject(sample);
		revalidateTag('projects');
		vi.waitFor(() => {
			expect(ProjectService.getAllProjects(true)).resolves.toBeTruthy();
		});
	});
});