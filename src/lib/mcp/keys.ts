import { createHash, randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';

export type McpScope = 'read' | 'read_write';

export const SCOPES: readonly McpScope[] = ['read', 'read_write'];

/**
 * The wp_ prefix binds a key to an environment, so a key minted in dev can never
 * authenticate against production. auth.ts rejects the wrong one.
 */
export const EXPECTED_PREFIX = env.NODE_ENV === 'production' ? 'wp_live_' : 'wp_test_';

export const PREFIX_LEN = 12;

/**
 * SHA-256, not bcrypt/argon2. The key carries 256 bits of entropy so there is nothing to
 * brute-force offline, and a slow KDF would only add latency to every MCP request.
 */
export const sha256 = (value: string): string =>
	createHash('sha256').update(value).digest('hex');

/** Returns the raw key. Callers must store only sha256(key) and show the key exactly once. */
export const generateKey = (): string => EXPECTED_PREFIX + randomBytes(32).toString('hex');

export const prefixOf = (key: string): string => key.slice(0, PREFIX_LEN);

export const isScope = (value: unknown): value is McpScope =>
	typeof value === 'string' && (SCOPES as readonly string[]).includes(value);