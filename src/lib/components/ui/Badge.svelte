<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		className = '',
		icon,
		children,
	}: {
		className?: string;
		icon?: Snippet;
		children: Snippet;
	} = $props();
</script>

<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-highest/50 backdrop-blur-sm border border-outline-variant/20 {className}">
	{@render icon?.()}
	<span class="font-label text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
		{@render children()}
	</span>
</div>