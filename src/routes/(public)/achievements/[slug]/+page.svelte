<script lang="ts">
	import type { PageProps } from './$types';
	import { ExternalLink, Calendar, Building2, Tag, Users, Code2 } from 'lucide-svelte';
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import BackButton from '$lib/components/common/BackButton.svelte';
	import JsonLd from '$lib/components/common/JsonLd.svelte';
	import { getCachedImageUrl } from '$lib/utils/image-url';

	let { data }: PageProps = $props();
	const achievement = $derived(data.achievement);

	const canonicalUrl = $derived(`https://www.dimassfeb.com/achievements/${achievement.slug}`);

	const formatDate = (d: string | Date | null) => {
		if (!d) return '';
		return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(d));
	};

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: achievement.title,
		description: achievement.description,
		startDate: achievement.date ? new Date(achievement.date).toISOString() : undefined,
		organizer: achievement.event_organizer
			? { '@type': 'Organization', name: achievement.event_organizer }
			: undefined,
		url: canonicalUrl,
		image: getCachedImageUrl(achievement.image_url, achievement.image_hash) || 'https://www.dimassfeb.com/og-image.png',
	});
</script>

<svelte:head>
	<title>{achievement.title}</title>
	<meta name="description" content={achievement.description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={achievement.title} />
	<meta property="og:description" content={achievement.description} />
</svelte:head>

<JsonLd schema={schema} />

<main class="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-5xl mx-auto pb-24">
	<Breadcrumb
		items={[
			{ label: 'Home', href: '/' },
			{ label: 'Achievements', href: '/achievements' },
			{ label: achievement.title, href: `/achievements/${achievement.slug}` },
		]}
	/>

	{#if achievement.image_url}
		<div class="relative w-full aspect-[16/7] rounded-3xl overflow-hidden mb-10 border border-outline-variant/10">
			<img
				src={getCachedImageUrl(achievement.image_url, achievement.image_hash)}
				alt={`${achievement.title} - Achievement by Dimas Febriyanto`}
				class="w-full h-full object-cover"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
		</div>
	{/if}

	<header class="mb-10 space-y-4">
		<div class="flex flex-wrap gap-3">
			{#if achievement.category}
				<span class="inline-flex items-center gap-1.5 font-label text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
					<Tag class="w-3 h-3" />
					{achievement.category}
				</span>
			{/if}
			{#if achievement.date}
				<span class="inline-flex items-center gap-1.5 font-label text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-full">
					<Calendar class="w-3 h-3" />
					{formatDate(achievement.date)}
				</span>
			{/if}
		</div>

		<h1 class="font-headline text-3xl md:text-5xl font-bold text-on-surface leading-tight">
			{achievement.title}
		</h1>

		<p class="font-body text-on-surface-variant text-lg leading-relaxed">
			{achievement.description}
		</p>

		{#if achievement.event_organizer}
			<div class="flex items-center gap-2 font-body text-sm text-on-surface-variant">
				<Building2 class="w-4 h-4 text-primary" />
				Organized by <span class="font-semibold text-on-surface">{achievement.event_organizer}</span>
			</div>
		{/if}
	</header>

	<div class="grid gap-6">
		{#if achievement.problem_statement}
			<section class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
				<h2 class="font-headline text-lg font-bold text-on-surface mb-3">Problem Statement</h2>
				<p class="font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap">
					{achievement.problem_statement}
				</p>
			</section>
		{/if}

		{#if achievement.solution_overview}
			<section class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
				<h2 class="font-headline text-lg font-bold text-on-surface mb-3">Solution Overview</h2>
				<p class="font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap">
					{achievement.solution_overview}
				</p>
			</section>
		{/if}

		{#if (achievement.tech_stack?.length || achievement.team_members?.length)}
			<div class="grid md:grid-cols-2 gap-6">
				{#if achievement.tech_stack?.length}
					<section class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
						<h2 class="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
							<Code2 class="w-5 h-5 text-primary" />
							Tech Stack
						</h2>
						<div class="flex flex-wrap gap-2">
							{#each achievement.tech_stack as tech}
								<span class="font-label text-xs font-bold text-on-surface bg-surface-container-high border border-outline-variant/20 px-3 py-1.5 rounded-full">
									{tech}
								</span>
							{/each}
						</div>
					</section>
				{/if}

				{#if achievement.team_members?.length}
					<section class="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10">
						<h2 class="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
							<Users class="w-5 h-5 text-primary" />
							Team Members
						</h2>
						<div class="flex flex-col gap-2">
							{#each achievement.team_members as member}
								<div class="font-body text-sm text-on-surface-variant flex items-center gap-2">
									<span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
									{member}
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>
		{/if}

		{#if achievement.credential_url}
			<div class="flex justify-center pt-4">
				<a
					href={achievement.credential_url}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white font-label font-bold tracking-wide transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,62,199,0.3)] hover:-translate-y-1 active:translate-y-0"
				>
					<ExternalLink class="w-4 h-4" />
					View Credential / Certificate
				</a>
			</div>
		{/if}
	</div>

	<div class="mt-12 pt-8 border-t border-outline-variant/10 text-center">
		<BackButton href="/achievements" label="Back to All Achievements" />
	</div>
</main>