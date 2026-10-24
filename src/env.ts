import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

// SvelteKit only injects values that are explicitly declared here into
// `$env/dynamic/private` (both locally and on Vercel). Keep every
// dynamic private environment variable used by the app in this list.
export const variables = defineEnvVars({
	NODE_ENV: { public: false, static: false, schema: z.string().optional() },
	DATABASE_URL: { public: false, static: false, schema: z.string().optional() },
	JWT_SECRET: { public: false, static: false, schema: z.string().optional() },
	CRON_SECRET: { public: false, static: false, schema: z.string().optional() },
	GA_SERVICE_ACCOUNT_CREDENTIALS: { public: false, static: false, schema: z.string().optional() },
	GA_PROPERTY_ID: { public: false, static: false, schema: z.string().optional() },
	SUPABASE_URL: { public: false, static: false, schema: z.string().optional() },
	SUPABASE_SERVICE_ROLE_KEY: { public: false, static: false, schema: z.string().optional() },
	UPSTASH_REDIS_REST_URL: { public: false, static: false, schema: z.string().optional() },
	UPSTASH_REDIS_REST_TOKEN: { public: false, static: false, schema: z.string().optional() },
	PUBLIC_GIPHY_API_KEY: { public: false, static: false, schema: z.string().optional() }
});
