<script lang="ts">
	import { Calendar, Clock, X, ArrowLeft, Loader2 } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		excerpt: string;
		content: Record<string, unknown>;
	}

	let { isOpen, onClose, title, excerpt, content }: Props = $props();

	let html = $state('');
	let isLoading = $state(false);

	$effect(() => {
		if (!isOpen) return;

		let active = true;
		isLoading = true;
		fetch('/api/blog/render', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content })
		})
			.then((res) => res.json())
			.then((data) => {
				if (active) html = data.html ?? '';
			})
			.catch((error) => {
				console.error('Failed to render preview:', error);
				if (active) html = '';
			})
			.finally(() => {
				if (active) isLoading = false;
			});

		return () => {
			active = false;
		};
	});

	const wordCount = $derived(JSON.stringify(content).length);
	const readTime = $derived(Math.ceil(wordCount / 1000));
</script>

{#if isOpen}
	<div class="fixed inset-0 z-[100] bg-surface flex flex-col animate-fade-in overflow-hidden">
		<div class="h-14 bg-surface-container-high border-b border-outline-variant/10 px-6 flex items-center justify-between">
			<div class="flex items-center gap-3 p-5">
				<div
					class="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20"
				>
					Preview Mode
				</div>
				<span class="text-xs text-on-surface-variant font-body hidden sm:inline">
					This is exactly how your post will look to readers.
				</span>
			</div>
			<button
				onclick={onClose}
				class="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label text-sm font-bold bg-surface rounded-full px-4 py-1.5 border border-outline-variant/20 hover:border-primary"
			>
				<X class="w-4 h-4" />
				Close Preview
			</button>
		</div>

		<div class="flex-grow overflow-y-auto custom-scrollbar">
			<article class="min-h-screen pt-32 pb-32 px-6 sm:px-10 bg-surface">
				<div class="max-w-3xl mx-auto space-y-16">
					<div
						class="inline-flex items-center gap-2 text-on-surface-variant transition-colors font-body text-sm font-bold group opacity-50 cursor-not-allowed"
					>
						<ArrowLeft class="w-4 h-4" />
						Back to Blog
					</div>

					<header class="space-y-6">
						<div class="flex flex-wrap items-center gap-6 text-sm font-bold text-on-surface-variant">
							<div class="flex items-center gap-2">
								<Calendar class="w-4 h-4 text-primary" />
								{new Date().toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</div>
							<div class="flex items-center gap-2">
								<Clock class="w-4 h-4 text-primary" />
								{readTime} min read
							</div>
						</div>

						<h1 class="font-headline text-4xl sm:text-6xl font-bold text-on-surface leading-tight">
							{title || 'Untitled Blog Post'}
						</h1>

						{#if excerpt}
							<p class="font-body text-xl text-on-surface-variant italic border-l-4 border-primary/20 pl-6 py-2">
								{excerpt}
							</p>
						{/if}
					</header>

					{#if isLoading}
						<div class="flex justify-center items-center py-20">
							<Loader2 class="w-8 h-8 text-primary animate-spin" />
						</div>
					{:else}
						<div class="tiptap-content w-full max-w-none focus:outline-none">
							{@html html}
						</div>
					{/if}

					<footer class="pt-12 border-t border-outline-variant/10">
						<div class="bg-surface-container-low rounded-[2rem] p-8 text-center space-y-4">
							<h3 class="font-headline text-xl font-bold text-on-surface">Liked this article?</h3>
							<p class="font-body text-on-surface-variant text-sm">
								Feel free to share it with your network or reach out if you have any questions!
							</p>
							<div class="flex justify-center gap-4 pt-4">
								<button
									class="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all cursor-not-allowed opacity-50"
								>
									Get in Touch
								</button>
							</div>
						</div>
					</footer>
				</div>
			</article>
		</div>
	</div>
{/if}