<script lang="ts">
	import ExperienceItem from '../ui/ExperienceItem.svelte';

	interface Experience {
		id?: number;
		role: string;
		company: string;
		start_date: string | Date;
		end_date: string | Date | null;
		description: string[];
		tags?: string[];
	}

	let { experiences: initialExperiences }: { experiences: Experience[] } = $props();

	const initialSnapshot = () => initialExperiences;
	let experiences = $state<Experience[]>(initialSnapshot());
	let offset = $state(initialSnapshot().length);
	let isLoading = $state(false);
	let hasMore = $state(true);
	let observerTarget = $state<HTMLDivElement | null>(null);
	const PAGE_SIZE = 4;

	const groupedExperiences = $derived(
		experiences.reduce<{ company: string; roles: Experience[] }[]>((groups, exp) => {
			const existingGroup = groups.find((g) => g.company === exp.company);
			if (existingGroup) {
				existingGroup.roles.push(exp);
			} else {
				groups.push({ company: exp.company, roles: [exp] });
			}
			return groups;
		}, []),
	);

	async function loadMoreExperiences() {
		if (isLoading || !hasMore) return;
		isLoading = true;
		try {
			const response = await fetch(`/api/experience?limit=${PAGE_SIZE}&offset=${offset}`);
			const result = await response.json();
			if (result.status === 200 && result.data) {
				const newExperiences = result.data;
				if (newExperiences.length < PAGE_SIZE) {
					hasMore = false;
				}
				experiences = [...experiences, ...newExperiences];
				offset += newExperiences.length;
			} else {
				hasMore = false;
			}
		} catch (error) {
			console.error('Error loading more experiences:', error);
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
					loadMoreExperiences();
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(observerTarget);
		return () => observer.disconnect();
	});
</script>

<section id="experience" class="pt-8 xs:pt-12 lg:pt-16 min-h-[400px]">
	<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 xs:mb-16 gap-6">
		<div class="max-w-2xl">
			<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-pretty">
				Professional Journey
			</h2>
			<p class="font-body text-zinc-500 text-base xs:text-lg leading-relaxed font-light mt-4">
				Experience everything I've worked on throughout my career in software development.
			</p>
		</div>
	</div>

	<div class="flex flex-col gap-12">
		{#each groupedExperiences as group}
			<ExperienceItem company={group.company} roles={group.roles} />
		{/each}
	</div>

	<div bind:this={observerTarget} class="h-20 flex items-center justify-center mt-12">
		{#if isLoading}
			<div class="flex flex-col items-center gap-3">
				<div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
				<p class="text-xs font-medium text-zinc-400 animate-pulse uppercase tracking-widest">
					Loading More Experience
				</p>
			</div>
		{/if}
		{#if !hasMore && experiences.length > 0}
			<div class="flex flex-col items-center gap-2 py-8">
				<div class="h-px w-12 bg-zinc-200"></div>
				<p class="text-zinc-400 text-sm font-medium">
					End of Professional Journey
				</p>
			</div>
		{/if}
	</div>
</section>