import { beforeEach, describe, expect, it, vi } from 'vitest';
import { McpKeyRepository } from '../../repositories/mcp_key.repository';
import { authenticateMcp } from './auth';
import { EXPECTED_PREFIX, PREFIX_LEN, sha256 } from './keys';

vi.mock('../../repositories/mcp_key.repository', () => ({
	McpKeyRepository: {
		findActiveByPrefix: vi.fn(),
		touch: vi.fn().mockResolvedValue(undefined)
	}
}));

const repo = McpKeyRepository as unknown as {
	findActiveByPrefix: ReturnType<typeof vi.fn>;
	touch: ReturnType<typeof vi.fn>;
};

const rawKey = `${EXPECTED_PREFIX}a1b2c3d4e5f6`;
const row = (overrides: Record<string, unknown> = {}) => ({
	id: 'key-1',
	token_hash: sha256(rawKey),
	scope: 'read_write',
	...overrides
});

const req = (token?: string) =>
	new Request('https://www.dimassfeb.com/mcp', {
		method: 'POST',
		headers: token ? { authorization: `Bearer ${token}` } : {}
	});

const statusOf = (result: Awaited<ReturnType<typeof authenticateMcp>>) =>
	'response' in result ? result.response.status : null;

describe('authenticateMcp', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		repo.findActiveByPrefix.mockResolvedValue(null);
	});

	it('rejects a request with no Authorization header without querying the db', async () => {
		const result = await authenticateMcp(req());
		expect(statusOf(result)).toBe(401);
		expect(repo.findActiveByPrefix).not.toHaveBeenCalled();
	});

	it('rejects a wrong-environment key before hitting the db', async () => {
		const foreign = EXPECTED_PREFIX === 'wp_live_' ? 'wp_test_abc123' : 'wp_live_abc123';
		const result = await authenticateMcp(req(`${foreign}deadbeef`));
		expect(statusOf(result)).toBe(401);
		expect(repo.findActiveByPrefix).not.toHaveBeenCalled();
	});

	it('rejects an unknown prefix', async () => {
		const result = await authenticateMcp(req(`${EXPECTED_PREFIX}zzzzzzzzzzzz`));
		expect(statusOf(result)).toBe(401);
	});

	it('rejects a revoked or missing key row', async () => {
		const result = await authenticateMcp(req(rawKey));
		expect(statusOf(result)).toBe(401);
	});

	it('rejects a hash mismatch without throwing on length', async () => {
		repo.findActiveByPrefix.mockResolvedValue(row({ token_hash: sha256('some-other-key') }));
		const result = await authenticateMcp(req(rawKey));
		expect(statusOf(result)).toBe(401);
	});

	it('rejects a truncated hash without throwing in timingSafeEqual', async () => {
		repo.findActiveByPrefix.mockResolvedValue(row({ token_hash: 'abc' }));
		const result = await authenticateMcp(req(rawKey));
		expect(statusOf(result)).toBe(401);
	});

	it('accepts a valid key and returns its identity', async () => {
		repo.findActiveByPrefix.mockResolvedValue(row());
		const result = await authenticateMcp(req(rawKey));
		expect(result).toEqual({ auth: { keyId: 'key-1', scope: 'read_write' } });
	});

	it('looks the key up by prefix and never by raw token', async () => {
		repo.findActiveByPrefix.mockResolvedValue(row());
		await authenticateMcp(req(rawKey));
		expect(repo.findActiveByPrefix).toHaveBeenCalledWith(rawKey.slice(0, PREFIX_LEN));
		expect(repo.findActiveByPrefix.mock.calls[0][0]).not.toBe(rawKey);
	});

	it('never echoes the presented token in the 401 response', async () => {
		repo.findActiveByPrefix.mockResolvedValue(null);
		const result = await authenticateMcp(req(rawKey));
		const body = await ('response' in result ? result.response : new Response('')).text();
		expect(body).not.toContain(rawKey);
		expect(body).not.toContain(sha256(rawKey));
	});

	it('sets WWW-Authenticate: Bearer on 401 per the MCP spec', async () => {
		const result = await authenticateMcp(req());
		const response = (result as { response: Response }).response;
		expect(response.headers.get('www-authenticate')).toBe('Bearer');
	});

	it('updates last_used_at fire-and-forget without blocking the call', async () => {
		repo.findActiveByPrefix.mockResolvedValue(row());
		repo.touch.mockRejectedValue(new Error('db down'));
		const result = await authenticateMcp(req(rawKey));
		expect(result).toEqual({ auth: { keyId: 'key-1', scope: 'read_write' } });
		expect(repo.touch).toHaveBeenCalledWith('key-1');
	});
});