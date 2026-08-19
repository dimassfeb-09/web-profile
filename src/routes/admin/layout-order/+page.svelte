<script lang="ts">
	import type { PageProps } from './$types';
	import { dndzone } from 'svelte-dnd-action';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';

	let { data }: PageProps = $props();

	interface Section {
		id: string;
		section_key: string;
		section_label: string;
		order_index: number;
		is_visible: boolean;
	}

	const initialSections = () => data.sections.map((s) => ({ ...s, id: s.section_key }));
	let sections = $state<Section[]>(initialSections());
	let isSaving = $state(false);
	let success = $state(false);

	let flipDurationMs = $state(150);

	const handleDndEvent = (e: CustomEvent<{ items: Section[]; info: { trigger: string } }>) => {
		const { items, info } = e.detail;
		if (info.trigger === 'final') {
			sections = items.map((item, index) => ({ ...item, order_index: index + 1 }));
		}
	};

	const toggleVisibility = (key: string) => {
		sections = sections.map((item) =>
			item.section_key === key ? { ...item, is_visible: !item.is_visible } : item
		);
	};

	const handleSave = async () => {
		isSaving = true;
		success = false;
		try {
			const res = await fetch('/api/admin/section-orders', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					orders: sections.map((s) => ({
						section_key: s.section_key,
						order_index: s.order_index,
						is_visible: s.is_visible
					}))
				})
			});
			const result = await res.json();
			if (res.ok) {
				success = true;
				await invalidateAll();
				setTimeout(() => (success = false), 3000);
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to save section orders');
		} finally {
			isSaving = false;
		}
	};

	const handleReset = () => {
		if (confirm('Apakah Anda yakin ingin mereset urutan ke data awal?')) {
			sections = data.sections.map((s) => ({ ...s, id: s.section_key }));
		}
	};
</script>

<div class="max-w-4xl space-y-10">
	<AdminHeader
		title="Layout & Section Order"
		description="Atur urutan tampilan section pada halaman portfolio Anda dengan drag and drop."
	/>

	<div class="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl text-xs font-label font-bold text-primary">
				<span class="material-symbols-outlined text-sm">info</span>
				Geser handle (⠿) untuk merubah urutan
			</div>

			<div class="flex items-center gap-3">
				<button
					onclick={handleReset}
					disabled={isSaving}
					class="px-6 py-3 rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-all text-xs font-label font-medium"
				>
					Reset Perubahan
				</button>
				<button
					onclick={handleSave}
					disabled={isSaving}
					class="px-8 py-3 rounded-xl bg-primary text-white font-label font-medium text-xs tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
				>
					{#if isSaving}
						<div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
					{:else}
						Simpan Urutan
					{/if}
				</button>
			</div>
		</div>

		{#if success}
			<div class="flex items-center gap-2 text-emerald-500 font-label text-sm animate-fade-in">
				<span class="material-symbols-outlined text-lg">check_circle</span>
				Urutan section berhasil disimpan!
			</div>
		{/if}

		<div
			use:dndzone={{ items: sections, flipDurationMs }}
			onconsider={handleDndEvent}
			onfinalize={handleDndEvent}
			class="space-y-4"
		>
			{#each sections as section (section.id)}
				<div
					class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all duration-200"
				>
					<div class="flex items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto">
						<div class="p-2 -ml-2 mt-1 sm:mt-0 text-on-surface-variant hover:text-primary transition-colors cursor-grab active:cursor-grabbing touch-none shrink-0">
							<span class="material-symbols-outlined text-2xl select-none">drag_indicator</span>
						</div>

						<div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
							<div
								class="w-10 h-10 shrink-0 rounded-xl bg-surface-container-high flex items-center justify-center font-headline font-black text-sm text-secondary"
							>
								{section.order_index}
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="font-headline font-bold text-on-surface tracking-tight truncate">
									{section.section_label}
								</h4>
								<p class="text-xs font-body text-on-surface-variant tracking-wide truncate">
									Key: {section.section_key}
								</p>
							</div>
						</div>
					</div>

					<div class="flex items-center max-sm:w-full max-sm:pl-[3.25rem]">
						<button
							onclick={() => toggleVisibility(section.section_key)}
							class={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 sm:py-2.5 w-full sm:w-auto rounded-xl text-xs font-label font-medium transition-all ${
								section.is_visible
									? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
									: 'bg-error/10 text-error hover:bg-error/20'
							}`}
						>
							<span class="material-symbols-outlined text-[1.125rem]">
								{section.is_visible ? 'visibility' : 'visibility_off'}
							</span>
							{section.is_visible ? 'Ditampilkan' : 'Disembunyikan'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>