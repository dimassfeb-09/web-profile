<script lang="ts">
	import GalleryItem from './GalleryItem.svelte';
	import ImageModal from './ImageModal.svelte';

	let { screenshots, projectTitle }: { screenshots: string[]; projectTitle: string } = $props();

	let selectedIndex = $state<number | null>(null);

	function handleNext() {
		if (selectedIndex === null) return;
		selectedIndex = (selectedIndex + 1) % screenshots.length;
	}

	function handlePrev() {
		if (selectedIndex === null) return;
		selectedIndex = (selectedIndex - 1 + screenshots.length) % screenshots.length;
	}
</script>

<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
	{#each screenshots as img, i}
		<GalleryItem imageUrl={img} index={i} {projectTitle} priority={i === 0} onclick={() => (selectedIndex = i)} />
	{/each}
</div>

<ImageModal
	isOpen={selectedIndex !== null}
	onClose={() => (selectedIndex = null)}
	imageUrl={selectedIndex !== null ? screenshots[selectedIndex] : ''}
	altText={selectedIndex !== null ? `${projectTitle} screenshot ${selectedIndex + 1}` : ''}
	onNext={handleNext}
	onPrev={handlePrev}
	hasMultiple={screenshots.length > 1}
/>