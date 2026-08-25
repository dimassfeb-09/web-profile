<script lang="ts">
	import { preloadImage, isImageCached } from '$lib/imageCache';
	import { getProxiedImageUrl } from '$lib/utils/image-url';

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
	const proxied = $derived(getProxiedImageUrl(src, hash) || fallback);
	const initial = getProxiedImageUrl(src, hash) || fallback;
	let current = $state(initial);
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
