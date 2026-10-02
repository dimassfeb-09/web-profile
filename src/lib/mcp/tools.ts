import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { REGISTRY, DOMAINS, SINGLETONS, isDomain, type McpData, type McpDomain } from './registry';
import type { McpAuth } from './auth';
import { ALLOWED_BUCKETS } from '$lib/upload';
import { MediaService } from '../../services/media.service';

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

const SINGLETONS_NOTE = `Singletons (${SINGLETONS.join(', ')}) hold exactly one row: use update_content with no id (or id omitted) and never create/delete. Collections hold many rows and require an id for get/update/delete.`;

const WORKFLOW = `Workflow: get_content (list) to discover ids -> create/update/delete with the right id -> get_content (by id) to verify. Always read before you write or delete.`;

const EXAMPLES = [
	`Example get:  {"type":"projects","limit":5} or {"type":"projects","id":"<uuid>"} or {"type":"home"}`,
	`Example create (projects): {"type":"projects","data":{"title":"My App","description":"Short blurb","image_url":"https://.../cover.jpg","features":["Fast","Offline"],"link_url":"https://example.com","link_text":"Visit"}}`,
	`Example update (home singleton, no id): {"type":"home","data":{"headline":"New headline"}}`,
	`Example update (collection): {"type":"certificates","id":"<uuid>","data":{"title":"New title"}}`,
	`Example delete: {"type":"blog","id":"<uuid>"}`
].join('\n');

const describe = (verb: string, extra: string) =>
	`${verb} content on dimassfeb.com (personal profile CMS).\n\nDomains and fields (? = optional):\n${DOMAIN_TABLE}\n\n${SINGLETONS_NOTE}\n${WORKFLOW}\n\n${EXAMPLES}\n\n${extra}`;

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
			description: describe(
				'Read',
				'Pass id for a single collection record, omit id for a list. For singletons omit id (limit is ignored). `limit` caps list size (max 200). `experience` and `skills` ids are numeric strings.'
			),
			inputSchema: {
				type: domainShape.describe('Domain to read. Singletons: home, about, contact. Collections: projects, achievements, educations, experience, skills, certificates, blog.'),
				id: z.string().optional().describe('Record id. Omit for list/singleton. For experience/skills use numeric string like "3".'),
				limit: z.number().int().positive().max(200).optional().describe('Max rows for list. Ignored for singleton or single-record fetch.')
			},
			annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
		},
		async ({ type, id, limit }) =>
			attempt(async () => {
				const entry = entryFor(type);
				if (entry.kind === 'single') return await entry.list(limit);
				if (id !== undefined) {
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
			description: describe(
				'Create',
				'Only for collections. `data` is validated against the domain schema before insert. Returns the stored record with its generated id. Singletons reject create — use update_content.'
			),
			inputSchema: {
				type: domainShape.describe('Collection domain to insert into.'),
				data: z.record(z.string(), z.unknown()).describe('Fields for the new record. Must satisfy the domain schema shown above.')
			},
			annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false }
		},
		async ({ type, data }) =>
			attempt(async () => {
				const entry = entryFor(type);
				if (entry.kind === 'single') {
					throw new ToolError(`${resolve(type)} is a singleton — use update_content without an id.`);
				}
				allowWrite('create', resolve(type));
				return await entry.create(entry.schema ? (entry.schema.parse(data) as McpData) : data);
			})
	);

	server.registerTool(
		'update_content',
		{
			title: 'Update profile content',
			description: describe(
				'Update',
				'For singletons omit id (or pass any string, it is ignored). For collections id is required. `data` is a partial patch — only the fields you send are changed, the rest are left untouched. Validated against the domain schema.'
			),
			inputSchema: {
				type: domainShape,
				id: z.string().optional().describe('Record id. Required for collections, omit for singletons (home/about/contact).'),
				data: z.record(z.string(), z.unknown()).describe('Partial fields to patch.')
			},
			annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false }
		},
		async ({ type, id, data }) =>
			attempt(async () => {
				const domain = resolve(type);
				const entry = entryFor(type);
				if (entry.kind === 'single') {
					allowWrite('update', domain);
					return await entry.update(id ?? '1', entry.schema ? (entry.schema.parse(data) as McpData) : data);
				}
				if (!id) throw new ToolError(`Missing id for ${domain}. Call get_content first to list valid ids.`);
				allowWrite('update', `${domain}/${id}`);
				return await entry.update(id, entry.schema ? (entry.schema.parse(data) as McpData) : data);
			})
	);

	server.registerTool(
		'upload_image',
		{
			title: 'Re-host an image to Supabase',
			description:
				`Fetch a remote image_url server-side, validate (${ALLOWED_BUCKETS.join(', ')} buckets, 5MB, magic bytes), convert to AVIF (65q) and store to Supabase. Returns {url, hash, format}. Use the returned url as image_url in create/update_content. No base64 in JSON — avoids token bloat.\n\nBuckets: ${ALLOWED_BUCKETS.join(', ')}.\n\nExample: {"image_url":"https://example.com/photo.jpg","bucket":"projects"} -> {"url":"https://.../projects/123.avif","hash":"a1b2c3d4","format":"avif"}`,
			inputSchema: {
				image_url: z.string().url().describe('Remote image URL to fetch and re-host. Must be http/https and point to a valid image (jpeg/png/webp/gif/avif, max 5MB).'),
				bucket: z.enum(ALLOWED_BUCKETS as [string, ...string[]]).describe(`Storage bucket: ${ALLOWED_BUCKETS.join(' | ')}.`)
			},
			annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
		},
		async ({ image_url, bucket }) =>
			attempt(async () => {
				allowWrite('upload_image', bucket);
				return await MediaService.rehost(image_url, bucket);
			})
	);

	server.registerTool(
		'delete_content',
		{
			title: 'Delete profile content',
			description: describe(
				'Delete',
				'Only for collections. Irreversible. Read the record with get_content first and confirm with the user before calling this.'
			),
			inputSchema: {
				type: domainShape.describe('Collection domain to delete from.'),
				id: z.string().describe('Record id to delete. For experience/skills use numeric string.')
			},
			annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false }
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
