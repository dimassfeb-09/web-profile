<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';
	import ImageUploader from '$lib/components/admin/ui/ImageUploader.svelte';
	import SortFilter from '$lib/components/common/SortFilter.svelte';
	import { slugify } from '$lib/utils/slugify';

	let { data }: PageProps = $props();
	const achievements = $derived(data.achievements);

	interface Achievement {
		id: string;
		slug: string;
		title: string;
		description: string;
		image_url: string | null;
		date: string | null;
		event_organizer?: string | null;
		category?: string | null;
		team_members?: string[] | null;
		tech_stack?: string[] | null;
		problem_statement?: string | null;
		solution_overview?: string | null;
		credential_url?: string | null;
		image_hash?: string | null;
	}

	let isModalOpen = $state(false);
	let editingAchievement = $state<Achievement | null>(null);
	let isLoading = $state(false);
	let isSlugManuallyEdited = $state(false);
	let slugStatus = $state<{ loading: boolean; available: boolean | null }>({
		loading: false,
		available: null
	});

	const emptyForm = () => ({
		title: '',
		slug: '',
		description: '',
		image_url: '',
		image_hash: '',
		date: '',
		event_organizer: '',
		category: '',
		team_members: '',
		tech_stack: '',
		problem_statement: '',
		solution_overview: '',
		credential_url: ''
	});

	let formData = $state(emptyForm());
	let selectedFile = $state<File | null>(null);

	const formatDateForInput = (dateStr: string | null) => {
		if (!dateStr) return '';
		return dateStr.split('T')[0];
	};

	const handleEdit = (achievement: Achievement) => {
		editingAchievement = achievement;
		formData = {
			title: achievement.title,
			slug: achievement.slug || '',
			description: achievement.description,
			image_url: achievement.image_url || '',
			image_hash: achievement.image_hash || '',
			date: formatDateForInput(achievement.date),
			event_organizer: achievement.event_organizer || '',
			category: achievement.category || '',
			team_members: achievement.team_members ? achievement.team_members.join(', ') : '',
			tech_stack: achievement.tech_stack ? achievement.tech_stack.join(', ') : '',
			problem_statement: achievement.problem_statement || '',
			solution_overview: achievement.solution_overview || '',
			credential_url: achievement.credential_url || ''
		};
		selectedFile = null;
		isSlugManuallyEdited = true;
		slugStatus = { loading: false, available: true };
		isModalOpen = true;
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this achievement?')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to delete achievement');
		} finally {
			isLoading = false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;

		let finalImageUrl = formData.image_url;
		let finalImageHash = formData.image_hash;

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
					finalImageHash = uploadJson.data.hash;
				} else {
					throw new Error(uploadJson.message || 'Image upload failed');
				}
			}

			const payload = {
				...formData,
				tech_stack: formData.tech_stack
					? formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
					: null,
				team_members: formData.team_members
					? formData.team_members.split(',').map((s) => s.trim()).filter(Boolean)
					: null,
				image_url: finalImageUrl || null,
				image_hash: finalImageHash || null,
				date: formData.date || null
			};

			const res = editingAchievement
				? await fetch(`/api/admin/achievements/${editingAchievement.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					})
				: await fetch('/api/admin/achievements', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					});

			const result = await res.json();

			if (res.ok) {
				isModalOpen = false;
				formData = emptyForm();
				selectedFile = null;
				editingAchievement = null;
				await invalidateAll();
			} else {
				throw new Error(result.message || 'Failed to save achievement');
			}
		} catch (err: any) {
			alert(err.message);
		} finally {
			isLoading = false;
		}
	};

	const handleSlugBlur = () => {
		formData = { ...formData, slug: slugify(formData.slug) };
	};

	$effect(() => {
		if (!isModalOpen) return;
		const debouncedSlug = formData.slug;
		if (!debouncedSlug) {
			slugStatus = { loading: false, available: null };
			return;
		}
		const timeout = setTimeout(async () => {
			slugStatus = { loading: true, available: null };
			try {
				const excludeId = editingAchievement ? `&excludeId=${editingAchievement.id}` : '';
				const res = await fetch(
					`/api/admin/achievements/check-slug?slug=${encodeURIComponent(debouncedSlug)}${excludeId}`
				);
				const data = await res.json();
				slugStatus = { loading: false, available: data.available };
			} catch {
				slugStatus = { loading: false, available: null };
			}
		}, 300);
		return () => clearTimeout(timeout);
	});
</script>

<div class="space-y-8">
	<div class="flex justify-end">
		<SortFilter />
	</div>

	<AdminHeader
		title="Achievements"
		description="Display your awards and special recognition."
		buttonLabel="Add Achievement"
		onButtonClick={() => {
			editingAchievement = null;
			formData = emptyForm();
			selectedFile = null;
			isSlugManuallyEdited = false;
			slugStatus = { loading: false, available: null };
			isModalOpen = true;
		}}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each achievements as achievement (achievement.id)}
			<div
				class="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col group"
			>
				{#if achievement.image_url}
					<div class="aspect-video w-full rounded-2xl bg-surface-container-high mb-6 overflow-hidden relative">
						<img
							src={achievement.image_url}
							alt={achievement.title}
							class="absolute inset-0 w-full h-full object-cover"
						/>
					</div>
				{:else}
					<div class="aspect-video w-full rounded-2xl bg-surface-container-high mb-6 flex items-center justify-center">
						<span class="material-symbols-outlined text-4xl text-on-surface-variant/20">emoji_events</span>
					</div>
				{/if}

				<h3 class="font-headline text-lg font-bold text-on-surface mb-2">{achievement.title}</h3>
				<p class="font-body text-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">
					{achievement.description}
				</p>

				<div class="flex items-center gap-3">
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleEdit(achievement)}
						class="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2"
					>
						<span class="material-symbols-outlined text-sm">edit</span>
						Edit
					</button>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleDelete(achievement.id)}
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
		title={editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
	>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="space-y-2">
				<label for="ach-title" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Achievement Title</label
				>
				<input
					id="ach-title"
					type="text"
					required
					value={formData.title}
					oninput={(e) => {
						const newTitle = (e.currentTarget as HTMLInputElement).value;
						formData = {
							...formData,
							title: newTitle,
							slug: isSlugManuallyEdited ? formData.slug || '' : slugify(newTitle)
						};
					}}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between items-center px-1">
					<label for="ach-slug" class="font-label text-xs text-on-surface-variant font-body">Slug</label>
					<span class="text-[10px] text-on-surface-variant/60 font-body"
						>{(formData.slug || '').length}/100</span
					>
				</div>
				<input
					id="ach-slug"
					type="text"
					required
					maxlength={100}
					value={formData.slug}
					oninput={(e) => {
						const newSlug = (e.currentTarget as HTMLInputElement).value
							.toLowerCase()
							.replace(/[\s_-]+/g, '-');
						isSlugManuallyEdited = newSlug !== '';
						formData = { ...formData, slug: newSlug };
					}}
					onblur={handleSlugBlur}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
				<div class="flex justify-between items-center px-1">
					<p class="text-[11px] text-on-surface-variant/60 font-body">
						URL Preview: https://www.dimassfeb.com/achievements/{formData.slug || 'slug-otomatis'}
					</p>
					{#if slugStatus.loading}
						<span class="text-[10px] text-primary animate-pulse font-body">Checking...</span>
					{:else if slugStatus.available === true}
						<span class="text-[10px] text-green-500 flex items-center gap-1 font-body">
							<span class="material-symbols-outlined text-[12px]">check_circle</span>
							Slug tersedia
						</span>
					{:else if slugStatus.available === false}
						<span class="text-[10px] text-error flex items-center gap-1 font-body">
							<span class="material-symbols-outlined text-[12px]">cancel</span>
							Slug sudah dipakai
						</span>
					{/if}
				</div>
			</div>

			<ImageUploader
				value={formData.image_url}
				onChange={(file) => (selectedFile = file)}
				onClear={() => (formData.image_url = '')}
				label="Achievement Image/Proof"
				maxSizeMB={2}
				aspectRatio="aspect-video"
			/>

			<div class="space-y-2">
				<label for="ach-description" class="font-label text-xs text-on-surface-variant ml-1 font-body">Description</label>
				<textarea
					id="ach-description"
					required
					rows={3}
					value={formData.description}
					oninput={(e) => (formData.description = (e.currentTarget as HTMLTextAreaElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="ach-date" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Date (Optional)</label
				>
				<input
					id="ach-date"
					type="date"
					value={formData.date}
					oninput={(e) => (formData.date = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<label for="ach-event-organizer" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Event Organizer (Optional)</label
					>
					<input
						id="ach-event-organizer"
						type="text"
						value={formData.event_organizer}
						oninput={(e) => (formData.event_organizer = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
				<div class="space-y-2">
					<label for="ach-category" class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Category (Optional)</label
					>
					<input
						id="ach-category"
						type="text"
						value={formData.category}
						oninput={(e) => (formData.category = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="ach-problem" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Problem Statement (Optional)</label
				>
				<textarea
					id="ach-problem"
					rows={3}
					value={formData.problem_statement}
					oninput={(e) => (formData.problem_statement = (e.currentTarget as HTMLTextAreaElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="ach-solution" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Solution Overview (Optional)</label
				>
				<textarea
					id="ach-solution"
					rows={3}
					value={formData.solution_overview}
					oninput={(e) => (formData.solution_overview = (e.currentTarget as HTMLTextAreaElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none font-body custom-scrollbar"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="ach-tech-stack" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Tech Stack (comma separated)</label
				>
				<input
					id="ach-tech-stack"
					type="text"
					value={formData.tech_stack}
					oninput={(e) => (formData.tech_stack = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="space-y-2">
				<label for="ach-team-members" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Team Members (comma separated)</label
				>
				<input
					id="ach-team-members"
					type="text"
					value={formData.team_members}
					oninput={(e) => (formData.team_members = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="space-y-2">
				<label for="ach-credential-url" class="font-label text-xs text-on-surface-variant ml-1 font-body"
					>Credential URL (Optional)</label
				>
				<input
					id="ach-credential-url"
					type="url"
					value={formData.credential_url}
					oninput={(e) => (formData.credential_url = (e.currentTarget as HTMLInputElement).value)}
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="pt-4">
				<button
					type="submit"
					disabled={isLoading || slugStatus.available === false}
					class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-body"
				>
					{isLoading ? 'Saving...' : editingAchievement ? 'Update Achievement' : 'Create Achievement'}
				</button>
			</div>
		</form>
	</AdminModal>
</div>