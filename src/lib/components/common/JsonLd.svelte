<script lang="ts">
	let { schema }: { schema: Record<string, unknown> | Record<string, unknown>[] } = $props();
</script>

<svelte:head>
	<script type="application/ld+json">{JSON.stringify(schema)}</script>
</svelte:head>