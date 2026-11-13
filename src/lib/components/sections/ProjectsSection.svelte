<script lang="ts">
	import ProjectCard from '../ui/ProjectCard.svelte';
	import { getProxiedImageUrl } from '$lib/utils/image-url';
	import { PROJECT_CATEGORIES } from '$lib/project-categories';

	interface Project {
		id?: string;
		title: string;
		description: string;
		image_url: string;
		image_hash?: string | null;
		features: string[];
		link_url: string;
		link_text: string;
		slug?: string;
		tech_stack?: string[];
		date?: string | Date | null;
		categories?: string[] | null;
	}

	let { initialProjects }: { initialProjects: Project[] } = $props();

	const initialSnapshot = () => initialProjects;
	let projects = $state<Project[]>(initialSnapshot());
	let offset = $state(initialSnapshot().length);
	let isLoading = $state(false);
	let hasMore = $state(true);
	let observerTarget = $state<HTMLDivElement | null>(null);
	const PAGE_SIZE = 6;

	// Curated category filter. One chip active at a time; a project with
	// several categories shows up under each of them. Filtering is
	// client-side over the loaded projects, which already covers the whole
	// list (SSR loads all of them); load-more keeps appending underneath.
	let selectedCategory = $state<string | null>(null);
	const categoryCount = $derived(
		(category: string) => projects.filter((p) => (p.categories || []).includes(category)).length
	);
	let filteredProjects = $derived.by(() => {
		const category = selectedCategory;
		if (category === null) return projects;
		return projects.filter((p) => (p.categories || []).includes(category));
	});

	// ponytail: preload 2 hero project images so first paint not naked (828 avif)
	const preloadUrls = $derived(projects.slice(0, 2).map((p) => getProxiedImageUrl(p.image_url, p.image_hash, 828)));

	async function loadMoreProjects() {
		if (isLoading || !hasMore) return;
		isLoading = true;
		try {
			const response = await fetch(`/api/projects?limit=${PAGE_SIZE}&offset=${offset}&bypassCache=true`);
			const result = await response.json();
			if (result.status === 200 && result.data) {
				const newProjects = result.data;
				if (newProjects.length < PAGE_SIZE) {
					hasMore = false;
				}
				projects = [...projects, ...newProjects];
				offset += newProjects.length;
			} else {
				hasMore = false;
			}
		} catch (error) {
			console.error('Error loading more projects:', error);
			hasMore = false;
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (!observerTarget) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore) {
					loadMoreProjects();
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(observerTarget);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	{#each preloadUrls as url}
		<link rel="preload" as="image" href={url} fetchpriority="high" />
	{/each}
</svelte:head>

<section id="projects" class="pt-8 xs:pt-12 lg:pt-16 pb-12">
	<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 xs:mb-16 gap-6">
		<div class="max-w-2xl">
			<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1] text-pretty">
				Projects
			</h2>
			<p class="font-body text-zinc-500 dark:text-zinc-400 text-base xs:text-lg leading-relaxed font-light mt-4">
				A selection of my recent work and applications.
			</p>
		</div>
	</div>

	<div class="flex flex-wrap gap-2 mb-8">
		<button
			onclick={() => (selectedCategory = null)}
			class="px-4 py-2 rounded-full text-sm font-medium border transition-all {selectedCategory === null
				? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
				: 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary'}"
		>
			All ({projects.length})
		</button>
		{#each PROJECT_CATEGORIES as category}
			<button
				onclick={() => (selectedCategory = selectedCategory === category ? null : category)}
				class="px-4 py-2 rounded-full text-sm font-medium border transition-all {selectedCategory === category
					? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
					: 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary'}"
			>
				{category} ({categoryCount(category)})
			</button>
		{/each}
	</div>

	{#if filteredProjects.length === 0}
		<p class="text-on-surface-variant font-body text-sm py-8 text-center">
			No projects in this category yet.
		</p>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-4 gap-6 xs:gap-8">
			{#each filteredProjects as project, i}
				<ProjectCard
					title={project.title}
					description={project.description}
					imageUrl={project.image_url}
					imageHash={project.image_hash}
					features={project.features}
					linkUrl={project.link_url}
					linkText={project.link_text}
					slug={project.slug}
					techStack={project.tech_stack}
					date={project.date}
					priority={i < 2}
				/>
			{/each}
		</div>
	{/if}

	<div bind:this={observerTarget} class="h-20 flex items-center justify-center mt-8">
		{#if isLoading}
			<div class="flex flex-col items-center gap-3">
				<div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
				<p class="text-xs font-medium text-zinc-400 dark:text-zinc-500 animate-pulse uppercase tracking-widest">
					Loading More Projects
				</p>
			</div>
		{/if}
		{#if !hasMore && projects.length > 0}
			<div class="flex flex-col items-center gap-2 py-8">
				<div class="h-px w-12 bg-zinc-200 dark:bg-zinc-800"></div>
				<p class="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
					You've reached the end
				</p>
			</div>
		{/if}
	</div>
</section>