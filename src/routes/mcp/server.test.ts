import { beforeEach, describe, expect, it, vi } from 'vitest';
import { McpKeyRepository } from '../../repositories/mcp_key.repository';
import { ProjectService } from '../../services/project.service';
import { POST, GET, DELETE } from './+server';
import { sha256, EXPECTED_PREFIX } from '$lib/mcp/keys';

vi.mock('../../repositories/mcp_key.repository', () => ({
	McpKeyRepository: {
		findActiveByPrefix: vi.fn(),
		touch: vi.fn().mockResolvedValue(undefined)
	}
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

const repo = McpKeyRepository as unknown as {
	findActiveByPrefix: ReturnType<typeof vi.fn>;
};
const service = ProjectService as unknown as {
	getAllProjects: ReturnType<typeof vi.fn>;
	createProject: ReturnType<typeof vi.fn>;
};

const KEY = `${EXPECTED_PREFIX}a1b2c3d4e5f6`;
const PROTOCOL = '2025-11-25';

const rpc = (method: string, params?: unknown, id: number | null = 1) => ({
	jsonrpc: '2.0',
	id,
	method,
	...(params ? { params } : {})
});

const send = (body: unknown, token: string | null = KEY) =>
	POST({
		request: new Request('https://www.dimassfeb.com/mcp', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json, text/event-stream',
				...(token ? { authorization: `Bearer ${token}` } : {})
			},
			body: JSON.stringify(body)
		})
	} as never);

/** Streamable HTTP may answer as JSON or as a single SSE frame depending on the request. */
const payload = async (response: Response) => {
	const text = await response.text();
	const body = text.startsWith('event:') || text.startsWith('data:')
		? (text.split('\n').find((line) => line.startsWith('data:')) ?? '').slice(5).trim()
		: text;
	return body ? JSON.parse(body) : null;
};

const authorizedRow = () =>
	repo.findActiveByPrefix.mockResolvedValue({ id: 'k1', token_hash: sha256(KEY), scope: 'read_write' });

describe('POST /mcp', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		repo.findActiveByPrefix.mockResolvedValue(null);
	});

	it('rejects an unauthenticated request with 401 and a Bearer challenge', async () => {
		const response = await send(rpc('initialize', {}), null);
		expect(response.status).toBe(401);
		expect(response.headers.get('www-authenticate')).toBe('Bearer');
	});

	it('rejects an unknown key without ever reaching the transport', async () => {
		const response = await send(rpc('initialize', {}), `${EXPECTED_PREFIX}ffffffffffff`);
		expect(response.status).toBe(401);
	});

	it('completes the initialize handshake', async () => {
		authorizedRow();
		const response = await send(
			rpc('initialize', {
				protocolVersion: PROTOCOL,
				capabilities: {},
				clientInfo: { name: 'test', version: '1.0.0' }
			})
		);
		expect(response.status).toBe(200);
		const body = await payload(response);
		expect(body.result.serverInfo.name).toBe('web-profile');
		expect(body.result.protocolVersion).toBe(PROTOCOL);
	});

	it('lists the CRUD + upload tools on a fresh stateless request', async () => {
		authorizedRow();
		// No initialize on this request: the server is rebuilt per request, so tools/list has
		// to work on its own. If the SDK demanded a handshake first, this would fail here.
		const response = await send(rpc('tools/list'));
		const body = await payload(response);
		expect(body.error).toBeUndefined();
		expect(body.result.tools.map((tool: { name: string }) => tool.name).sort()).toEqual([
			'create_content',
			'delete_content',
			'get_content',
			'update_content',
			'upload_image'
		]);
	});

	it('executes a tool call end to end', async () => {
		authorizedRow();
		service.getAllProjects.mockResolvedValue({ status: 200, data: [{ id: 'p1', title: 'Thesis' }] });

		const response = await send(
			rpc('tools/call', { name: 'get_content', arguments: { type: 'projects' } })
		);
		const body = await payload(response);
		expect(body.error).toBeUndefined();
		expect(body.result.isError).toBeUndefined();
		expect(body.result.content[0].text).toContain('Thesis');
	});

	it('surfaces a tool validation failure as isError rather than a protocol error', async () => {
		authorizedRow();
		const response = await send(
			rpc('tools/call', { name: 'create_content', arguments: { type: 'projects', data: {} } })
		);
		const body = await payload(response);
		expect(body.error).toBeUndefined();
		expect(body.result.isError).toBe(true);
		expect(body.result.content[0].text).toContain('Validation failed');
		expect(service.createProject).not.toHaveBeenCalled();
	});

	it('answers GET and DELETE with 405 because the transport is stateless', () => {
		for (const handler of [GET, DELETE]) {
			const response = handler();
			expect(response.status).toBe(405);
			expect(response.headers.get('allow')).toBe('POST');
		}
	});

	it('hides driver details when the database is unreachable', async () => {
		repo.findActiveByPrefix.mockRejectedValue(
			new Error('connect ECONNREFUSED postgres://user:hunter2@db:5432')
		);
		const response = await send(rpc('initialize', {}));
		expect(response.status).toBe(503);
		const body = await response.text();
		expect(body).toContain('Internal Server Error');
		expect(body).not.toContain('hunter2');
		expect(response.headers.get('content-type')).toContain('application/json');
	});
});