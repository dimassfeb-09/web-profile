<script lang="ts">
	let { imageUrl, index, projectTitle, priority = false, onclick }: {
		imageUrl: string;
		index: number;
		projectTitle: string;
		priority?: boolean;
		onclick: () => void;
	} = $props();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick();
		}
	}
</script>

<div
	class="relative aspect-[9/16] rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm group bg-surface-container cursor-pointer"
	onclick={onclick}
	role="button"
	tabindex="0"
	onkeydown={handleKeyDown}
	aria-label={`View ${projectTitle} screenshot ${index + 1}`}
>
	<img
		src={imageUrl}
		alt={`${projectTitle} screenshot ${index + 1} - Dimas Febriyanto Portfolio`}
		loading={priority ? 'eager' : 'lazy'}
		class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
	/>
</div>