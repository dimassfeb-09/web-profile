<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';
	import ImageUploader from '$lib/components/admin/ui/ImageUploader.svelte';
	import SortFilter from '$lib/components/common/SortFilter.svelte';

	let { data }: PageProps = $props();
	const certificates = $derived(data.certificates);

	interface Certificate {
		id: string;
		title: string;
		issuer: string;
		issue_date: string;
		credential_url: string | null;
		image_url: string | null;
		description?: string;
	}

	let isModalOpen = $state(false);
	let editingCert = $state<Certificate | null>(null);
	let isLoading = $state(false);

	const emptyForm = () => ({
		title: '',
		issuer: '',
		issue_date: '',
		credential_url: '',
		image_url: '',
		description: ''
	});

	let formData = $state(emptyForm());
	let selectedFile = $state<File | null>(null);

	const formatDateForInput = (dateStr: string | null) => {
		if (!dateStr) return '';
		return dateStr.split('T')[0];
	};

	const handleEdit = (cert: Certificate) => {
		editingCert = cert;
		formData = {
			title: cert.title,
			issuer: cert.issuer,
			issue_date: formatDateForInput(cert.issue_date),
			credential_url: cert.credential_url || '',
			image_url: cert.image_url || '',
			description: cert.description || ''
		};
		selectedFile = null;
		isModalOpen = true;
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this certificate?')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to delete certificate');
		} finally {
			isLoading = false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;

		let finalImageUrl = formData.image_url;

		try {
			if (selectedFile) {
				const uploadFormData = new FormData();
				uploadFormData.append('file', selectedFile);

				const uploadRes = await fetch('/api/admin/upload', {
					method: 'POST',
					body: uploadFormData
				});

				const uploadJson = await uploadRes.json();
				if (uploadRes.ok) {
					finalImageUrl = uploadJson.data.url;
				} else {
					throw new Error(uploadJson.message || 'Image upload failed');
				}
			}

			const payload = {
				title: formData.title,
				issuer: formData.issuer,
				issue_date: formData.issue_date,
				credential_url: formData.credential_url || null,
				image_url: finalImageUrl || null,
				description: formData.description
			};

			const res = editingCert
				? await fetch(`/api/admin/certificates/${editingCert.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					})
				: await fetch('/api/admin/certificates', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					});

			const result = await res.json();

			if (res.ok) {
				isModalOpen = false;
				formData = emptyForm();
				selectedFile = null;
				editingCert = null;
				await invalidateAll();
			} else {
				throw new Error(result.message || 'Failed to save certificate');
			}
		} catch (err: any) {
			alert(err.message);
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="space-y-8">
	<div class="flex justify-end">
		<SortFilter />
	</div>

	<AdminHeader
		title="Certificates"
		description="Manage your professional certifications and licenses."
		buttonLabel="Add Certificate"
		onButtonClick={() => {
			editingCert = null;
			formData = emptyForm();
			selectedFile = null;
			isModalOpen = true;
		}}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each certificates as cert (cert.id)}
			<div
				class="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group"
			>
				<div class="aspect-[4/3] w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden relative">
					{#if cert.image_url}
						<img
							src={cert.image_url}
							alt={cert.title}
							class="absolute inset-0 w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full flex items-center justify-center text-on-surface-variant/20">
							<span class="material-symbols-outlined text-4xl">workspace_premium</span>
						</div>
					{/if}
				</div>

				<h3 class="font-headline text-lg font-bold text-on-surface mb-1">{cert.title}</h3>
				<p class="font-label text-sm text-primary font-semibold mb-2">{cert.issuer}</p>
				<p class="font-body text-xs text-on-surface-variant line-clamp-2 mb-6 flex-grow">
					{cert.description}
				</p>

				<div class="flex items-center gap-3">
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleEdit(cert)}
						class="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
					>
						<span class="material-symbols-outlined text-sm">edit</span>
						Edit
					</button>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleDelete(cert.id)}
						class="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all"
					>
						<span class="material-symbols-outlined text-lg">delete</span>
					</button>
				</div>
			</div>
		{/each}
	</div>

	<AdminModal
		isOpen={isModalOpen}
		onClose={() => (isModalOpen = false)}
		title={editingCert ? 'Edit Certificate' : 'Add Certificate'}
	>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<label for="cert-title" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Certificate Title</label
					>
					<input
						id="cert-title"
						type="text"
						required
						value={formData.title}
						oninput={(e) => (formData.title = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
				<div class="space-y-2">
					<label for="cert-issuer" class="font-label text-xs text-on-surface-variant ml-1 font-body">Issuer</label>
					<input
						id="cert-issuer"
						type="text"
						required
						value={formData.issuer}
						oninput={(e) => (formData.issuer = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<ImageUploader
				value={formData.image_url}
				onChange={(file) => (selectedFile = file)}
				onClear={() => (formData.image_url = '')}
				label="Certificate Proof (Image)"
				maxSizeMB={2}
				aspectRatio="aspect-[4/3]"
			/>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<label for="cert-issue-date" class="font-label text-xs text-on-surface-variant ml-1 font-body">Issue Date</label>
					<input
						id="cert-issue-date"
						type="date"
						required
						value={formData.issue_date}
						oninput={(e) => (formData.issue_date = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
				<div class="space-y-2">
					<label for="cert-credential-url" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Credential URL (Optional)</label
					>
					<input
						id="cert-credential-url"
						type="text"
						value={formData.credential_url}
						oninput={(e) => (formData.credential_url = (e.currentTarget as HTMLInputElement).value)}
						placeholder="https://..."
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="cert-description" class="font-label text-xs text-on-surface-variant ml-1 font-body">Description</label>
				<textarea
					id="cert-description"
					required
					rows={3}
					value={formData.description}
					oninput={(e) => (formData.description = (e.currentTarget as HTMLTextAreaElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
				></textarea>
			</div>

			<div class="pt-4">
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
				>
					{isLoading ? 'Saving...' : editingCert ? 'Update Certificate' : 'Create Certificate'}
				</button>
			</div>
		</form>
	</AdminModal>
</div>