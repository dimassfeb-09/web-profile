import { beforeEach, describe, expect, it, vi } from 'vitest';
import { McpKeyRepository } from '../../../../repositories/mcp_key.repository';
import { GET, POST, DELETE } from './+server';
import { sha256, EXPECTED_PREFIX, PREFIX_LEN } from '$lib/mcp/keys';

vi.mock('../../../../repositories/mcp_key.repository', () => ({
	McpKeyRepository: {
		findAll: vi.fn(),
		findActiveByPrefix: vi.fn(),
		create: vi.fn(),
		revoke: vi.fn(),
		touch: vi.fn()
	}
}));

const repo = McpKeyRepository as unknown as {
	findAll: ReturnType<typeof vi.fn>;
	create: ReturnType<typeof vi.fn>;
	revoke: ReturnType<typeof vi.fn>;
};

const PREFIX = `${EXPECTED_PREFIX}a1b2`;

const row = (overrides: Record<string, unknown> = {}) => ({
	id: 'k1',
	name: 'research',
	prefix: PREFIX,
	scope: 'read',
	created_at: new Date('2026-01-02T03:04:05Z'),
	last_used_at: null,
	revoked_at: null,
	...overrides
});

const call = (
	handler: (event: never) => Promise<Response>,
	body?: Record<string, unknown>,
	method = 'POST'
) =>
	handler({
		request: new Request('https://www.dimassfeb.com/api/admin/mcp-keys', {
			method,
			headers: { 'content-type': 'application/json' },
			...(body ? { body: JSON.stringify(body) } : {})
		})
	} as never);

describe('GET /api/admin/mcp-keys', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('never exposes token_hash', async () => {
		repo.findAll.mockResolvedValue([row()]);
		const response = await call(GET as never);
		const body = await response.text();
		expect(response.status).toBe(200);
		expect(body).not.toContain('token_hash');
		expect(body).toContain(PREFIX);
	});

	it('maps revoked keys to a status flag', async () => {
		repo.findAll.mockResolvedValue([row({ revoked_at: new Date('2026-02-01T00:00:00Z') })]);
		const data = (await (await call(GET as never)).json()).data;
		expect(data[0].status).toBe('revoked');
	});

	it('reports an unreadable table as a 500 without leaking the driver error', async () => {
		repo.findAll.mockRejectedValue(new Error('connect ECONNREFUSED postgres://u:pw@host/db'));
		const response = await call(GET as never);
		expect(response.status).toBe(500);
		expect(await response.text()).not.toContain('pw@host');
	});
});

describe('POST /api/admin/mcp-keys', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		repo.create.mockImplementation(async (name: string, prefix: string) =>
			row({ name, prefix, scope: 'read' })
		);
	});

	it('returns the raw key once and stores only its hash', async () => {
		const response = await call(POST as never, { name: 'research', scope: 'read' });
		const { data } = await response.json();

		expect(response.status).toBe(201);
		expect(data.key.startsWith(EXPECTED_PREFIX)).toBe(true);

		const [, prefix, tokenHash] = repo.create.mock.calls[0];
		expect(prefix).toBe(data.key.slice(0, PREFIX_LEN));
		expect(tokenHash).toBe(sha256(data.key));
		expect(tokenHash).not.toBe(data.key);
	});

	it('generates a different key every time', async () => {
		const first = (await (await call(POST as never, { name: 'a', scope: 'read' })).json()).data.key;
		const second = (await (await call(POST as never, { name: 'a', scope: 'read' })).json()).data.key;
		expect(first).not.toBe(second);
	});

	it('rejects a missing name', async () => {
		const response = await call(POST as never, { scope: 'read' });
		expect(response.status).toBe(400);
		expect(repo.create).not.toHaveBeenCalled();
	});

	it('rejects an unknown scope', async () => {
		const response = await call(POST as never, { name: 'x', scope: 'admin' });
		expect(response.status).toBe(400);
		expect(repo.create).not.toHaveBeenCalled();
	});
});

describe('DELETE /api/admin/mcp-keys', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		repo.revoke.mockResolvedValue(true);
	});

	it('revokes an active key', async () => {
		const response = await call(DELETE as never, { prefix: PREFIX }, 'DELETE');
		expect(response.status).toBe(200);
		expect(repo.revoke).toHaveBeenCalledWith(PREFIX);
	});

	it('refuses a prefix from the wrong environment', async () => {
		const foreign = EXPECTED_PREFIX === 'wp_live_' ? 'wp_test_a1b2' : 'wp_live_a1b2';
		const response = await call(DELETE as never, { prefix: foreign }, 'DELETE');
		expect(response.status).toBe(400);
		expect(repo.revoke).not.toHaveBeenCalled();
	});

	it('refuses a malformed or overlong prefix so the UPDATE stays narrow', async () => {
		for (const prefix of ['', 'wp', `${EXPECTED_PREFIX}toolongvalue`, `${EXPECTED_PREFIX}' OR 1=1--`]) {
			const response = await call(DELETE as never, { prefix }, 'DELETE');
			expect(response.status, `should reject ${JSON.stringify(prefix)}`).toBe(400);
		}
		expect(repo.revoke).not.toHaveBeenCalled();
	});

	it('reports 404 when the key was already revoked', async () => {
		repo.revoke.mockResolvedValue(false);
		const response = await call(DELETE as never, { prefix: PREFIX }, 'DELETE');
		expect(response.status).toBe(404);
	});
});