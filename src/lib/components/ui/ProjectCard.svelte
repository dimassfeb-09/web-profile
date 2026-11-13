<script lang="ts">
	import { CheckCircle2, Calendar } from 'lucide-svelte';
	import CachedImage from './CachedImage.svelte';
	import { preloadData } from '$app/navigation';
	// ponytail: hover preload warms +page.server.ts for instant nav
	function warm(href: string) {
		preloadData(href).catch(() => {});
	}

	// Same format as the project detail page: "August 2026".
	const formatDate = (d: string | Date | null | undefined) => {
		if (!d) return '';
		return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(d));
	};

	let {
		title,
		description,
		imageUrl,
		imageHash = null,
		features,
		linkUrl,
		linkText,
		slug,
		techStack = [],
		date = null,
		priority = false
	}: {
		title: string;
		description: string;
		imageUrl: string | null;
		imageHash?: string | null;
		features: string[];
		linkUrl: string;
		linkText: string;
		slug?: string;
		techStack?: string[];
		date?: string | Date | null;
		priority?: boolean;
	} = $props();

	let containerRef = $state<HTMLDivElement | null>(null);
	// svelte-ignore state_referenced_locally
	let visibleCount = $state(techStack.length);
	let isCalculated = $state(false);

	$effect(() => {
		if (!containerRef) return;

		const calculateFit = () => {
			const container = containerRef;
			if (!container) return;
			const children = Array.from(container.children) as HTMLElement[];
			if (children.length === 0) return;

			const containerWidth = container.offsetWidth;
			let currentWidth = 0;
			let count = 0;
			const gap = 6;

			const moreIndicator = children.find((child) => child.dataset.more === 'true');
			const moreWidth = moreIndicator ? moreIndicator.offsetWidth + gap : 40;

			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (child.dataset.more === 'true') continue;

				const childWidth = child.offsetWidth + gap;
				if (currentWidth + childWidth > containerWidth - (i < techStack.length - 1 ? moreWidth : 0)) {
					break;
				}

				currentWidth += childWidth;
				count++;
			}

			visibleCount = count;
			isCalculated = true;
		};

		calculateFit();
		const observer = new ResizeObserver(calculateFit);
		observer.observe(containerRef);
		return () => observer.disconnect();
	});
</script>

<div class="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
	<div class="aspect-[1024/500] w-full bg-surface-container-high relative overflow-hidden">
		{#if slug}
			<a
				href={`/projects/${slug}`}
				class="block w-full h-full relative"
				data-sveltekit-preload-data="hover"
				data-sveltekit-preload-code="viewport"
				onmouseenter={() => warm(`/projects/${slug}`)}
				onfocus={() => warm(`/projects/${slug}`)}
			>
				<CachedImage
					src={imageUrl}
					hash={imageHash}
					alt={`${title} - App Project by Dimas Febriyanto`}
					class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					priority={priority}
				/>
			</a>
		{:else}
			<CachedImage
				src={imageUrl}
				hash={imageHash}
				alt={`${title} - App Project by Dimas Febriyanto`}
				class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
				priority={priority}
			/>
		{/if}
	</div>
	<div class="p-6 flex flex-col flex-grow">
		<div
			bind:this={containerRef}
			class="flex items-center flex-nowrap gap-1.5 mb-4 overflow-hidden min-h-[26px] {isCalculated ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'}"
		>
			{#each techStack.slice(0, isCalculated ? visibleCount : techStack.length) as tag}
				<span
					class="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[10px] font-medium border border-outline-variant/10 whitespace-nowrap flex-shrink-0"
				>
					{tag}
				</span>
			{/each}
			{#if techStack.length > visibleCount}
				<span data-more="true" class="text-[10px] text-on-surface-variant/40 whitespace-nowrap flex-shrink-0">
					+{techStack.length - visibleCount}
				</span>
			{/if}
		</div>
		<h3 class="font-headline text-xl font-bold text-on-surface mb-1">
			{title}
		</h3>
		{#if date}
			<p class="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant/70 mb-2">
				<Calendar class="w-3.5 h-3.5" />
				{formatDate(date)}
			</p>
		{/if}
		<p class="text-on-surface-variant font-body text-sm mb-4 line-clamp-2">
			{description}
		</p>
		<div class="mb-8 flex-grow">
			<ul class="space-y-3">
				{#each features.slice(0, 3) as feature}
					<li class="flex items-start gap-3 group/feat">
						<CheckCircle2 class="w-[18.5px] h-[18.5px] text-primary/60 mt-0.5 group-hover/feat:text-primary transition-colors shrink-0" />
						<span class="text-sm font-body text-on-surface-variant leading-snug">
							{feature}
						</span>
					</li>
				{/each}
			</ul>
		</div>
		<div class="mt-auto flex items-center justify-between gap-4">
			{#if slug}
				<a
					href={`/projects/${slug}`}
					class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors"
					data-sveltekit-preload-data="hover"
					onmouseenter={() => warm(`/projects/${slug}`)}
				>
					More Detail
				</a>
			{/if}
			<a
				class="inline-flex justify-center items-center py-2 px-5 rounded-full bg-on-surface text-surface font-label font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all duration-300"
				href={linkUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				{linkText}
			</a>
		</div>
	</div>
</div>