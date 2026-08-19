import { describe, expect, it, vi } from 'vitest';
import { cached, revalidateTag } from '$lib/cache';

describe('cached', () => {
	it('caches the result and reuses it within TTL', async () => {
		const fn = vi.fn().mockResolvedValue('value');
		const first = await cached('a', fn, { ttl: 60 });
		const second = await cached('a', fn, { ttl: 60 });
		expect(first).toBe('value');
		expect(second).toBe('value');
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('revalidates by tag', async () => {
		const fn = vi.fn().mockResolvedValue('v1');
		await cached('b', fn, { tags: ['posts'] });
		revalidateTag('posts');
		const refetched = await cached('b', fn, { tags: ['posts'] });
		expect(fn).toHaveBeenCalledTimes(2);
		expect(refetched).toBe('v1');
	});

	it('does not invalidate entries with other tags', async () => {
		const fn = vi.fn().mockResolvedValue('x');
		await cached('c', fn, { tags: ['other'] });
		revalidateTag('posts');
		await cached('c', fn, { tags: ['other'] });
		expect(fn).toHaveBeenCalledTimes(1);
	});
});