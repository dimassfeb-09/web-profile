<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';
	import ImageUploader from '$lib/components/admin/ui/ImageUploader.svelte';
	import ScreenshotUploader from '$lib/components/admin/ui/ScreenshotUploader.svelte';
	import SortFilter from '$lib/components/common/SortFilter.svelte';
	import CachedImage from '$lib/components/ui/CachedImage.svelte';

	let { data }: PageProps = $props();
	const projects = $derived(data.projects);

	interface Project {
		id: string;
		title: string;
		description: string;
		image_url: string;
		features: string[];
		link_url: string;
		link_text: string;
		slug?: string;
		long_description?: string | null;
		tech_stack?: string[];
		screenshots?: string[];
		status?: string;
		date?: string | Date | null;
		external_links?: Record<string, string> | null;
	}

	let isModalOpen = $state(false);
	let editingProject = $state<Project | null>(null);
	let isLoading = $state(false);

	const emptyForm = () => ({
		title: '',
		description: '',
		image_url: '',
		features: [''],
		link_url: '',
		link_text: '',
		slug: '',
		long_description: '',
		tech_stack: '',
		screenshots: [] as string[],
		status: 'completed',
		date: '',
		external_links: [{ label: '', url: '' }]
	});

	let formData = $state(emptyForm());
	let selectedFile = $state<File | null>(null);
	let screenshotFiles = $state<File[]>([]);

	const formatDateForInput = (dateStr: string | Date | undefined | null) => {
		if (!dateStr) return '';
		const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
		if (isNaN(date.getTime())) return '';
		return date.toISOString().split('T')[0];
	};

	const handleEdit = (project: Project) => {
		editingProject = project;

		const linksArray = project.external_links
			? Object.entries(project.external_links).map(([label, url]) => ({ label, url }))
			: [{ label: '', url: '' }];

		formData = {
			title: project.title,
			description: project.description,
			image_url: project.image_url,
			features: project.features.length > 0 ? [...project.features] : [''],
			link_url: project.link_url,
			link_text: project.link_text,
			slug: project.slug || '',
			long_description: project.long_description || '',
			tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
			screenshots: project.screenshots || [],
			status: project.status || 'completed',
			date: formatDateForInput(project.date),
			external_links: linksArray.length > 0 ? linksArray : [{ label: '', url: '' }]
		};
		selectedFile = null;
		screenshotFiles = [];
		isModalOpen = true;
	};

	const resetForm = () => {
		editingProject = null;
		formData = emptyForm();
		selectedFile = null;
		screenshotFiles = [];
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this project?')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to delete project');
		} finally {
			isLoading = false;
		}
	};

	const handleRowChange = (field: 'features' | 'screenshots', index: number, value: string) => {
		const updated = [...formData[field]];
		updated[index] = value;
		formData = { ...formData, [field]: updated };
	};

	const addRow = (field: 'features' | 'screenshots') => {
		formData = { ...formData, [field]: [...formData[field], ''] };
	};

	const removeRow = (field: 'features' | 'screenshots', index: number) => {
		if (formData[field].length === 1) {
			formData = { ...formData, [field]: [''] };
			return;
		}
		const updated = formData[field].filter((_, i) => i !== index);
		formData = { ...formData, [field]: updated };
	};

	const handleLinkChange = (index: number, key: 'label' | 'url', value: string) => {
		const updated = [...formData.external_links];
		updated[index][key] = value;
		formData = { ...formData, external_links: updated };
	};

	const addLinkRow = () => {
		formData = {
			...formData,
			external_links: [...formData.external_links, { label: '', url: '' }]
		};
	};

	const removeLinkRow = (index: number) => {
		if (formData.external_links.length === 1) {
			formData = { ...formData, external_links: [{ label: '', url: '' }] };
			return;
		}
		const updated = formData.external_links.filter((_, i) => i !== index);
		formData = { ...formData, external_links: updated };
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;

		let finalImageUrl = formData.image_url;

		try {
			if (selectedFile) {
				const fd = new FormData();
				fd.append('file', selectedFile);
				const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd });
				const uploadJson = await uploadRes.json();
				if (uploadRes.ok) {
					finalImageUrl = uploadJson.data.url;
				} else {
					throw new Error(uploadJson.message || 'Image upload failed');
				}
			}

			const uploadedScreenshotUrls: string[] = [];
			for (const file of screenshotFiles) {
				const fd = new FormData();
				fd.append('file', file);
				const res = await fetch('/api/admin/upload?bucket=project-screenshots', { method: 'POST', body: fd });
				const json = await res.json();
				if (!res.ok) {
					throw new Error(json.message || 'Screenshot upload failed');
				}
				uploadedScreenshotUrls.push(json.data.url);
			}

			const externalLinksRecord: Record<string, string> = {};
			formData.external_links.forEach((link) => {
				if (link.label.trim() && link.url.trim()) {
					externalLinksRecord[link.label.trim()] = link.url.trim();
				}
			});

			const payload = {
				...formData,
				image_url: finalImageUrl,
				features: formData.features.map((f) => f.trim()).filter((f) => f !== ''),
				tech_stack: formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
				screenshots: [...formData.screenshots, ...uploadedScreenshotUrls].filter(Boolean),
				external_links: externalLinksRecord,
				date: formData.date || null
			};

			const res = editingProject
				? await fetch(`/api/admin/projects/${editingProject.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					})
				: await fetch('/api/admin/projects', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					});

			const result = await res.json();

			if (res.ok) {
				isModalOpen = false;
				resetForm();
				await invalidateAll();
			} else {
				throw new Error(result.message || 'Failed to save project');
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
		title="Manage Projects"
		description="Add, edit, or remove projects. Images are automatically optimized."
		buttonLabel="Add Project"
		onButtonClick={() => {
			resetForm();
			isModalOpen = true;
		}}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
		{#each projects as project (project.id)}
			<div
				class="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group h-full"
			>
				<div class="aspect-[1024/500] w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden relative">
					{#if project.image_url}
						<CachedImage
							src={project.image_url}
							alt={project.title}
							class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
						/>
					{/if}
				</div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="font-headline text-lg font-bold text-on-surface">{project.title}</h3>
					<span
						class={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-tighter ${
							project.status?.toLowerCase() === 'completed'
								? 'bg-green-100/50 text-green-700 border-green-200'
								: 'bg-amber-100/50 text-amber-700 border-amber-200'
						}`}
					>
						{project.status || 'completed'}
					</span>
				</div>
				<p class="font-body text-xs text-primary mb-2 opacity-70">slug: {project.slug || '-'}</p>
				<p class="font-body text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">{project.description}</p>

				<div class="flex items-center gap-3 mt-auto">
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleEdit(project)}
						class="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
					>
						<span class="material-symbols-outlined text-sm">edit</span>
						Edit
					</button>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleDelete(project.id)}
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
		title={editingProject ? 'Edit Project' : 'Add New Project'}
		isLarge
	>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-4">
					<div class="space-y-2">
						<label for="project-title" class="font-label text-xs text-on-surface-variant ml-1 font-body">Project Title</label>
						<input
							id="project-title"
							type="text"
							required
							value={formData.title}
							oninput={(e) => (formData.title = (e.currentTarget as HTMLInputElement).value)}
							class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
						/>
					</div>

					<div class="space-y-2">
						<label for="project-slug" class="font-label text-xs text-on-surface-variant ml-1 font-body"
							>Project Slug (URL part)</label
						>
						<input
							id="project-slug"
							type="text"
							required
							placeholder="e.g. keuanganku"
							value={formData.slug}
							oninput={(e) => (formData.slug = (e.currentTarget as HTMLInputElement).value)}
							class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
						/>
					</div>
				</div>

				<ImageUploader
					value={formData.image_url}
					onChange={(file) => (selectedFile = file)}
					onClear={() => (formData.image_url = '')}
					label="Project Main Image"
					maxSizeMB={2}
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<label for="project-status" class="font-label text-xs text-on-surface-variant ml-1 font-body">Status</label>
					<select
						id="project-status"
						value={formData.status}
						onchange={(e) => (formData.status = (e.currentTarget as HTMLSelectElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					>
						<option value="completed">Completed</option>
						<option value="in progress">In Progress</option>
					</select>
				</div>
				<div class="space-y-2">
					<label for="project-date" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Release/Project Date</label
					>
					<input
						id="project-date"
						type="date"
						value={formData.date}
						oninput={(e) => (formData.date = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="project-description" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Short Description (Card)</label
				>
				<textarea
					id="project-description"
					required
					rows={2}
					value={formData.description}
					oninput={(e) => (formData.description = (e.currentTarget as HTMLTextAreaElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="project-long-description" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Long Description (Detail Page)</label
				>
				<textarea
					id="project-long-description"
					rows={5}
					value={formData.long_description}
					oninput={(e) => (formData.long_description = (e.currentTarget as HTMLTextAreaElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar whitespace-pre-wrap"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="project-tech-stack" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Tech Stack (comma separated)</label
				>
				<input
					id="project-tech-stack"
					type="text"
					placeholder="e.g. Flutter, Dart, Supabase"
					value={formData.tech_stack}
					oninput={(e) => (formData.tech_stack = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="space-y-3">
					<span class="font-label text-xs text-on-surface-variant ml-1 font-body">Features List</span>
					<div class="space-y-3">
						{#each formData.features as feature, index (index)}
							<div class="flex gap-2 animate-fade-in group">
								<input
									type="text"
									value={feature}
									oninput={(e) => handleRowChange('features', index, (e.currentTarget as HTMLInputElement).value)}
									placeholder={`Feature ${index + 1}`}
									class="flex-grow px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
								/>
								<button
									type="button"
									onclick={() => removeRow('features', index)}
									class="p-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
								>
									<span class="material-symbols-outlined text-lg">delete</span>
								</button>
							</div>
						{/each}
					</div>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => addRow('features')}
							class="flex-grow py-2 border border-dashed border-outline-variant/30 rounded-xl text-subtle-on-surface hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-label text-[10px] font-semibold uppercase tracking-wider"
						>
							<span class="material-symbols-outlined text-sm">add_circle</span>
							Add Feature
						</button>
						<div class="w-[44px] flex-shrink-0"></div>
					</div>
				</div>

				<ScreenshotUploader
					existingUrls={formData.screenshots}
					onFilesChange={(files) => (screenshotFiles = files)}
					onUrlsChange={(urls) => (formData.screenshots = urls)}
					maxImages={8}
					maxSizeMB={3}
				/>
			</div>

			<div class="space-y-3">
				<span class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Additional External Links</span
				>
				<div class="space-y-3">
					{#each formData.external_links as link, index (index)}
						<div class="flex items-center gap-2 animate-fade-in group">
							<div class="flex-grow grid grid-cols-2 gap-2">
								<input
									type="text"
									placeholder="Label (e.g. GitHub)"
									value={link.label}
									oninput={(e) => handleLinkChange(index, 'label', (e.currentTarget as HTMLInputElement).value)}
									class="px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
								/>
								<input
									type="text"
									placeholder="URL"
									value={link.url}
									oninput={(e) => handleLinkChange(index, 'url', (e.currentTarget as HTMLInputElement).value)}
									class="px-4 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
								/>
							</div>
							<button
								type="button"
								onclick={() => removeLinkRow(index)}
								class="p-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
							>
								<span class="material-symbols-outlined text-lg">delete</span>
							</button>
						</div>
					{/each}
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						onclick={addLinkRow}
						class="flex-grow py-2.5 border border-dashed border-outline-variant/30 rounded-xl text-subtle-on-surface hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-label text-[10px] font-semibold uppercase tracking-wider"
					>
						<span class="material-symbols-outlined text-sm">add_circle</span>
						Add External Link
					</button>
					<div class="w-[44px] flex-shrink-0"></div>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
				<div class="space-y-2">
					<label for="project-cta-url" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Primary CTA URL</label
					>
					<input
						id="project-cta-url"
						type="text"
						required
						placeholder="Main project URL or Store link"
						value={formData.link_url}
						oninput={(e) => (formData.link_url = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
				<div class="space-y-2">
					<label for="project-cta-text" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Primary CTA Text</label
					>
					<input
						id="project-cta-text"
						type="text"
						required
						placeholder="e.g. Play Store"
						value={formData.link_text}
						oninput={(e) => (formData.link_text = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
			>
				{isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
			</button>
		</form>
	</AdminModal>
</div>