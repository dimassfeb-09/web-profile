import { timingSafeEqual } from 'node:crypto';
import { McpKeyRepository } from '../../repositories/mcp_key.repository';
import { EXPECTED_PREFIX, PREFIX_LEN, sha256, type McpScope } from './keys';

export type { McpScope } from './keys';

export interface McpAuth {
	keyId: string;
	scope: McpScope;
}

export type McpAuthResult = { auth: McpAuth } | { response: Response };

const unauthorized = (): Response =>
	new Response(JSON.stringify({ error: 'Unauthorized' }), {
		status: 401,
		headers: { 'www-authenticate': 'Bearer', 'content-type': 'application/json' }
	});

/**
 * Validates the `Authorization: Bearer <key>` header against the mcp_api_keys table.
 *
 * Returns either the caller's identity (used by tools to enforce scope) or a 401
 * Response. The 401 body and the logs never contain the presented token.
 */
export async function authenticateMcp(request: Request): Promise<McpAuthResult> {
	const header = request.headers.get('authorization') ?? '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : '';
	if (!token.startsWith(EXPECTED_PREFIX)) return { response: unauthorized() };

	const row = await McpKeyRepository.findActiveByPrefix(token.slice(0, PREFIX_LEN));

	// The stored hash is normally a 64-char hex digest, but a corrupted or hand-edited row
	// must not crash the endpoint: timingSafeEqual throws on a length mismatch, so check
	// length first. The prefix is not secret; only the hash is compared.
	const stored = row ? Buffer.from(row.token_hash, 'utf8') : Buffer.alloc(0);
	const presented = Buffer.from(sha256(token), 'utf8');
	const matches =
		row !== null &&
		stored.byteLength === presented.byteLength &&
		timingSafeEqual(stored, presented);
	if (!matches || row === null) return { response: unauthorized() };

	// Fire-and-forget: a failure here must never block a legitimate tool call.
	// last_used_at is the leak detector - an unfamiliar timestamp means revoke.
	void McpKeyRepository.touch(row.id).catch((error) =>
		console.error('[mcp] last_used_at update failed:', error)
	);

	return { auth: { keyId: row.id, scope: row.scope } };
}