<script lang="ts">
	import type { PageProps } from './$types';
	import AchievementSection from '$lib/components/sections/AchievementSection.svelte';
	import SortFilter from '$lib/components/common/SortFilter.svelte';
	import BackButton from '$lib/components/common/BackButton.svelte';
	import JsonLd from '$lib/components/common/JsonLd.svelte';

	let { data }: PageProps = $props();

	const collectionSchema = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': 'https://www.dimassfeb.com/achievements#webpage',
		name: 'Achievements — Dimas Febriyanto',
		url: 'https://www.dimassfeb.com/achievements',
		description: 'Recognition, competitions, and milestones attained by Dimas Febriyanto — Fullstack & Mobile Developer.',
		author: { '@id': 'https://www.dimassfeb.com/#person' },
		isPartOf: { '@id': 'https://www.dimassfeb.com/#website' },
		inLanguage: 'id'
	};
</script>

<svelte:head>
	<title>Achievements | Dimas Febriyanto — Portfolio</title>
	<meta name="description" content="Recognition, competitions, and milestones attained by Dimas Febriyanto — Fullstack & Mobile Developer." />
	<link rel="canonical" href="https://www.dimassfeb.com/achievements" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.dimassfeb.com/achievements" />
	<meta property="og:title" content="Achievements | Dimas Febriyanto — Portfolio" />
	<meta property="og:description" content="Recognition, competitions, and milestones attained by Dimas Febriyanto — Fullstack & Mobile Developer." />
	<meta property="og:site_name" content="Dimas Febriyanto" />
	<meta property="og:image" content="https://www.dimassfeb.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Achievements — Dimas Febriyanto" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Achievements | Dimas Febriyanto — Portfolio" />
	<meta name="twitter:description" content="Recognition, competitions, and milestones attained by Dimas Febriyanto." />
	<meta name="twitter:image" content="https://www.dimassfeb.com/og-image.png" />
</svelte:head>

<JsonLd schema={collectionSchema} />

<main class="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20">
	<div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
		<BackButton href="/#achievements" />
		<SortFilter />
	</div>
	<h1 class="font-headline text-5xl sm:text-7xl font-bold text-on-surface mb-4">
		Achievements
	</h1>
	<p class="font-body text-xl text-on-surface-variant max-w-2xl mb-12">
		Recognition, competitions, and milestones attained by Dimas Febriyanto.
	</p>
	<AchievementSection achievements={data.achievements} />
</main>