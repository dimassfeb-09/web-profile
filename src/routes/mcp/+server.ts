import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { authenticateMcp } from '$lib/mcp/auth';
import { registerTools } from '$lib/mcp/tools';

const methodNotAllowed = () =>
	new Response(JSON.stringify({ error: 'Use POST for MCP requests.' }), {
		status: 405,
		headers: { allow: 'POST', 'content-type': 'application/json' }
	});

// ponytail: stateless by design. Vercel freezes the function after the response, so there is
// no instance to reuse and session state cannot survive between requests: sessionIdGenerator
// undefined. If you ever need long-lived SSE or resumable streams, that is the one reason to
// move this endpoint off serverless.
export async function POST({ request }) {
	try {
		const result = await authenticateMcp(request);
		if ('response' in result) return result.response;

		const server = new McpServer({ name: 'web-profile', version: '1.0.0' });
		registerTools(server, result.auth);

		const transport = new WebStandardStreamableHTTPServerTransport({
			sessionIdGenerator: undefined
		});
		await server.connect(transport);
		return await transport.handleRequest(request);
	} catch (error) {
		// A failure here (usually the database being unreachable) must not reach the caller as
		// an HTML error page, and must not serialise driver details like the connection string.
		console.error('[mcp] request failed:', error instanceof Error ? error.message : error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 503,
			headers: { 'content-type': 'application/json', 'retry-after': '5' }
		});
	}
}

export const GET = methodNotAllowed;
export const DELETE = methodNotAllowed;