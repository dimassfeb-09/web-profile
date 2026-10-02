import { McpKeyService } from '../../../services/mcp_key.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { keys: await McpKeyService.listKeys() };
};