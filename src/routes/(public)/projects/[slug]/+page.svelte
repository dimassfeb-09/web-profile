<script lang="ts">
	import type { PageProps } from './$types';
	import { ExternalLink, Calendar, Code2, CheckCircle2, Rocket } from 'lucide-svelte';
	import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import BackButton from '$lib/components/common/BackButton.svelte';
	import JsonLd from '$lib/components/common/JsonLd.svelte';
	import GallerySection from '$lib/components/projects/gallery/GallerySection.svelte';
	import ProjectTracker from '$lib/components/projects/ProjectTracker.svelte';
	import CachedImage from '$lib/components/ui/CachedImage.svelte';
	import { getCachedImageUrl } from '$lib/utils/image-url';

	let { data }: PageProps = $props();
	const project = $derived(data.project);
	const externalLinks = $derived(Object.entries(project.external_links || {}) as [string, string][]);

	const canonicalUrl = $derived(`https://www.dimassfeb.com/projects/${project.slug}`);

	const formatDate = (d: string | Date | null) => {
		if (!d) return '';
		return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(d));
	};

	const schema = $derived({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: project.title,
		description: project.description,
		url: canonicalUrl,
		image: getCachedImageUrl(project.image_url, project.image_hash, 1200) || 'https://www.dimassfeb.com/og-image.png',
		applicationCategory: 'WebApplication',
		operatingSystem: 'Any',
	});

	const breadcrumbSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dimassfeb.com' },
			{ '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://www.dimassfeb.com/projects' },
			{ '@type': 'ListItem', position: 3, name: project.title, item: canonicalUrl },
		],
	});

	const getStatusColor = (status: string | undefined) => {
		if (status?.toLowerCase() === 'completed') return 'text-green-700 bg-green-100 border-green-200';
		if (status?.toLowerCase() === 'in progress') return 'text-amber-700 bg-amber-100 border-amber-200';
		return 'text-on-surface-variant bg-surface-container-high border-outline-variant/20';
	};
</script>

<svelte:head>
	<title>{project.title} | Dimas Febriyanto — Portfolio</title>
	<meta name="description" content="{project.description} — Project by Dimas Febriyanto, Fullstack & Mobile Developer specializing in Golang and Flutter." />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content="{project.title} | Dimas Febriyanto — Portfolio" />
	<meta property="og:description" content="{project.description} — Project by Dimas Febriyanto, Fullstack & Mobile Developer." />
	<meta property="og:site_name" content="Dimas Febriyanto" />
	<meta property="og:image" content={getCachedImageUrl(project.image_url, project.image_hash, 1200) || 'https://www.dimassfeb.com/og-image.png'} />
	<meta property="og:image:alt" content="{project.title} — Project by Dimas Febriyanto" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{project.title} | Dimas Febriyanto — Portfolio" />
	<meta name="twitter:description" content="{project.description} — Project by Dimas Febriyanto." />
	<meta name="twitter:image" content={getCachedImageUrl(project.image_url, project.image_hash, 1200) || 'https://www.dimassfeb.com/og-image.png'} />
</svelte:head>

<JsonLd schema={[schema, breadcrumbSchema]} />
<ProjectTracker title={project.title} slug={project.slug || ''} />

<main class="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-5xl mx-auto pb-24 relative">
	<Breadcrumb
		items={[
			{ label: 'Home', href: '/' },
			{ label: 'Projects', href: '/projects' },
			{ label: project.title, href: `/projects/${project.slug}` },
		]}
	/>

	{#if project.image_url}
		<div class="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 border border-outline-variant/20 shadow-xl">
			<CachedImage src={project.image_url} hash={project.image_hash} alt={`${project.title} - Project by Dimas Febriyanto`} class="w-full h-full object-cover" priority />
			<div class="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
		</div>
	{/if}

	<header class="mb-12 space-y-6">
		<div class="flex flex-wrap gap-3">
			{#if project.status}
				<span class={`inline-flex items-center gap-1.5 font-label text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(project.status)}`}>
					<Rocket class="w-3 h-3" />
					{project.status.toUpperCase()}
				</span>
			{/if}
			{#if project.date}
				<span class="inline-flex items-center gap-1.5 font-label text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1.5 rounded-full border border-outline-variant/20">
					<Calendar class="w-3 h-3" />
					{formatDate(project.date)}
				</span>
			{/if}
		</div>

		<h1 class="font-mono text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
			{project.title}
		</h1>

		<p class="font-body text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-3xl">
			{project.description}
		</p>
	</header>

	<div class="grid gap-8">
		{#if project.long_description || project.link_url}
			<section class="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/10 shadow-sm">
				<h2 class="font-headline text-2xl font-bold text-on-surface mb-6">Overview</h2>
				{#if project.long_description}
					<div class="prose prose-lg max-w-none font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-8">
						{project.long_description}
					</div>
				{/if}
				<div class="flex flex-wrap gap-4 pt-4 border-t border-outline-variant/10">
					{#if project.link_url}
						<a
							href={project.link_url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-label font-bold transition-all hover:bg-primary-container active:scale-95"
						>
							<ExternalLink class="w-4 h-4" />
							{project.link_text || 'Visit Project'}
						</a>
					{/if}
					{#each externalLinks as [key, url]}
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-label font-medium transition-all hover:bg-surface-variant active:scale-95 capitalize"
						>
							<ExternalLink class="w-4 h-4" />
							{key}
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<div class="grid md:grid-cols-2 gap-8">
			{#if project.features.length > 0}
				<section class="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
					<h2 class="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
						<CheckCircle2 class="w-5 h-5 text-primary" />
						Key Features
					</h2>
					<ul class="grid gap-3">
						{#each project.features as feature, i}
							<li class="flex items-start gap-3 font-body text-on-surface-variant">
								<span class="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">check_circle</span>
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if project.tech_stack.length > 0}
				<section class="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 h-fit">
					<h2 class="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
						<Code2 class="w-5 h-5 text-primary" />
						Technologies
					</h2>
					<div class="flex flex-wrap gap-2">
						{#each project.tech_stack as tech}
							<span class="font-label text-sm font-medium text-on-surface bg-surface-container-highest border border-outline-variant/20 px-4 py-2 rounded-xl">
								{tech}
							</span>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		{#if project.screenshots.length > 0}
			<GallerySection screenshots={project.screenshots} projectTitle={project.title} />
		{/if}
	</div>

	<div class="mt-20 text-center">
		<BackButton href="/#projects" label="Back to Projects" />
	</div>
</main>