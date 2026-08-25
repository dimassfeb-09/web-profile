<script lang="ts">
	import type { PageProps } from './$types';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import { GripVertical, Eye, EyeOff, Info, CheckCircle2 } from 'lucide-svelte';

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

	const flipDurationMs = 150;

	function handleDndConsider(e: CustomEvent<{ items: Section[] }>) {
		sections = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<{ items: Section[] }>) {
		sections = e.detail.items.map((item, index) => ({ ...item, order_index: index + 1 }));
	}

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

<div class="max-w-4xl space-y-6">
	<AdminHeader
		title="Layout & Section Order"
		description="Atur urutan tampilan section pada halaman portfolio Anda dengan drag and drop."
	/>

	<div class="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div class="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600">
				<Info size={14} class="text-zinc-500" />
				Geser handle untuk merubah urutan
			</div>

			<div class="flex items-center gap-2">
				<button
					onclick={handleReset}
					disabled={isSaving}
					class="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-all text-xs font-medium disabled:opacity-50"
				>
					Reset Perubahan
				</button>
				<button
					onclick={handleSave}
					disabled={isSaving}
					class="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-medium text-xs tracking-wide hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
				>
					{#if isSaving}
						<div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
					{/if}
					Simpan Urutan
				</button>
			</div>
		</div>

		{#if success}
			<div class="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
				<CheckCircle2 size={16} />
				Urutan section berhasil disimpan!
			</div>
		{/if}

		<div
			use:dndzone={{ items: sections, flipDurationMs }}
			onconsider={handleDndConsider}
			onfinalize={handleDndFinalize}
			class="space-y-3"
		>
			{#each sections as section (section.id)}
				<div
					animate:flip={{ duration: flipDurationMs }}
					class="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-white hover:shadow-sm transition-all"
				>
					<div class="flex items-start sm:items-center gap-3 w-full sm:w-auto">
						<div class="p-1.5 -ml-1 mt-1 sm:mt-0 text-zinc-400 hover:text-zinc-700 transition-colors cursor-grab active:cursor-grabbing touch-none shrink-0">
							<GripVertical size={18} />
						</div>

						<div class="flex items-center gap-3 flex-1 min-w-0">
							<div
								class="w-9 h-9 shrink-0 rounded-xl bg-white border border-zinc-200 flex items-center justify-center font-semibold text-xs text-zinc-700"
							>
								{section.order_index}
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-zinc-900 tracking-tight truncate text-sm">
									{section.section_label}
								</h4>
								<p class="text-xs text-zinc-500 truncate">
									Key: {section.section_key}
								</p>
							</div>
						</div>
					</div>

					<div class="flex items-center max-sm:w-full max-sm:pl-9">
						<button
							onclick={() => toggleVisibility(section.section_key)}
							class={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2 w-full sm:w-auto rounded-xl text-xs font-medium transition-all border ${
								section.is_visible
									? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
									: 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
							}`}
						>
							{#if section.is_visible}
								<Eye size={14} />
							{:else}
								<EyeOff size={14} />
							{/if}
							{section.is_visible ? 'Ditampilkan' : 'Disembunyikan'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
