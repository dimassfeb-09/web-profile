<script lang="ts">
	import GA4Script from '$lib/components/analytics/GA4Script.svelte';
	import TopNavBar from '$lib/components/layout/TopNavBar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<GA4Script />
<TopNavBar cvUrl={data.cvUrl} navLinks={data.navLinks} />

<div class="pb-24 lg:pb-0">
	{@render children()}
</div>

<Footer data={data.footerData} />