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
	import JsonLd from '$lib/components/common/JsonLd.svelte';

	let { data }: PageProps = $props();

	const BASE_URL = 'https://www.dimassfeb.com';

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${BASE_URL}/#webpage`,
		url: BASE_URL,
		name: 'Dimas Febriyanto - Full-Stack & Mobile Developer Portfolio',
		description:
			'Dimas Febriyanto is a Full-Stack Developer and Mobile Engineer from Indonesia specializing in Golang, Laravel, Flutter, React.js, and backend development.',
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

	// SSR homepage: all sections arrive in `data.sections` from +page.server.ts,
	// so the initial HTML already contains the full content — no client-side
	// /api/section/* fetch, no shimmer placeholders for crawlers / agents.
	// (The old SectionLoader + IntersectionObserver lazy load is gone on purpose:
	// that is what made curl / search indexers only see Hero + About + Skills.)
</script>

<svelte:head>
	<title>Dimas Febriyanto - Full-Stack & Mobile Developer</title>
	<meta name="description" content="Dimas Febriyanto is a Full-Stack Developer and Mobile Engineer from Indonesia specializing in Golang, Laravel, Flutter, React.js, and backend development." />
	<link rel="canonical" href={BASE_URL} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={BASE_URL} />
	<meta property="og:title" content="Dimas Febriyanto - Full-Stack & Mobile Developer" />
	<meta property="og:description" content="Dimas Febriyanto is a Full-Stack Developer and Mobile Engineer from Indonesia specializing in Golang, Laravel, Flutter, React.js, and backend development." />
	<meta property="og:site_name" content="Dimas Febriyanto" />
	<meta property="og:image" content="{BASE_URL}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Dimas Febriyanto - Full-Stack & Mobile Developer Portfolio" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Dimas Febriyanto - Full-Stack & Mobile Developer" />
	<meta name="twitter:description" content="Dimas Febriyanto is a Full-Stack Developer and Mobile Engineer from Indonesia specializing in Golang, Laravel, Flutter, React.js, and backend development." />
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
			{:else if data.failedSections.includes(key)}
				<div class="flex flex-col items-center justify-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 px-6 py-12 text-center">
					<p class="text-neutral-400">Gagal memuat bagian ini. Coba lagi.</p>
					<button
						onclick={() => location.reload()}
						class="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
					>
						Coba lagi
					</button>
				</div>
			{:else if key === 'experience'}
				<ExperienceSection experiences={data.sections.experience as any} />
			{:else if key === 'projects'}
				<ProjectsSection initialProjects={data.sections.projects as any} />
			{:else if key === 'education'}
				<EducationSection educations={data.sections.education as any} />
			{:else if key === 'achievements'}
				<AchievementSection achievements={data.sections.achievements as any} />
			{:else if key === 'certificates'}
				<CertificatesSection certificates={data.sections.certificates as any} />
			{:else if key === 'blog'}
				<BlogSection blogs={data.sections.blog as any} />
			{/if}
		</div>
	{/each}
</main>
