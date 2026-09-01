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

	const optWidth = $derived(width ?? (priority ? 828 : 640));

	// AVIF URL (primary) — getProxiedImageUrl now returns AVIF when available
	const avifUrl = $derived(getProxiedImageUrl(src, hash, optWidth) || fallback);

	// Original URL (fallback for browsers without AVIF support)
	const originalUrl = $derived(getOriginalUrl(src) || fallback);

	// svelte-ignore state_referenced_locally
	let current = $state(avifUrl);
	// svelte-ignore state_referenced_locally
	let loaded = $state(isImageCached(avifUrl));

	$effect(() => {
		const url = avifUrl;
		current = url;
		if (isImageCached(url)) {
			loaded = true;
			return;
		}
		loaded = false;
		preloadImage(url)
			.then(() => (loaded = true))
			.catch(() => {
				// AVIF failed, try original format
				if (originalUrl !== avifUrl) {
					current = originalUrl;
					preloadImage(originalUrl)
						.then(() => (loaded = true))
						.catch(() => {
							current = fallback;
							loaded = true;
						});
				} else {
					current = fallback;
					loaded = true;
				}
			});
	});

	function onError() {
		// If AVIF failed, try original format
		if (current === avifUrl && originalUrl !== avifUrl) {
			current = originalUrl;
		} else if (current !== fallback) {
			current = fallback;
		}
		loaded = true;
	}

	/**
	 * Get the original format URL (without AVIF conversion).
	 * Used as fallback for browsers that don't support AVIF.
	 */
	function getOriginalUrl(url: string | null | undefined): string {
		if (!url) return '';
		if (url.startsWith('/') || url.startsWith('data:')) return url;

		// If it's an AVIF URL, convert back to original
		if (url.endsWith('.avif')) {
			return url.replace(/\.avif$/, '.webp');
		}

		return url;
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
