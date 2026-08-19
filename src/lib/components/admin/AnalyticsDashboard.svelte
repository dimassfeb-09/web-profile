<script lang="ts">
	import type { AnalyticsData } from '$lib/analyticsClient';

	interface Props {
		refreshKey: number;
	}

	let { refreshKey }: Props = $props();

	let data = $state<AnalyticsData | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let period = $state('30days');
	let searchQuery = $state('');
	let rowLimit = $state(5);
	let hideAdminPaths = $state(true);

	$effect(() => {
		const saved = localStorage.getItem('admin_hide_admin_paths');
		if (saved !== null) {
			hideAdminPaths = saved === 'true';
		}
	});

	const handleToggleHideAdmin = (val: boolean) => {
		hideAdminPaths = val;
		localStorage.setItem('admin_hide_admin_paths', String(val));
	};

	const loadData = async () => {
		loading = true;
		error = null;
		try {
			const res = await fetch(`/api/analytics?period=${period}`);
			const json = await res.json();
			if (!res.ok) {
				error = json.error === 'analytics_not_configured' ? 'analytics_not_configured' : json.message || 'Gagal memuat data analytics.';
			} else {
				data = json;
			}
		} catch {
			error = 'Gagal memuat data analytics.';
		} finally {
			loading = false;
		}
	};

	$effect(() => {
		loadData();
	});

	const handleRetry = () => loadData();

	const formatPath = (path: string) => {
		const cleanPath = path ?? '/';
		if (cleanPath.length > 40) {
			return cleanPath.substring(0, 40) + '…';
		}
		return cleanPath;
	};

	const formatNumber = (num: number | null | undefined) => {
		const val = num ?? 0;
		return new Intl.NumberFormat('id-ID').format(val);
	};

	const deviceList = $derived(data?.deviceBreakdown || []);
	const totalDeviceUsers = $derived(deviceList.reduce((sum, item) => sum + (item.activeUsers ?? 0), 0));
	const trafficList = $derived(data?.trafficSources || []);
	const totalSessions = $derived(trafficList.reduce((sum, item) => sum + (item.sessions ?? 0), 0));
	const filteredPages = $derived(
		(data?.topPages || []).filter((p) => {
			if (hideAdminPaths && (p.path || '').startsWith('/admin')) return false;
			return (p.path || '').toLowerCase().includes(searchQuery.toLowerCase());
		})
	);
	const displayedPages = $derived(filteredPages.slice(0, rowLimit));

	const deviceIcon = (category: string) => {
		const cat = (category || '').toLowerCase();
		if (cat === 'desktop') return { icon: 'desktop_windows', color: 'bg-primary/10 text-primary' };
		if (cat === 'mobile') return { icon: 'smartphone', color: 'bg-emerald-500/10 text-emerald-500' };
		if (cat === 'tablet') return { icon: 'tablet_mac', color: 'bg-amber-500/10 text-amber-500' };
		return { icon: 'devices', color: 'bg-blue-500/10 text-blue-500' };
	};
</script>

{#if loading}
	<div class="space-y-8 animate-pulse my-8">
		<div class="flex items-center gap-4 pt-4">
			<div class="w-10 h-10 rounded-xl bg-surface-container-high"></div>
			<div class="space-y-2">
				<div class="w-48 h-6 bg-surface-container-high rounded"></div>
				<div class="w-64 h-3 bg-surface-container-high rounded"></div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
			<div class="h-28 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 p-8 flex items-center gap-6">
				<div class="w-14 h-14 bg-surface-container-high rounded-2xl"></div>
				<div class="space-y-2">
					<div class="w-20 h-3 bg-surface-container-high rounded"></div>
					<div class="w-32 h-8 bg-surface-container-high rounded"></div>
				</div>
			</div>
			<div class="h-28 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 p-8 flex items-center gap-6">
				<div class="w-14 h-14 bg-surface-container-high rounded-2xl"></div>
				<div class="space-y-2">
					<div class="w-36 h-3 bg-surface-container-high rounded"></div>
					<div class="w-32 h-8 bg-surface-container-high rounded"></div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
			<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 xl:col-span-2 h-80 flex flex-col justify-between">
				<div class="w-40 h-5 bg-surface-container-high rounded mb-6"></div>
				<div class="space-y-4 flex-grow">
					{#each [1, 2, 3, 4, 5] as i (i)}
						<div class="flex justify-between items-center">
							<div class="w-2/3 h-4 bg-surface-container-high rounded"></div>
							<div class="w-16 h-4 bg-surface-container-high rounded"></div>
						</div>
					{/each}
				</div>
			</div>
			<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 h-80 flex flex-col justify-between">
				<div class="w-36 h-5 bg-surface-container-high rounded mb-6"></div>
				<div class="space-y-5 flex-grow">
					{#each [1, 2, 3, 4] as i (i)}
						<div class="space-y-2">
							<div class="flex justify-between">
								<div class="w-24 h-3 bg-surface-container-high rounded"></div>
								<div class="w-12 h-3 bg-surface-container-high rounded"></div>
							</div>
							<div class="w-full h-1.5 bg-surface-container-high rounded-full"></div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else if error === 'analytics_not_configured'}
	<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center space-y-4 shadow-sm my-8">
		<div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
			<span class="material-symbols-outlined text-3xl font-bold">settings_suggest</span>
		</div>
		<h3 class="font-headline text-xl font-bold text-on-surface">Analytics Belum Dikonfigurasi</h3>
		<p class="font-body text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
			Google Analytics 4 credentials tidak ditemukan di environment variables. Tambahkan{' '}
			<code class="bg-surface-container-high px-2 py-1 rounded text-primary text-xs font-mono">GA_PROPERTY_ID</code>{' '}
			dan{' '}
			<code class="bg-surface-container-high px-2 py-1 rounded text-primary text-xs font-mono">GA_SERVICE_ACCOUNT_CREDENTIALS</code>{' '}
			ke file{' '}
			<code class="bg-surface-container-high px-2 py-1 rounded text-xs font-mono">.env</code>{' '}
			Anda.
		</p>
	</div>
{:else if error}
	<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center space-y-4 shadow-sm my-8">
		<div class="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
			<span class="material-symbols-outlined text-3xl font-bold">error</span>
		</div>
		<h3 class="font-headline text-xl font-bold text-on-surface">Gagal Memuat Data Analytics</h3>
		<p class="font-body text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">{error}</p>
		<button
			onclick={handleRetry}
			class="mt-2 px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
		>
			<span class="material-symbols-outlined text-sm">replay</span>
			Retry
		</button>
	</div>
{:else if data}
	<div class="space-y-8 animate-fade-in my-8">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-outline-variant/10 pb-4">
			<div class="flex items-center gap-4">
				<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
					<span class="material-symbols-outlined text-2xl">analytics</span>
				</div>
				<div>
					<h2 class="font-headline text-2xl font-bold text-on-surface">Google Analytics 4</h2>
					<p class="font-body text-xs text-on-surface-variant/80">Real-time performance metrics for your web profile</p>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<span class="font-label text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider hidden sm:inline">Periode:</span>
				<select
					value={period}
					onchange={(e) => (period = (e.currentTarget as HTMLSelectElement).value)}
					class="px-4 py-2.5 rounded-2xl bg-surface-container-high border border-outline-variant/10 text-on-surface font-label text-xs font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm cursor-pointer"
				>
					<option value="today">Hari Ini (Today)</option>
					<option value="yesterday">Kemarin (Yesterday)</option>
					<option value="week">Minggu Ini (This Week)</option>
					<option value="month">Bulan Ini (This Month)</option>
					<option value="7days">7 Hari Terakhir</option>
					<option value="30days">30 Hari Terakhir</option>
					<option value="90days">90 Hari Terakhir</option>
					<option value="year">Tahun Ini (This Year)</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
			<div class="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 overflow-hidden shadow-sm">
				<div class="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-sm">
					<span class="material-symbols-outlined text-3xl">visibility</span>
				</div>
				<div>
					<p class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60">Page Views</p>
					<p class="text-on-surface font-headline text-3xl font-bold tracking-tight">{formatNumber(data.pageViews)}</p>
				</div>
			</div>

			<div class="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 overflow-hidden shadow-sm">
				<div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-sm">
					<span class="material-symbols-outlined text-3xl">group</span>
				</div>
				<div>
					<p class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60">Unique Visitors (Active Users)</p>
					<p class="text-on-surface font-headline text-3xl font-bold tracking-tight">{formatNumber(data.activeUsers)}</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
			<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm xl:col-span-2 flex flex-col justify-between min-h-[400px]">
				<div>
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
						<h3 class="font-headline text-lg font-bold text-on-surface flex items-center gap-3">
							<span class="material-symbols-outlined text-primary">description</span>
							Visited Pages
						</h3>

						<div class="flex items-center gap-3 flex-wrap sm:flex-nowrap">
							<button
								type="button"
								onclick={() => handleToggleHideAdmin(!hideAdminPaths)}
								class={`flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/10 text-xs font-label font-bold transition-all focus:outline-none cursor-pointer ${
									hideAdminPaths
										? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
										: 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
								}`}
								title={hideAdminPaths ? 'Tampilkan halaman admin' : 'Sembunyikan halaman admin'}
							>
								<span class="material-symbols-outlined text-sm">{hideAdminPaths ? 'visibility_off' : 'visibility'}</span>
								<span>Sembunyikan /admin</span>
							</button>

							<div class="relative w-full sm:w-48">
								<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">search</span>
								<input
									type="text"
									placeholder="Cari URL..."
									value={searchQuery}
									oninput={(e) => (searchQuery = (e.currentTarget as HTMLInputElement).value)}
									class="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-container-high border border-outline-variant/10 text-xs font-body text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
								/>
								{#if searchQuery}
									<button
										onclick={() => (searchQuery = '')}
										class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface flex items-center"
									>
										<span class="material-symbols-outlined text-sm">close</span>
									</button>
								{/if}
							</div>

							<select
								value={rowLimit}
								onchange={(e) => (rowLimit = Number((e.currentTarget as HTMLSelectElement).value))}
								class="px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface font-label text-xs font-bold focus:outline-none focus:border-primary/50 transition-all cursor-pointer shadow-sm"
							>
								<option value="5">Tampilkan 5</option>
								<option value="10">Tampilkan 10</option>
								<option value="25">Tampilkan 25</option>
								<option value="100">Semua ({filteredPages.length})</option>
							</select>
						</div>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full text-left border-collapse">
							<thead>
								<tr class="border-b border-outline-variant/20 text-on-surface-variant font-label text-xs uppercase tracking-wider pb-3">
									<th class="pb-3 font-semibold">Page Path</th>
									<th class="pb-3 text-right font-semibold">Page Views</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-outline-variant/10">
								{#if displayedPages.length > 0}
									{#each displayedPages as page, idx (idx)}
										<tr class="group hover:bg-surface-container-high/30 transition-colors">
											<td class="py-4 font-mono text-xs text-on-surface font-medium flex items-center gap-2">
												<span class="w-5 h-5 rounded bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-bold font-sans">{idx + 1}</span>
												<span class="truncate max-w-[280px] sm:max-w-[400px]" title={page.path}>{formatPath(page.path)}</span>
											</td>
											<td class="py-4 text-right font-headline font-bold text-sm text-on-surface">{formatNumber(page.pageViews)}</td>
										</tr>
									{/each}
								{:else}
									<tr>
										<td colspan={2} class="py-8 text-center text-sm text-on-surface-variant font-body">
											{searchQuery ? 'Tidak ada halaman yang cocok' : 'Belum ada data kunjungan halaman'}
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>

				{#if filteredPages.length > 0}
					<div class="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-xs text-on-surface-variant/60 font-body">
						<span>Menampilkan {displayedPages.length} dari {filteredPages.length} halaman</span>
						{#if searchQuery}
							<span>Difilter dari {data.topPages?.length || 0} total path</span>
						{/if}
					</div>
				{/if}
			</div>

			<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col justify-between">
				<div>
					<h3 class="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-3">
						<span class="material-symbols-outlined text-secondary">campaign</span>
						Traffic Sources
					</h3>
					<div class="space-y-4">
						{#if trafficList.length > 0}
							{#each trafficList as item, idx (idx)}
								{@const pct = totalSessions > 0 ? ((item.sessions ?? 0) / totalSessions) * 100 : 0}
								<div class="space-y-1">
									<div class="flex justify-between items-center text-xs">
										<span class="font-medium text-on-surface truncate max-w-[150px]" title={item.source}>
											{item.source || '(direct) / (none)'}
										</span>
										<span class="font-bold text-on-surface-variant">{formatNumber(item.sessions)} sessions</span>
									</div>
									<div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
										<div class="h-full bg-secondary rounded-full transition-all duration-500" style="width: {pct}%"></div>
									</div>
								</div>
							{/each}
						{:else}
							<p class="text-center text-sm text-on-surface-variant py-8 font-body">No traffic source data available</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
			<h3 class="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-3">
				<span class="material-symbols-outlined text-tertiary">devices</span>
				Device Category Breakdown
			</h3>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{#if deviceList.length > 0}
					{#each deviceList as item, idx (idx)}
						{@const { icon, color } = deviceIcon(item.category || '')}
						{@const pct = totalDeviceUsers > 0 ? ((item.activeUsers ?? 0) / totalDeviceUsers) * 100 : 0}
						<div class="p-5 rounded-2xl bg-surface-container-high/40 border border-outline-variant/5 flex items-center gap-4">
							<div class={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
								<span class="material-symbols-outlined text-2xl">{icon}</span>
							</div>
							<div>
								<p class="font-headline text-sm font-bold text-on-surface capitalize">{item.category || 'unknown'}</p>
								<p class="font-body text-xs text-on-surface-variant">
									{formatNumber(item.activeUsers)} visitors ({pct.toFixed(1)}%)
								</p>
							</div>
						</div>
					{/each}
				{:else}
					<div class="col-span-3 text-center text-sm text-on-surface-variant py-8 font-body">No device categories data available</div>
				{/if}
			</div>
		</div>
	</div>
{/if}