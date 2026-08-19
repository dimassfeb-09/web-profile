<script lang="ts">
	import type { PageProps } from './$types';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';

	let { data }: PageProps = $props();

	let isSaving = $state(false);
	let success = $state(false);
	const aboutData = () => data.about;
	let headline = $state(aboutData().headline);
	let paragraphs = $state(aboutData().paragraphs.join('\n\n'));

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isSaving = true;
		success = false;

		const payload = {
			headline,
			paragraphs: paragraphs.split('\n\n').map((p) => p.trim()).filter((p) => p !== '')
		};

		try {
			const res = await fetch('/api/admin/about', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const result = await res.json();
			if (res.ok) {
				success = true;
				setTimeout(() => (success = false), 3000);
			} else {
				alert(result.message || 'Failed to update about section');
			}
		} catch {
			alert('Failed to update about section');
		} finally {
			isSaving = false;
		}
	};
</script>

<div class="max-w-4xl space-y-10">
	<AdminHeader
		title="About Section"
		description="Manage the narrative of your professional personality and background."
	/>

	<form
		onsubmit={handleSubmit}
		class="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8"
	>
		<div class="space-y-2">
			<label for="about-headline" class="font-label text-sm text-on-surface-variant ml-1">Headline</label>
			<input
				id="about-headline"
				type="text"
				required
				value={headline}
				oninput={(e) => (headline = (e.currentTarget as HTMLInputElement).value)}
				class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-headline font-semibold text-lg"
			/>
		</div>

		<div class="space-y-2">
			<label for="about-paragraphs" class="font-label text-sm text-on-surface-variant ml-1"
				>Paragraphs (Separate paragraphs with a double newline)</label
			>
			<textarea
				id="about-paragraphs"
				required
				rows={12}
				value={paragraphs}
				oninput={(e) => (paragraphs = (e.currentTarget as HTMLTextAreaElement).value)}
				class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm resize-none custom-scrollbar"
			></textarea>
		</div>

		<div class="flex items-center gap-4 pt-4">
			<button
				type="submit"
				disabled={isSaving}
				class="px-10 py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
			>
				{#if isSaving}
					<div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
				{:else}
					Save Changes
				{/if}
			</button>

			{#if success}
				<div class="flex items-center gap-2 text-emerald-500 font-label text-sm animate-fade-in">
					<span class="material-symbols-outlined text-lg">check_circle</span>
					About data saved successfully!
				</div>
			{/if}
		</div>
	</form>
</div>