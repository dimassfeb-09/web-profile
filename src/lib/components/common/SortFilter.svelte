<script lang="ts">
	import { Clock, History, ChevronDown } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	const currentSort = $derived(page.url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest');

	async function handleSortChange(e: Event) {
		const newSort = (e.currentTarget as HTMLSelectElement).value;
		const params = new URLSearchParams(page.url.searchParams);
		if (newSort === 'newest') {
			params.delete('sort');
		} else {
			params.set('sort', newSort);
		}
		const qs = params.toString();
		await goto(`${page.url.pathname}${qs ? `?${qs}` : ''}`, { replaceState: true });
	}
</script>

<div class="relative group min-w-[140px]">
	<div
		class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60 group-hover:text-primary transition-colors flex items-center"
	>
		{#if currentSort === 'newest'}
			<Clock class="w-4 h-4" />
		{:else}
			<History class="w-4 h-4" />
		{/if}
	</div>
	<select
		value={currentSort}
		onchange={handleSortChange}
		class={cn(
			'w-full pl-11 pr-10 py-2.5 rounded-2xl appearance-none cursor-pointer',
			'bg-surface-container-low border border-outline-variant/10 text-on-surface text-sm font-label font-medium',
			'hover:bg-surface-container-high hover:border-primary/20 transition-all duration-300',
			'focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm'
		)}
	>
		<option value="newest">Terbaru</option>
		<option value="oldest">Terlama</option>
	</select>
	<div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40 flex items-center">
		<ChevronDown class="w-4 h-4" />
	</div>
</div>