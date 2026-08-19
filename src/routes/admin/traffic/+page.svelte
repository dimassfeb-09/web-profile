<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import AnalyticsDashboard from '$lib/components/admin/AnalyticsDashboard.svelte';

	let refreshKey = $state(0);
	let isMounted = $state(false);

	$effect(() => {
		const id = setTimeout(() => {
			isMounted = true;
		}, 0);
		return () => clearTimeout(id);
	});

	const handleRefresh = async () => {
		await invalidateAll();
		refreshKey++;
	};
</script>

<div class="space-y-10 animate-fade-in">
	<div class="flex justify-between items-end">
		<div>
			<h1 class="font-headline text-3xl sm:text-4xl font-bold text-on-surface mb-2 tracking-tight">Traffic & Analytics</h1>
			<p class="font-body text-on-surface-variant opacity-80">Pantau statistik pengunjung, asal traffic, dan halaman terpopuler portfolio Anda.</p>
		</div>
		<div class="flex items-center gap-4">
			{#if isMounted}
				<p class="hidden sm:block text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-widest">
					Last Updated: {new Date().toLocaleTimeString()}
				</p>
			{/if}
			<button
				onclick={handleRefresh}
				class="p-3 rounded-2xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow active:scale-95"
				title="Refresh Data"
			>
				<span class="material-symbols-outlined text-lg">refresh</span>
				Refresh
			</button>
		</div>
	</div>

	<AnalyticsDashboard refreshKey={refreshKey} />
</div>