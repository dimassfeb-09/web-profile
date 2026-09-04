<script lang="ts">
	import { ListOrdered } from 'lucide-svelte';

	let { items }: { items: { level: 2 | 3; id: string; text: string }[] } = $props();
</script>

{#if items.length >= 2}
	<nav
		aria-label="Daftar isi"
		class="bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/10"
	>
		<p class="flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
			<ListOrdered class="w-4 h-4 text-primary" />
			Daftar Isi
		</p>
		<ul class="space-y-2.5">
			{#each items as item}
				<li class={item.level === 3 ? 'ml-5' : ''}>
					<a
						href={`#${item.id}`}
						class="font-body text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
