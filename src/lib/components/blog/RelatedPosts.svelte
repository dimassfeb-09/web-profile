<script lang="ts">
	import { Calendar } from 'lucide-svelte';
	import type { BlogData } from '../../../repositories/blog.repository';

	let { related }: { related: BlogData[] } = $props();
</script>

{#if related.length > 0}
	<aside class="border-t border-outline-variant/10 pt-12 space-y-6">
		<h2 class="font-headline text-2xl font-bold text-on-surface">Related Articles</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each related as post}
				<a
					href={`/blog/${post.slug}`}
					class="group block p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/10"
				>
					<p class="font-headline text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
						{post.title}
					</p>
					{#if post.excerpt}
						<p class="mt-2 text-xs text-on-surface-variant line-clamp-2">{post.excerpt}</p>
					{/if}
					{#if post.published_at}
						<div class="mt-3 flex items-center gap-1.5 text-xs text-on-surface-variant/60">
							<Calendar class="w-3 h-3" />
							{new Date(post.published_at).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
							})}
						</div>
					{/if}
				</a>
			{/each}
		</div>
	</aside>
{/if}