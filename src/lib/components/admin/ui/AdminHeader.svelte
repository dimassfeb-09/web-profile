<script lang="ts">
	interface Props {
		title: string;
		description: string;
		buttonLabel?: string;
		onButtonClick?: () => void;
		icon?: string;
	}

	let { title, description, buttonLabel, onButtonClick, icon = 'add' }: Props = $props();
</script>

<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
	<div>
		<h1 class="font-headline text-2xl xs:text-3xl font-bold text-on-surface">{title}</h1>
		<p class="font-body text-sm xs:text-base text-on-surface-variant max-w-xl">{description}</p>
	</div>
	{#if buttonLabel && onButtonClick}
		<button
			type="button"
			onclick={onButtonClick}
			class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 active:scale-95 transition-all font-body text-sm shrink-0 shadow-lg shadow-primary/20"
		>
			<span class="material-symbols-outlined text-lg">{icon}</span>
			{buttonLabel}
		</button>
	{/if}
</div>