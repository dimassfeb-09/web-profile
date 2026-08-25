<script lang="ts">
	import { Plus } from 'lucide-svelte';

	interface Props {
		title: string;
		description: string;
		buttonLabel?: string;
		onButtonClick?: () => void;
		icon?: string;
	}

	let { title, description, buttonLabel, onButtonClick }: Props = $props();
</script>

<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
	<div>
		<h1 class="font-headline text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
		<p class="text-sm text-zinc-500 max-w-xl mt-1">{description}</p>
	</div>
	{#if buttonLabel && onButtonClick}
		<button
			type="button"
			onclick={onButtonClick}
			class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:shadow-md hover:shadow-zinc-900/10 active:scale-[0.99] transition-all shrink-0"
		>
			<Plus size={16} />
			{buttonLabel}
		</button>
	{/if}
</div>