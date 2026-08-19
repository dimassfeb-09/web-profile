<script lang="ts">
	import type { PageProps } from './$types';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';

	let { data }: PageProps = $props();

	let isSaving = $state(false);
	let success = $state(false);

	const initialForm = () => ({
		badge_text: data.home.badge_text,
		headline: data.home.headline,
		subheadline: data.home.subheadline,
		description: data.home.description,
		cv_url: data.home.cv_url
	});
	const formData = $state(initialForm());

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isSaving = true;
		success = false;

		try {
			const res = await fetch('/api/admin/home', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			const result = await res.json();
			if (res.ok) {
				success = true;
				setTimeout(() => (success = false), 3000);
			} else {
				alert(result.message || 'Failed to update home section');
			}
		} catch {
			alert('Failed to update home section');
		} finally {
			isSaving = false;
		}
	};
</script>

<div class="max-w-4xl space-y-10">
	<AdminHeader
		title="Home Section"
		description="Update the primary headline, subheadline, and CV download link of your portfolio."
	/>

	<form
		onsubmit={handleSubmit}
		class="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8"
	>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="space-y-2">
				<label for="home-badge" class="font-label text-sm text-on-surface-variant ml-1">Badge Text</label>
				<input
					id="home-badge"
					type="text"
					required
					value={formData.badge_text}
					oninput={(e) => (formData.badge_text = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
			<div class="space-y-2">
				<label for="home-cv" class="font-label text-sm text-on-surface-variant ml-1">CV Download URL</label>
				<input
					id="home-cv"
					type="text"
					required
					value={formData.cv_url}
					oninput={(e) => (formData.cv_url = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
		</div>

		<div class="space-y-2">
			<label for="home-headline" class="font-label text-sm text-on-surface-variant ml-1">Headline</label>
			<input
				id="home-headline"
				type="text"
				required
				value={formData.headline}
				oninput={(e) => (formData.headline = (e.currentTarget as HTMLInputElement).value)}
				class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-headline font-semibold text-lg"
			/>
		</div>

		<div class="space-y-2">
			<label for="home-subheadline" class="font-label text-sm text-on-surface-variant ml-1">Subheadline</label>
			<input
				id="home-subheadline"
				type="text"
				required
				value={formData.subheadline}
				oninput={(e) => (formData.subheadline = (e.currentTarget as HTMLInputElement).value)}
				class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
			/>
		</div>

		<div class="space-y-2">
			<label for="home-description" class="font-label text-sm text-on-surface-variant ml-1">Description</label>
			<textarea
				id="home-description"
				required
				rows={4}
				value={formData.description}
				oninput={(e) => (formData.description = (e.currentTarget as HTMLTextAreaElement).value)}
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
					Changes saved successfully!
				</div>
			{/if}
		</div>
	</form>
</div>