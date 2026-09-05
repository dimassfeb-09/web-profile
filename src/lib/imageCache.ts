// ponytail: tiny in-memory decoded-image cache — same URL never fetches/decodes twice per SPA session.
// Persists across SvelteKit navigations (SPA), complements HTTP + SW CacheStorage.
const inflight = new Map<string, Promise<void>>();
const done = new Set<string>();

export function preloadImage(src: string): Promise<void> {
	if (!src || done.has(src)) return Promise.resolve();
	const existing = inflight.get(src);
	if (existing) return existing;
	const p = new Promise<void>((resolve, reject) => {
		const img = new Image();
		img.decoding = 'async';
		let settled = false;
		const onResolve = () => {
			if (settled) return;
			settled = true;
			done.add(src);
			resolve();
		};
		const onReject = (e: unknown) => {
			if (settled) return;
			settled = true;
			reject(e);
		};
		img.onload = onResolve;
		img.onerror = onReject;
		img.src = src;
		// memory/http cache hit → complete sync, resolve tanpa nunggu onload
		if (img.complete && img.naturalWidth > 0) {
			onResolve();
		}
	});
	inflight.set(src, p);
	p.then(
		() => inflight.delete(src),
		() => inflight.delete(src)
	);
	return p;
}

export function isImageCached(src: string): boolean {
	return done.has(src);
}

export function markCached(src: string) {
	if (src) done.add(src);
}

// ponytail: warm N+1 images fire-and-forget
export function preloadImages(srcs: (string | null | undefined)[]) {
	for (const s of srcs) if (s) preloadImage(s).catch(() => {});
}
