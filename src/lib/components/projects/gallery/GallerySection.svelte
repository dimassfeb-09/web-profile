<script lang="ts">
	import GalleryGrid from './GalleryGrid.svelte';

	let { screenshots, projectTitle }: { screenshots: string[]; projectTitle: string } = $props();
</script>

{#if screenshots.length > 0}
	<section class="mt-8">
		<h2 class="font-headline text-2xl font-bold text-on-surface mb-6">Gallery</h2>
		<GalleryGrid {screenshots} {projectTitle} />
	</section>
{/if}