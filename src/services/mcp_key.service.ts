import { McpKeyRepository } from '../repositories/mcp_key.repository';
import { generateKey, isScope, prefixOf, sha256, type McpScope } from '$lib/mcp/keys';

export interface McpKeyView {
	id: string;
	name: string;
	prefix: string;
	scope: McpScope;
	created_at: string;
	last_used_at: string | null;
	revoked_at: string | null;
	status: 'active' | 'revoked';
}

const toView = (row: {
	id: string;
	name: string;
	prefix: string;
	scope: McpScope;
	created_at: Date;
	last_used_at: Date | null;
	revoked_at: Date | null;
}): McpKeyView => ({
	id: row.id,
	name: row.name,
	prefix: row.prefix,
	scope: row.scope,
	created_at: row.created_at?.toISOString() ?? '',
	last_used_at: row.last_used_at?.toISOString() ?? null,
	revoked_at: row.revoked_at?.toISOString() ?? null,
	status: row.revoked_at ? 'revoked' : 'active'
});

export class McpKeyService {
	static async listKeys(): Promise<McpKeyView[]> {
		return (await McpKeyRepository.findAll()).map(toView);
	}

	/**
	 * Mints a key and returns the raw value. Only the SHA-256 hash is persisted, so this is
	 * the single moment the caller can read the key - the UI must show it immediately and
	 * must never ask for it again.
	 */
	static async mintKey(name: string, scope: McpScope): Promise<McpKeyView & { key: string }> {
		const key = generateKey();
		const row = await McpKeyRepository.create(name, prefixOf(key), sha256(key), scope);
		return { ...toView(row), key };
	}

	static async revokeKey(prefix: string): Promise<boolean> {
		return await McpKeyRepository.revoke(prefix);
	}

	/** Name is the client identity, so last_used_at is attributable; keep it short and unique-ish. */
	static validate(name: unknown, scope: unknown): { name: string; scope: McpScope } {
		if (typeof name !== 'string' || name.trim().length === 0) {
			throw new Error('Name is required');
		}
		if (name.length > 60) {
			throw new Error('Name must be 60 characters or fewer');
		}
		if (!isScope(scope)) {
			throw new Error('Scope must be "read" or "read_write"');
		}
		return { name: name.trim(), scope };
	}
}