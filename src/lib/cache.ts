interface CacheEntry<T> {
	value: T;
	expiresAt: number;
	tags: string[];
}

// ponytail: in-memory TTL cache; per-instance only. Add a shared store (Redis) if you run multi-instance on Vercel.
const store = new Map<string, CacheEntry<unknown>>();

export async function cached<T>(
	key: string,
	fn: () => Promise<T>,
	opts: { ttl?: number; tags?: string[] } = {}
): Promise<T> {
	const { ttl = 3600, tags = [] } = opts;
	const entry = store.get(key);
	if (entry && entry.expiresAt > Date.now()) {
		return entry.value as T;
	}
	const value = await fn();
	store.set(key, { value, expiresAt: Date.now() + ttl * 1000, tags });
	return value;
}

export function revalidateTag(tag: string): void {
	for (const [key, entry] of store) {
		if (entry.tags.includes(tag)) {
			store.delete(key);
		}
	}
}