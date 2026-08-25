/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = `offline-${version}`;
const ASSETS = [...build, ...files];

async function openCache() {
	return caches.open(CACHE_NAME);
}

async function cachePut(cache: Cache, request: Request, response: Response) {
	if (response.ok && !response.headers.get('cache-control')?.includes('no-store')) {
		cache.put(request, response.clone());
	}
}

async function cacheFirst(request: Request): Promise<Response> {
	const cache = await openCache();
	const cached = await cache.match(request);
	if (cached) return cached;
	const response = await fetch(request);
	await cachePut(cache, request, response);
	return response;
}

async function cacheFirstOpaque(request: Request): Promise<Response> {
	const cache = await openCache();
	const cached = await cache.match(request);
	if (cached) return cached;
	const response = await fetch(request);
	if (response.ok || response.type === 'opaque') {
		cache.put(request, response.clone());
	}
	return response;
}

async function networkFirst(request: Request): Promise<Response> {
	const cache = await openCache();
	try {
		const response = await fetch(request);
		await cachePut(cache, request, response);
		return response;
	} catch {
		const cached = await cache.match(request);
		if (cached) return cached;
		const shell = await cache.match('/');
		if (shell) return shell;
		throw new Error('offline');
	}
}

worker.addEventListener('install', (event) => {
	event.waitUntil(
		openCache()
			.then((cache) => cache.addAll(ASSETS))
			.then(() => worker.skipWaiting()),
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
			.then(() => worker.clients.claim()),
	);
});

worker.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);

	// admin routes: network only, never cached
	if (url.pathname.startsWith('/admin')) return;

	// cross-origin images, stylesheets & fonts (Supabase, Google Fonts) — cache first, offline fallback
	if (url.origin !== location.origin) {
		if (request.destination === 'image' || request.destination === 'style' || request.destination === 'font') {
			event.respondWith(cacheFirstOpaque(request));
		}
		return;
	}

	// same-origin image proxy & static assets — cache first (instant repeat)
	if (request.destination === 'image' || ASSETS.includes(url.pathname)) {
		event.respondWith(cacheFirst(request));
		return;
	}

	// API responses + page navigations: network first, cached copy offline
	event.respondWith(networkFirst(request));
});