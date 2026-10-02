import { json } from '@sveltejs/kit';
import { McpKeyService } from '../../../../services/mcp_key.service';
import { PREFIX_LEN, EXPECTED_PREFIX } from '$lib/mcp/keys';

// Auth is free here: hooks.server.ts already guards every /api/admin path with the admin cookie.

export async function GET() {
	try {
		return json({ status: 200, message: 'Keys retrieved successfully', data: await McpKeyService.listKeys() });
	} catch (error) {
		console.error('[Admin MCP Key GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const { name, scope } = McpKeyService.validate(body.name, body.scope);
		const key = await McpKeyService.mintKey(name, scope);

		// The raw key is in this response and nowhere else. Deliberately not logged.
		return json(
			{ status: 201, message: 'Key created. Copy it now - it is not shown again.', data: key },
			{ status: 201 }
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal Server Error';
		return json({ status: 400, message }, { status: 400 });
	}
}

export async function DELETE({ request }) {
	try {
		const body = await request.json();
		const prefix = typeof body.prefix === 'string' ? body.prefix : '';

		// Narrow to a real prefix so a malformed value can never widen the UPDATE.
		if (!prefix.startsWith(EXPECTED_PREFIX) || prefix.length !== PREFIX_LEN) {
			return json({ status: 400, message: 'A valid key prefix is required' }, { status: 400 });
		}

		const revoked = await McpKeyService.revokeKey(prefix);
		if (!revoked) {
			return json({ status: 404, message: 'No active key with that prefix' }, { status: 404 });
		}
		return json({ status: 200, message: `Revoked ${prefix}` });
	} catch (error) {
		console.error('[Admin MCP Key DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}