<script lang="ts">
	import type { PageProps } from './$types';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';

	let { data }: PageProps = $props();

	let isSaving = $state(false);
	let success = $state(false);

	const initialForm = () => ({
		headline: data.contact.headline,
		description: data.contact.description,
		email: data.contact.email,
		linkedin_url: data.contact.linkedin_url,
		github_url: data.contact.github_url || '',
		instagram_url: data.contact.instagram_url || '',
		twitter_url: data.contact.twitter_url || ''
	});
	const formData = $state(initialForm());

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isSaving = true;
		success = false;

		try {
			const res = await fetch('/api/admin/contact', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});
			const result = await res.json();
			if (res.ok) {
				success = true;
				setTimeout(() => (success = false), 3000);
			} else {
				alert(result.message || 'Failed to update contact section');
			}
		} catch {
			alert('Failed to update contact section');
		} finally {
			isSaving = false;
		}
	};
</script>

<div class="max-w-4xl space-y-10">
	<AdminHeader
		title="Contact Details"
		description="Manage how visitors can reach out to you professionally."
	/>

	<form
		onsubmit={handleSubmit}
		class="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8"
	>
		<div class="space-y-2">
			<label for="contact-headline" class="font-label text-sm text-on-surface-variant ml-1">Headline</label>
			<input
				id="contact-headline"
				type="text"
				required
				value={formData.headline}
				oninput={(e) => (formData.headline = (e.currentTarget as HTMLInputElement).value)}
				class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-headline font-semibold text-lg"
			/>
		</div>

		<div class="space-y-2">
			<label for="contact-description" class="font-label text-sm text-on-surface-variant ml-1">Footer Description</label>
			<textarea
				id="contact-description"
				required
				rows={3}
				value={formData.description}
				oninput={(e) => (formData.description = (e.currentTarget as HTMLTextAreaElement).value)}
				class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm resize-none custom-scrollbar"
			></textarea>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="space-y-2">
				<label for="contact-email" class="font-label text-sm text-on-surface-variant ml-1">Public Email</label>
				<input
					id="contact-email"
					type="email"
					required
					value={formData.email}
					oninput={(e) => (formData.email = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
			<div class="space-y-2">
				<label for="contact-linkedin" class="font-label text-sm text-on-surface-variant ml-1">LinkedIn Profile URL</label>
				<input
					id="contact-linkedin"
					type="url"
					required
					value={formData.linkedin_url}
					oninput={(e) => (formData.linkedin_url = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="space-y-2">
				<label for="contact-github" class="font-label text-sm text-on-surface-variant ml-1">GitHub Profile URL</label>
				<input
					id="contact-github"
					type="url"
					placeholder="https://github.com/..."
					value={formData.github_url}
					oninput={(e) => (formData.github_url = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
			<div class="space-y-2">
				<label for="contact-instagram" class="font-label text-sm text-on-surface-variant ml-1">Instagram URL</label>
				<input
					id="contact-instagram"
					type="url"
					placeholder="https://instagram.com/..."
					value={formData.instagram_url}
					oninput={(e) => (formData.instagram_url = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
			<div class="space-y-2">
				<label for="contact-twitter" class="font-label text-sm text-on-surface-variant ml-1">Twitter / X URL</label>
				<input
					id="contact-twitter"
					type="url"
					placeholder="https://x.com/..."
					value={formData.twitter_url}
					oninput={(e) => (formData.twitter_url = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-5 py-4 rounded-2xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all font-body text-sm"
				/>
			</div>
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
					Contact information updated!
				</div>
			{/if}
		</div>
	</form>
</div>