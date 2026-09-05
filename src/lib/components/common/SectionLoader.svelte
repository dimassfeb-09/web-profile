<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';

	// ponytail: module cache + inflight for the next-section warmup below.
	const inflight = new Map<string, Promise<unknown>>();
	const sectionCache = new Map<string, unknown>();

	// ponytail: prefetch is deferred to browser idle so the chained request never competes
	// with LCP-critical resources (Lighthouse: avoid chaining critical requests). Falls back to
	// a short timeout where requestIdleCallback is unavailable (Safari).
	function prefetchIdle(url: string) {
		if (sectionCache.has(url) || inflight.has(url)) return;
		const run = () => {
			fetchSection(url).catch(() => {});
		};
		if (typeof requestIdleCallback !== 'undefined') {
			requestIdleCallback(run, { timeout: 4000 });
		} else {
			setTimeout(run, 1500);
		}
	}

	function fetchSection(url: string): Promise<unknown> {
		const hit = sectionCache.get(url);
		if (hit !== undefined) return Promise.resolve(hit);
		let p = inflight.get(url);
		if (!p) {
			p = fetch(url)
				.then(async (res) => {
					const body = await res.json().catch(() => null);
					if (!res.ok || body?.status !== 200) {
						throw new Error(body?.message || 'Failed to load section');
					}
					return body.data;
				})
				.then((data) => {
					sectionCache.set(url, data);
					return data;
				})
				.finally(() => inflight.delete(url));
			inflight.set(url, p);
		}
		return p;
	}

	let {
		endpoint,
		prefetchNext,
		lazy = false,
		children,
		skeleton,
		error
	}: {
		endpoint: string;
		prefetchNext?: string;
		lazy?: boolean;
		children: Snippet<[unknown]>;
		skeleton: Snippet;
		error: Snippet<[() => void]>;
	} = $props();

	let root = $state<HTMLElement | null>(null);
	let payload = $state<unknown>(null);
	let failed = $state(false);
	let cancelled = false;

	async function load() {
		if (payload) return;
		// cache hit → instant render + warm next (idle-deferred, off the critical path)
		if (sectionCache.has(endpoint)) {
			payload = sectionCache.get(endpoint);
			if (prefetchNext) prefetchIdle(prefetchNext);
			return;
		}
		failed = false;
		try {
			const data = await fetchSection(endpoint);
			if (!cancelled) {
				payload = data;
				if (prefetchNext) prefetchIdle(prefetchNext);
			}
		} catch (err) {
			console.error(`Failed to load ${endpoint}:`, err);
			if (!cancelled) failed = true;
		}
	}

	function retry() {
		if (cancelled) return;
		// ponytail: allow retry after failure; cache only holds successes
		load();
	}

	$effect(() => {
		// if already cached, render immediately even for lazy
		if (sectionCache.has(endpoint)) {
			load();
			return;
		}
		if (lazy) {
			if (!root) return;
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						observer.disconnect();
						load();
					}
				},
				{ rootMargin: '400px 0px' }
			);
			observer.observe(root);
			return () => observer.disconnect();
		}
		load();
	});

	onDestroy(() => {
		cancelled = true;
	});
</script>

<div bind:this={root}>
	{#if payload}
		{@render children(payload)}
	{:else if failed}
		{@render error(retry)}
	{:else}
		{@render skeleton()}
	{/if}
</div>
