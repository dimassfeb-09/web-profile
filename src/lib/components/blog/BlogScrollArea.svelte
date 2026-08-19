<script lang="ts">
	import { Calendar, ChevronRight, Loader2 } from 'lucide-svelte';
	import type { BlogData } from '../../../repositories/blog.repository';

	let { initialBlogs, initialNextCursor, initialHasMore, batchSize = 9 }: {
		initialBlogs: BlogData[];
		initialNextCursor: string | null;
		initialHasMore: boolean;
		batchSize?: number;
	} = $props();

	const initialData = () => ({ blogs: initialBlogs, nextCursor: initialNextCursor, hasMore: initialHasMore });

	let blogs = $state<BlogData[]>(initialData().blogs);
	let nextCursor = $state<string | null>(initialData().nextCursor);
	let hasMore = $state(initialData().hasMore);
	let isLoading = $state(false);
	let isError = $state(false);
	let observerTarget = $state<HTMLDivElement | null>(null);

	async function loadMoreBlogs() {
		if (isLoading || !hasMore || !nextCursor) return;
		isLoading = true;
		isError = false;
		try {
			const response = await fetch(`/api/blog?published=true&cursor=${nextCursor}&limit=${batchSize}`);
			const result = await response.json();
			if (result.status === 200) {
				blogs = [...blogs, ...result.data.blogs];
				nextCursor = result.data.nextCursor;
				hasMore = result.data.hasMore;
			} else {
				isError = true;
			}
		} catch (error) {
			console.error('Failed to load more blogs:', error);
			isError = true;
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		if (!observerTarget) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					loadMoreBlogs();
				}
			},
			{ threshold: 0.1, rootMargin: '100px' }
		);
		observer.observe(observerTarget);
		return () => observer.disconnect();
	});
</script>

<div class="space-y-12">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each blogs as blog}
			<a
				href={`/blog/${blog.slug}`}
				class="group flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 hover:bg-surface-container-high transition-all duration-500 hover:-translate-y-2"
			>
				<div class="flex items-center gap-2 text-xs font-bold text-primary mb-4">
					<Calendar class="w-3 h-3" />
					{blog.published_at
						? new Date(blog.published_at).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
						: 'Draft'}
				</div>
				<h2 class="font-headline text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
					{blog.title}
				</h2>
				<p class="font-body text-on-surface-variant text-sm line-clamp-3 mb-8 flex-grow">
					{blog.excerpt || 'Read the full story to learn more...'}
				</p>
				<div class="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
					Read Article
					<ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</div>
			</a>
		{/each}

		{#if isLoading}
			{#each Array(3) as _, i}
				<div
					class="flex flex-col bg-surface-container-low/50 border border-outline-variant/10 rounded-[2.5rem] p-8 animate-pulse"
				>
					<div class="h-4 w-24 bg-surface-container-high rounded-full mb-4"></div>
					<div class="h-8 w-full bg-surface-container-high rounded-lg mb-4"></div>
					<div class="h-4 w-full bg-surface-container-high rounded-lg mb-2"></div>
					<div class="h-4 w-2/3 bg-surface-container-high rounded-lg mb-8"></div>
					<div class="h-4 w-20 bg-surface-container-high rounded-full mt-auto"></div>
				</div>
			{/each}
		{/if}
	</div>

	<div bind:this={observerTarget} class="h-10 flex items-center justify-center">
		{#if isLoading}
			<Loader2 class="w-8 h-8 text-primary animate-spin" />
		{/if}
		{#if !hasMore && blogs.length > 0}
			<p class="font-body text-on-surface-variant italic text-sm">You've reached the end of the insights!</p>
		{/if}
		{#if isError}
			<button onclick={loadMoreBlogs} class="text-primary font-bold hover:underline">
				Error loading more. Tap to try again.
			</button>
		{/if}
	</div>
</div>