import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { REGISTRY, DOMAINS, SINGLETONS, isDomain, type McpData, type McpDomain } from './registry';
import type { McpAuth } from './auth';

type ToolResult = {
	content: { type: 'text'; text: string }[];
	isError?: boolean;
};

const ok = (payload: unknown): ToolResult => ({
	content: [{ type: 'text', text: JSON.stringify(payload ?? null, null, 2) }]
});

const fail = (message: string): ToolResult => ({
	isError: true,
	content: [{ type: 'text', text: message }]
});

/** An expected, client-fixable condition: reported to the model without a server error log. */
class ToolError extends Error {}

const domainShape = z.enum(DOMAINS as [McpDomain, ...McpDomain[]]);

/** Field lists come from the registry, so a schema change can never leave a stale description. */
const DOMAIN_TABLE = DOMAINS.map(
	(domain) => `- ${domain} [${REGISTRY[domain].kind}]: ${REGISTRY[domain].fields}`
).join('\n');

const SINGLETONS_NOTE = `Singletons that always exist and hold exactly one row: ${SINGLETONS.join(', ')}. For those use update_content (never create_content or delete_content) and do not pass an id.`;

const describe = (verb: string) =>
	`${verb} content on a personal profile site.\n\nDomains and their fields (? = optional):\n${DOMAIN_TABLE}\n\n${SINGLETONS_NOTE}`;

/** Field-level validation errors so the model can correct itself without extra round trips. */
const zodDetail = (error: z.ZodError): string =>
	`Validation failed:\n${error.issues
		.slice(0, 8)
		.map((issue) => `- ${issue.path.join('.') || '(root)'}: ${issue.message}`)
		.join('\n')}`;

const attempt = async (work: () => Promise<unknown>): Promise<ToolResult> => {
	try {
		return ok(await work());
	} catch (error) {
		if (error instanceof z.ZodError) return fail(zodDetail(error));
		const message = error instanceof Error ? error.message : 'Unknown error';
		if (!(error instanceof ToolError)) console.error('[mcp] tool error:', message);
		return fail(message);
	}
};

const notFound = (domain: McpDomain, id: string): never => {
	throw new ToolError(`No ${domain} record with id "${id}". Call get_content first to list valid ids.`);
};

const resolve = (value: unknown): McpDomain => {
	if (!isDomain(value)) throw new ToolError(`Unknown domain "${value}". Valid: ${DOMAINS.join(', ')}.`);
	return value;
};

const READ_ONLY = 'This key is read-only. Mutating tools are not allowed.';

export function registerTools(server: McpServer, auth: McpAuth): void {
	/** Blocks mutations for read-scoped keys and records an audit line for allowed ones. */
	const allowWrite = (tool: string, target: string): void => {
		if (auth.scope === 'read') throw new ToolError(READ_ONLY);
		console.info('[mcp]', auth.keyId, tool, target);
	};

	const entryFor = (type: unknown) => REGISTRY[resolve(type)];

	server.registerTool(
		'get_content',
		{
			title: 'Get profile content',
			description:
				describe('Read') +
				'\n\nPass id for a single record, omit it for a list, and limit to cap list size.',
			inputSchema: {
				type: domainShape,
				id: z.string().optional(),
				limit: z.number().int().positive().max(200).optional()
			}
		},
		async ({ type, id, limit }) =>
			attempt(async () => {
				const entry = entryFor(type);
				if (id !== undefined && entry.kind === 'collection') {
					const record = await entry.get(id);
					if (record === null) notFound(resolve(type), id);
					return record;
				}
				return await entry.list(limit);
			})
	);

	server.registerTool(
		'create_content',
		{
			title: 'Create profile content',
			description:
				describe('Create') +
				'\n\ndata is validated against the domain schema before insert. Returns the stored record including its generated id.',
			inputSchema: { type: domainShape, data: z.record(z.string(), z.unknown()) }
		},
		async ({ type, data }) =>
			attempt(async () => {
				const entry = entryFor(type);
				if (entry.kind === 'single') {
					throw new ToolError(`${resolve(type)} is a singleton - use update_content.`);
				}
				allowWrite('create', resolve(type));
				return await entry.create(entry.schema ? (entry.schema.parse(data) as McpData) : data);
			})
	);

	server.registerTool(
		'update_content',
		{
			title: 'Update profile content',
			description:
				describe('Update') +
				'\n\nSend only the fields you want changed; the rest are left untouched.',
			inputSchema: { type: domainShape, id: z.string(), data: z.record(z.string(), z.unknown()) }
		},
		async ({ type, id, data }) =>
			attempt(async () => {
				const entry = entryFor(type);
				allowWrite('update', `${resolve(type)}/${id}`);
				return await entry.update(id, entry.schema ? (entry.schema.parse(data) as McpData) : data);
			})
	);

	server.registerTool(
		'delete_content',
		{
			title: 'Delete profile content',
			description:
				describe('Delete') +
				'\n\nIrreversible. Read the record with get_content first and confirm with the user before calling this.',
			inputSchema: { type: domainShape, id: z.string() }
		},
		async ({ type, id }) =>
			attempt(async () => {
				const domain = resolve(type);
				const entry = entryFor(type);
				if (entry.kind === 'single') {
					throw new ToolError(`${domain} is a singleton and cannot be deleted.`);
				}
				// Gate before any read: a rejected caller should not get to probe which ids exist.
				allowWrite('delete', `${domain}/${id}`);

				const existing = await entry.get(id);
				if (existing === null) notFound(domain, id);

				await entry.remove(id);
				console.info('[mcp] removed', domain, id, JSON.stringify(existing).slice(0, 200));
				return { deleted: true, type: domain, id, record: existing };
			})
	);
}