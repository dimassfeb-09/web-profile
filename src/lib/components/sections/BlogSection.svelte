<script lang="ts">
	import { Calendar, ChevronRight, ArrowRight } from 'lucide-svelte';
	import type { BlogData } from '../../../repositories/blog.repository';

	let { blogs }: { blogs: BlogData[] } = $props();

	// Hanya ambil maksimal 3
	const displayedBlogs = $derived(blogs.slice(0, 3));
</script>

{#if displayedBlogs.length > 0}
	<section class="pt-8 xs:pt-12 lg:pt-16 pb-12">
		<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 xs:mb-16">
			<div class="max-w-2xl">
				<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1] text-pretty">
					Latest Stories
				</h2>
				<p class="font-body text-zinc-500 dark:text-zinc-400 text-base xs:text-lg leading-relaxed font-light mt-4">
					Exploring technology, design, and my journey as a software developer.
				</p>
			</div>

			<a
				href="/blog"
				class="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 group"
			>
				See All Articles
				<ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
			</a>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
			{#each displayedBlogs as blog}
				<a
					href={`/blog/${blog.slug}`}
					class="group flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 hover:bg-surface-container-high transition-all duration-500 hover:-translate-y-2"
				>
					<div class="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
						<Calendar class="w-3.5 h-3.5" />
						{blog.published_at
							? new Date(blog.published_at).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})
							: 'Recent Post'}
					</div>

					<h3 class="font-headline text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors line-clamp-2">
						{blog.title}
					</h3>

					<p class="font-body text-on-surface-variant text-sm line-clamp-3 mb-8 flex-grow">
						{blog.excerpt || 'Read more to explore the insights and details of this story...'}
					</p>

					<div class="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
						Read Article
						<ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
					</div>
				</a>
			{/each}
		</div>

		<!-- Mobile "See All" button -->
		<div class="mt-12 md:hidden">
			<a
				href="/blog"
				class="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-label text-sm font-bold active:scale-[0.98] transition-all"
			>
				See All Articles
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</section>
{/if}