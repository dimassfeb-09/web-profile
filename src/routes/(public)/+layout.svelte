<script lang="ts">
	import { navigating } from '$app/state';
	import GA4Script from '$lib/components/analytics/GA4Script.svelte';
	import TopNavBar from '$lib/components/layout/TopNavBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import DetailSkeleton from '$lib/components/ui/skeletons/DetailSkeleton.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const detailVariant = $derived.by(() => {
		const path = navigating.to?.url.pathname ?? '';
		if (/^\/blog\/[^/]+$/.test(path)) return 'blog';
		if (/^\/achievements\/[^/]+$/.test(path)) return 'achievement';
		if (/^\/projects\/[^/]+$/.test(path)) return 'project';
		return null;
	});
</script>

<GA4Script />
<TopNavBar cvUrl={data.cvUrl} navLinks={data.navLinks} />

{#if detailVariant}
	<div class="fixed inset-0 z-50 overflow-y-auto bg-background">
		<main class="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-24">
			<DetailSkeleton variant={detailVariant} />
		</main>
	</div>
{:else}
	<div class="pb-24 lg:pb-0">
		{@render children()}
	</div>
{/if}

<Footer data={data.footerData} />