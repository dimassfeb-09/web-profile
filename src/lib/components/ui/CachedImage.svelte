<script lang="ts">
	import { preloadImage, isImageCached } from '$lib/imageCache';
	import { getProxiedImageUrl } from '$lib/utils/image-url';
	import Shimmer from './skeletons/Shimmer.svelte';

	let {
		src,
		hash = null,
		alt,
		class: klass = '',
		loading = 'lazy',
		priority = false,
		fallback = '/images/project-placeholder.jpeg',
		width,
		height
	}: {
		src: string | null | undefined;
		hash?: string | null;
		alt: string;
		class?: string;
		loading?: 'lazy' | 'eager';
		priority?: boolean;
		fallback?: string;
		width?: number;
		height?: number;
	} = $props();

	// ponytail: proxied URL = stable cache key (hash → immutable). Same src+hash → same URL → browser/SW/memory hit.
	// priority 828 / lazy 640 → Vercel avif resize saves ~70% vs original (ponytail: only remote, static stays as-is)
	const optWidth = $derived(width ?? (priority ? 828 : 640));
	const proxied = $derived(getProxiedImageUrl(src, hash, optWidth) || fallback);
	// svelte-ignore state_referenced_locally
	const initial = getProxiedImageUrl(src, hash, width ?? (priority ? 828 : 640)) || fallback;
	// svelte-ignore state_referenced_locally
	let current = $state(initial);
	// svelte-ignore state_referenced_locally
	let loaded = $state(isImageCached(initial));

	$effect(() => {
		// react to src/hash change
		const url = proxied;
		current = url;
		if (isImageCached(url)) {
			loaded = true;
			return;
		}
		loaded = false;
		preloadImage(url)
			.then(() => (loaded = true))
			.catch(() => {
				current = fallback;
				loaded = true;
			});
	});

	function onError() {
		if (current !== fallback) current = fallback;
		loaded = true;
	}
</script>

{#if !loaded}
	<div class="absolute inset-0 w-full h-full" aria-hidden="true">
		<Shimmer class="w-full h-full rounded-none" />
	</div>
{/if}
<img
	src={current}
	{alt}
	{width}
	{height}
	class={klass}
	loading={priority ? 'eager' : loading}
	decoding="async"
	fetchpriority={priority ? 'high' : 'auto'}
	onerror={onError}
	style:opacity={loaded ? '1' : '0'}
	class:transition-opacity={true}
	class:duration-300={true}
/>
