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
		img.onload = () => {
			done.add(src);
			resolve();
		};
		img.onerror = reject;
		img.src = src;
	});
	inflight.set(src, p);
	p.catch(() => inflight.delete(src)).finally(() => inflight.delete(src));
	return p;
}

export function isImageCached(src: string): boolean {
	return done.has(src);
}

// ponytail: warm N+1 images fire-and-forget
export function preloadImages(srcs: (string | null | undefined)[]) {
	for (const s of srcs) if (s) preloadImage(s).catch(() => {});
}
