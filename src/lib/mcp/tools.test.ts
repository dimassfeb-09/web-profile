import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import pool from '$lib/db';
import { ProjectService } from '../../services/project.service';
import { MediaService } from '../../services/media.service';
import { registerTools } from './tools';
import type { McpAuth } from './auth';

vi.mock('$lib/db', () => ({ default: { query: vi.fn().mockResolvedValue({ rows: [] }) } }));
vi.mock('../../services/media.service', () => ({
	MediaService: { uploadBuffer: vi.fn(), rehost: vi.fn() }
}));

vi.mock('../../services/project.service', () => ({
	ProjectService: {
		getAllProjects: vi.fn(),
		getProjectById: vi.fn(),
		getProjectBySlug: vi.fn(),
		createProject: vi.fn(),
		updateProject: vi.fn(),
		deleteProject: vi.fn()
	}
}));

type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean };
type ToolHandler = (args: Record<string, unknown>) => Promise<ToolResult>;

const service = ProjectService as unknown as {
	getAllProjects: ReturnType<typeof vi.fn>;
	getProjectById: ReturnType<typeof vi.fn>;
	createProject: ReturnType<typeof vi.fn>;
	updateProject: ReturnType<typeof vi.fn>;
	deleteProject: ReturnType<typeof vi.fn>;
};

const WRITE: McpAuth = { keyId: 'key-1', scope: 'read_write' };
const READ: McpAuth = { keyId: 'key-2', scope: 'read' };

/** registerTools only calls registerTool, so a stub server is enough to capture the handlers. */
const toolsFor = (auth: McpAuth) => {
	const tools = new Map<string, ToolHandler>();
	const stub = {
		registerTool: (name: string, _config: unknown, handler: ToolHandler) => {
			tools.set(name, handler);
		}
	} as unknown as McpServer;
	registerTools(stub, auth);
	return tools;
};

const call = async (auth: McpAuth, tool: string, args: Record<string, unknown>) => {
	const handler = toolsFor(auth).get(tool);
	if (!handler) throw new Error(`tool ${tool} not registered`);
	return await handler(args);
};

const text = (result: ToolResult) => result.content[0].text;
const validProject = {
	title: 'Thesis',
	description: 'short',
	image_url: 'https://img.example.com/a.jpg',
	features: ['f'],
	link_url: 'https://example.com',
	link_text: 'Open'
};

describe('registerTools', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(pool.query as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ rows: [] });
	});

	it('registers exactly the CRUD + upload tools', () => {
		expect([...toolsFor(WRITE).keys()].sort()).toEqual([
			'create_content',
			'delete_content',
			'get_content',
			'update_content',
			'upload_image'
		]);
	});

	it('lists projects with the requested limit', async () => {
		service.getAllProjects.mockResolvedValue({
			status: 200,
			data: [{ id: '1' }, { id: '2' }, { id: '3' }]
		});
		const result = await call(WRITE, 'get_content', { type: 'projects', limit: 2 });
		expect(result.isError).toBeUndefined();
		expect(JSON.parse(text(result))).toHaveLength(2);
	});

	it('reports a zod failure with the offending field path and does not write', async () => {
		const result = await call(WRITE, 'create_content', { type: 'projects', data: {} });
		expect(result.isError).toBe(true);
		expect(text(result)).toContain('Validation failed');
		expect(text(result)).toContain('title');
		expect(service.createProject).not.toHaveBeenCalled();
	});

	it('creates through the service with validated data', async () => {
		service.createProject.mockResolvedValue({ status: 201, data: { id: 'p1', ...validProject } });
		const result = await call(WRITE, 'create_content', { type: 'projects', data: validProject });
		expect(result.isError).toBeUndefined();
		expect(JSON.parse(text(result)).id).toBe('p1');
		expect(service.createProject).toHaveBeenCalledWith(
			expect.objectContaining({ title: 'Thesis' })
		);
	});

	it('refuses an unknown domain', async () => {
		const result = await call(WRITE, 'get_content', { type: 'nope' });
		expect(result.isError).toBe(true);
		expect(text(result)).toContain('Unknown domain');
	});

	it('refuses to create a singleton section', async () => {
		const result = await call(WRITE, 'create_content', { type: 'home', data: validProject });
		expect(result.isError).toBe(true);
		expect(text(result)).toContain('singleton');
	});

	it('blocks every mutation for a read-scoped key', async () => {
		for (const [tool, args] of [
			['create_content', { type: 'projects', data: validProject }],
			['update_content', { type: 'projects', id: 'p1', data: { title: 'x' } }],
			['delete_content', { type: 'projects', id: 'p1' }],
			['upload_image', { image_url: 'https://example.com/a.jpg', bucket: 'projects' }]
		] as const) {
			const result = await call(READ, tool, args);
			expect(result.isError, `${tool} should be blocked`).toBe(true);
			expect(text(result)).toContain('read-only');
		}
		expect(service.createProject).not.toHaveBeenCalled();
		expect(service.updateProject).not.toHaveBeenCalled();
		expect(service.deleteProject).not.toHaveBeenCalled();
	});

	it('rejects a read-scoped delete before reading the record', async () => {
		service.getProjectById.mockResolvedValue({ status: 200, data: { id: 'p1' } });
		await call(READ, 'delete_content', { type: 'projects', id: 'p1' });
		expect(service.getProjectById).not.toHaveBeenCalled();
	});

	it('reports a missing id as a not-found error without deleting anything', async () => {
		service.getProjectById.mockResolvedValue({ status: 404, message: 'Project not found', data: null });
		const result = await call(WRITE, 'delete_content', { type: 'projects', id: 'ghost' });
		expect(result.isError).toBe(true);
		expect(text(result)).toContain('No projects record with id "ghost"');
		expect(service.deleteProject).not.toHaveBeenCalled();
	});

	it('returns the deleted record so the caller can see what was removed', async () => {
		const existing = { id: 'p1', title: 'Thesis' };
		service.getProjectById.mockResolvedValue({ status: 200, data: existing });
		service.deleteProject.mockResolvedValue({ status: 200, message: 'ok' });

		const result = await call(WRITE, 'delete_content', { type: 'projects', id: 'p1' });
		expect(result.isError).toBeUndefined();
		expect(service.deleteProject).toHaveBeenCalledWith('p1');
		expect(JSON.parse(text(result))).toMatchObject({
			deleted: true,
			id: 'p1',
			record: existing
		});
	});

	it('validates update payloads before touching the service', async () => {
		const result = await call(WRITE, 'update_content', {
			type: 'projects',
			id: 'p1',
			data: { image_url: 'not-a-url' }
		});
		expect(result.isError).toBe(true);
		expect(text(result)).toContain('image_url');
		expect(service.updateProject).not.toHaveBeenCalled();
	});

	it('rehosts an image via MediaService and returns the public url', async () => {
		const media = MediaService as unknown as { rehost: ReturnType<typeof vi.fn> };
		media.rehost.mockResolvedValue({ url: 'https://cdn.example.com/projects/1.avif', hash: 'a1b2c3d4', format: 'avif' });
		const result = await call(WRITE, 'upload_image', { image_url: 'https://example.com/photo.jpg', bucket: 'projects' });
		expect(result.isError).toBeUndefined();
		expect(JSON.parse(text(result)).url).toContain('avif');
		expect(media.rehost).toHaveBeenCalledWith('https://example.com/photo.jpg', 'projects');
	});

	it('blocks upload_image for a read-scoped key before fetching', async () => {
		const media = MediaService as unknown as { rehost: ReturnType<typeof vi.fn> };
		const result = await call(READ, 'upload_image', { image_url: 'https://example.com/photo.jpg', bucket: 'projects' });
		expect(result.isError).toBe(true);
		expect(text(result)).toContain('read-only');
		expect(media.rehost).not.toHaveBeenCalled();
	});
});