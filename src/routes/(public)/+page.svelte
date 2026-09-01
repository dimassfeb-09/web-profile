<script lang="ts">
	import type { PageProps } from './$types';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import AboutSection from '$lib/components/sections/AboutSection.svelte';
	import SkillsSection from '$lib/components/sections/SkillsSection.svelte';
	import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';
	import ProjectsSection from '$lib/components/sections/ProjectsSection.svelte';
	import EducationSection from '$lib/components/sections/EducationSection.svelte';
	import AchievementSection from '$lib/components/sections/AchievementSection.svelte';
	import CertificatesSection from '$lib/components/sections/CertificatesSection.svelte';
	import BlogSection from '$lib/components/sections/BlogSection.svelte';
	import ContactSection from '$lib/components/sections/ContactSection.svelte';
	import SectionLoader from '$lib/components/common/SectionLoader.svelte';
	import SectionSkeleton from '$lib/components/ui/skeletons/SectionSkeleton.svelte';
	import JsonLd from '$lib/components/common/JsonLd.svelte';

	let { data }: PageProps = $props();

	const BASE_URL = 'https://www.dimassfeb.com';

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${BASE_URL}/#webpage`,
		url: BASE_URL,
		name: 'Dimas Febriyanto — Fullstack & Mobile Developer Portfolio',
		description:
			'Portfolio of Dimas Febriyanto (dimassfeb), Fullstack & Mobile Developer specializing in Golang and Flutter. View projects, blog posts, and professional experience.',
		isPartOf: { '@id': `${BASE_URL}/#website` },
		about: { '@id': `${BASE_URL}/#person` },
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: `${BASE_URL}/og-image.png`,
			width: 1200,
			height: 630
		},
		datePublished: '2024-01-01T00:00:00+07:00',
		dateModified: new Date().toISOString(),
		inLanguage: 'id',
		potentialAction: {
			'@type': 'ReadAction',
			target: BASE_URL
		}
	};

	// ponytail: SSR priority = hero + about + skills (techstack). Rest is N+1 chain via prefetchNext.
	const ssrKeys = new Set(['about', 'contact', 'skills']);
	const lazySections = new Set(['projects', 'education', 'achievements', 'certificates', 'blog']);

	function getNextEndpoint(currentKey: string): string | undefined {
		const idx = data.visibleSections.findIndex((s) => s.section_key === currentKey);
		for (let i = idx + 1; i < data.visibleSections.length; i++) {
			const k = data.visibleSections[i].section_key;
			if (!ssrKeys.has(k)) return `/api/section/${k}`;
		}
		return undefined;
	}
</script>

<svelte:head>
	<title>Dimas Febriyanto — Fullstack & Mobile Developer Portfolio (Golang + Flutter)</title>
	<meta name="description" content="Portfolio of Dimas Febriyanto (dimassfeb), Fullstack & Mobile Developer specializing in Golang (backend) and Flutter (mobile). 3+ apps on Play Store. View projects, blog, and experience." />
	<link rel="canonical" href={BASE_URL} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={BASE_URL} />
	<meta property="og:title" content="Dimas Febriyanto — Fullstack & Mobile Developer Portfolio" />
	<meta property="og:description" content="Portfolio of Dimas Febriyanto (dimassfeb), Fullstack & Mobile Developer specializing in Golang and Flutter. View projects, blog posts, and professional experience." />
	<meta property="og:site_name" content="Dimas Febriyanto" />
	<meta property="og:image" content="{BASE_URL}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Dimas Febriyanto — Fullstack & Mobile Developer Portfolio" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Dimas Febriyanto — Fullstack & Mobile Developer Portfolio" />
	<meta name="twitter:description" content="Portfolio of Dimas Febriyanto (dimassfeb), Fullstack & Mobile Developer specializing in Golang and Flutter." />
	<meta name="twitter:image" content="{BASE_URL}/og-image.png" />
</svelte:head>

<JsonLd schema={webPageSchema} />

<main class="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-8 xs:gap-12 lg:gap-16 pb-20 xs:pb-32">
	<HeroSection data={data.homeData} />

	{#each data.visibleSections as section}
		{@const key = section.section_key}
		<div id={key}>
			{#if key === 'about'}
				{#if data.aboutData}
					<AboutSection data={data.aboutData} />
				{/if}
			{:else if key === 'contact'}
				{#if data.contactData}
					<ContactSection data={data.contactData} />
				{/if}
			{:else if key === 'skills'}
				<SkillsSection categories={data.skillsData as any} />
			{:else}
				<SectionLoader
					endpoint={`/api/section/${key}`}
					prefetchNext={getNextEndpoint(key)}
					lazy={lazySections.has(key)}
				>
					{#snippet skeleton()}
						<SectionSkeleton variant={key as any} />
					{/snippet}
					{#snippet error(retry)}
						<div class="flex flex-col items-center justify-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 px-6 py-12 text-center">
							<p class="text-neutral-400">Gagal memuat bagian ini. Coba lagi.</p>
							<button
								onclick={retry}
								class="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
							>
								Coba lagi
							</button>
						</div>
					{/snippet}
					{#snippet children(d)}
						{#if key === 'experience'}
							<ExperienceSection experiences={d as any} />
						{:else if key === 'projects'}
							<ProjectsSection initialProjects={d as any} />
						{:else if key === 'education'}
							<EducationSection educations={d as any} />
						{:else if key === 'achievements'}
							<AchievementSection achievements={d as any} />
						{:else if key === 'certificates'}
							<CertificatesSection certificates={d as any} />
						{:else if key === 'blog'}
							<BlogSection blogs={d as any} />
						{/if}
					{/snippet}
				</SectionLoader>
			{/if}
		</div>
	{/each}
</main>
