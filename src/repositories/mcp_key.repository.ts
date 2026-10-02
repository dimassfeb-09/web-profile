import pool from '$lib/db';
import type { McpScope } from '$lib/mcp/keys';

export interface McpKeyRow {
	id: string;
	name: string;
	prefix: string;
	scope: McpScope;
	created_at: Date;
	last_used_at: Date | null;
	revoked_at: Date | null;
}

/** Auth needs token_hash, so this is deliberately separate from the display projection. */
export interface McpKeyAuthRow {
	id: string;
	token_hash: string;
	scope: McpScope;
}

export class McpKeyRepository {
	/**
	 * token_hash is never selected here: the admin UI has no reason to see it and a hash in a
	 * browser payload is one leaked response away from being crackable.
	 */
	static async findAll(): Promise<McpKeyRow[]> {
		const { rows } = await pool.query(
			`SELECT id, name, prefix, scope, created_at, last_used_at, revoked_at
			 FROM mcp_api_keys
			 ORDER BY created_at DESC`
		);
		return rows;
	}

	static async findActiveByPrefix(prefix: string): Promise<McpKeyAuthRow | null> {
		const { rows } = await pool.query(
			'SELECT id, token_hash, scope FROM mcp_api_keys WHERE prefix = $1 AND revoked_at IS NULL',
			[prefix]
		);
		return rows[0] ?? null;
	}

	static async create(
		name: string,
		prefix: string,
		tokenHash: string,
		scope: McpScope
	): Promise<McpKeyRow> {
		const { rows } = await pool.query(
			`INSERT INTO mcp_api_keys (name, prefix, token_hash, scope)
			 VALUES ($1, $2, $3, $4)
			 RETURNING id, name, prefix, scope, created_at, last_used_at, revoked_at`,
			[name, prefix, tokenHash, scope]
		);
		return rows[0];
	}

	/** Only touches rows that are still active, so revoking twice is a no-op. */
	static async revoke(prefix: string): Promise<boolean> {
		const { rowCount } = await pool.query(
			'UPDATE mcp_api_keys SET revoked_at = now() WHERE prefix = $1 AND revoked_at IS NULL',
			[prefix]
		);
		return (rowCount ?? 0) > 0;
	}

	static async touch(id: string): Promise<void> {
		await pool.query('UPDATE mcp_api_keys SET last_used_at = now() WHERE id = $1', [id]);
	}
}