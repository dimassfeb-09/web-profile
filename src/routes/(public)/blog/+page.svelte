<script lang="ts">
	import type { PageProps } from './$types';
	import BlogScrollArea from '$lib/components/blog/BlogScrollArea.svelte';
	import JsonLd from '$lib/components/common/JsonLd.svelte';
	import BackButton from '$lib/components/common/BackButton.svelte';

	let { data }: PageProps = $props();

	const blogSchema = {
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': 'https://www.dimassfeb.com/blog#blog',
		name: 'Blog & Insights — Dimas Febriyanto',
		url: 'https://www.dimassfeb.com/blog',
		description: 'Articles about Flutter, Golang, mobile development, and backend engineering.',
		author: {
			'@type': 'Person',
			'@id': 'https://www.dimassfeb.com/#person',
			name: 'Dimas Febriyanto',
		},
		inLanguage: 'id-ID',
	};
</script>

<svelte:head>
	<title>Blog & Insights</title>
	<meta
		name="description"
		content="Articles about Flutter, Golang, mobile development, and backend engineering by Dimas Febriyanto — Software Engineer from Bekasi, Indonesia."
	/>
	<link rel="canonical" href="https://www.dimassfeb.com/blog" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.dimassfeb.com/blog" />
	<meta property="og:title" content="Blog & Insights | Dimas Febriyanto" />
	<meta
		property="og:description"
		content="Articles about Flutter, Golang, mobile development, and backend engineering."
	/>
	<meta property="og:site_name" content="Dimas Febriyanto" />
</svelte:head>

<JsonLd schema={blogSchema} />

<main class="min-h-screen pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto">
	<div class="mb-10">
		<BackButton href="/#blog" />
	</div>
	<div class="space-y-4 mb-16">
		<h1 class="font-headline text-5xl sm:text-7xl font-bold text-on-surface">
			Blog & <span class="text-primary">Insights</span>
		</h1>
		<p class="font-body text-xl text-on-surface-variant max-w-2xl">
			Exploring web technology, design patterns, and life as a developer.
		</p>
	</div>

	{#if data.blogs.length > 0}
		<BlogScrollArea
			initialBlogs={data.blogs}
			initialNextCursor={data.nextCursor}
			initialHasMore={data.hasMore}
			batchSize={data.limit}
		/>
	{:else}
		<div class="text-center py-40 bg-surface-container-low rounded-[3rem] border border-dashed border-outline-variant/20">
			<p class="font-body text-on-surface-variant italic">No stories published yet. Stay tuned!</p>
		</div>
	{/if}
</main>