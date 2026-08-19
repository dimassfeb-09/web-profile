<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Snippet } from 'svelte';

	// ponytail: module-level inflight dedup so concurrent SectionLoader instances
	// for the same endpoint share one fetch (no duplicate requests).
	const inflight = new Map<string, Promise<unknown>>();

	let {
		endpoint,
		lazy = false,
		children,
		skeleton,
		error
	}: {
		endpoint: string;
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
		failed = false;

		let promise = inflight.get(endpoint);
		if (!promise) {
			promise = fetch(endpoint)
				.then(async (res) => {
					const body = await res.json().catch(() => null);
					if (!res.ok || body?.status !== 200) {
						throw new Error(body?.message || 'Failed to load section');
					}
					return body.data;
				})
				.finally(() => inflight.delete(endpoint));
			inflight.set(endpoint, promise);
		}

		try {
			const data = await promise;
			if (!cancelled) payload = data;
		} catch (err) {
			console.error(`Failed to load ${endpoint}:`, err);
			if (!cancelled) failed = true;
		}
	}

	function retry() {
		if (cancelled) return;
		load();
	}

	$effect(() => {
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