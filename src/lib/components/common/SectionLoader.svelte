<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';

	// ponytail: module cache + inflight for N+1 — when N loads, N+1 is warmed so skeleton rarely flashes.
	const inflight = new Map<string, Promise<unknown>>();
	const sectionCache = new Map<string, unknown>();

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
		// cache hit → instant render + warm next
		if (sectionCache.has(endpoint)) {
			payload = sectionCache.get(endpoint);
			if (prefetchNext && !sectionCache.has(prefetchNext) && !inflight.has(prefetchNext)) {
				fetchSection(prefetchNext).catch(() => {});
			}
			return;
		}
		failed = false;
		try {
			const data = await fetchSection(endpoint);
			if (!cancelled) {
				payload = data;
				if (prefetchNext && !sectionCache.has(prefetchNext) && !inflight.has(prefetchNext)) {
					fetchSection(prefetchNext).catch(() => {});
				}
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
