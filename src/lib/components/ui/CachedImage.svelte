<script lang="ts">
	import { preloadImage, isImageCached, markCached } from '$lib/imageCache';
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

	// sync cache check on first render — if already decoded in this SPA session, no skeleton at all
	// svelte-ignore state_referenced_locally
	let current = $state(avifUrl);
	// svelte-ignore state_referenced_locally
	let loaded = $state(isImageCached(avifUrl));
	let everLoaded = $state(isImageCached(avifUrl));

	// generation guard — kalau src ganti cepat, hasil preload lama diabaikan
	let seq = 0;

	$effect(() => {
		const url = avifUrl;
		const orig = originalUrl;
		const fb = fallback;
		const mySeq = ++seq;

		// cache hit → instant, tanpa skeleton walau discroll / remount
		if (isImageCached(url)) {
			current = url;
			loaded = true;
			everLoaded = true;
			return;
		}

		// belum pernah load di session ini → skeleton hanya di sini
		// jangan set loaded=false kalau url sama & sudah pernah loaded (scroll remount)
		if (current !== url) {
			current = url;
			loaded = false;
		} else if (everLoaded) {
			// url sama tapi remount — tetap tampil tanpa skeleton
			loaded = true;
			return;
		} else {
			loaded = false;
		}

		preloadImage(url)
			.then(() => {
				if (mySeq !== seq) return;
				loaded = true;
				everLoaded = true;
			})
			.catch(() => {
				if (mySeq !== seq) return;
				// AVIF failed, try original format (sekali aja)
				if (orig !== url) {
					current = orig;
					if (isImageCached(orig)) {
						loaded = true;
						everLoaded = true;
						return;
					}
					loaded = false;
					preloadImage(orig)
						.then(() => {
							if (mySeq !== seq) return;
							loaded = true;
							everLoaded = true;
						})
						.catch(() => {
							if (mySeq !== seq) return;
							current = fb;
							loaded = true;
							everLoaded = true;
						});
				} else {
					current = fb;
					loaded = true;
					everLoaded = true;
				}
			});
	});

	function onLoad() {
		markCached(current);
		loaded = true;
		everLoaded = true;
	}

	function onError() {
		// If AVIF failed, try original format
		if (current === avifUrl && originalUrl !== avifUrl) {
			current = originalUrl;
			// kalau original sudah cached, langsung tampil
			if (isImageCached(originalUrl)) {
				loaded = true;
				everLoaded = true;
			}
		} else if (current !== fallback) {
			current = fallback;
			loaded = true;
			everLoaded = true;
		}
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
	onload={onLoad}
	onerror={onError}
	style:opacity={loaded ? '1' : '0'}
	class:transition-opacity={everLoaded ? false : true}
	class:duration-300={!everLoaded}
 />
