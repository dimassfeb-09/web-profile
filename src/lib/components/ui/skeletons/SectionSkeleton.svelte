<script lang="ts">
	let { cards = 4, cols = 1 }: { cards?: number; cols?: number } = $props();
</script>

<div class="w-full animate-pulse">
	<div class="h-8 w-40 rounded bg-neutral-800/60"></div>
	<div class="mt-6 grid gap-6" style:grid-template-columns="repeat({cols}, minmax(0, 1fr))">
		{#each Array(cards) as _}
			<div class="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
				<div class="h-4 w-24 rounded bg-neutral-700/60"></div>
				<div class="mt-4 space-y-3">
					<div class="h-3 w-full rounded bg-neutral-800/60"></div>
					<div class="h-3 w-4/5 rounded bg-neutral-800/60"></div>
					<div class="h-3 w-3/5 rounded bg-neutral-800/60"></div>
				</div>
			</div>
		{/each}
	</div>
</div>