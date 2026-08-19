<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';
	import ImageUploader from '$lib/components/admin/ui/ImageUploader.svelte';
	import { slugify } from '$lib/utils/slugify';

	let { data }: PageProps = $props();
	const educations = $derived(data.educations);
	const projects = $derived(data.projects);
	const certificates = $derived(data.certificates);
	const achievements = $derived(data.achievements);

	interface Education {
		id: string;
		slug: string;
		institution: string;
		degree?: string | null;
		major?: string | null;
		start_date: string;
		end_date?: string | null;
		is_current: boolean;
		description?: string | null;
		logo_url?: string | null;
		location?: string | null;
		gpa?: number | null;
		gallery?: any[];
		activities?: any[];
		project_ids?: string[];
		certificate_ids?: string[];
		achievement_ids?: string[];
	}

	let isModalOpen = $state(false);
	let editingEducation = $state<Education | null>(null);
	let isLoading = $state(false);
	let activeTab = $state<'general' | 'activities' | 'relations' | 'gallery'>('general');
	let isSlugManuallyEdited = $state(false);
	let slugStatus = $state<{ loading: boolean; available: boolean | null }>({
		loading: false,
		available: null
	});

	const emptyForm = () => ({
		institution: '',
		slug: '',
		degree: '',
		major: '',
		start_date: '',
		end_date: '',
		is_current: false,
		description: '',
		logo_url: '',
		location: '',
		gpa: '',
		gallery: [] as any[],
		activities: [] as any[],
		project_ids: [] as string[],
		certificate_ids: [] as string[],
		achievement_ids: [] as string[]
	});

	let formData = $state(emptyForm());
	let selectedLogo = $state<File | null>(null);

	let projectSearch = $state('');
	let certSearch = $state('');
	let achSearch = $state('');

	const filteredProjects = $derived(
		projects.filter((p) => p.title.toLowerCase().includes(projectSearch.toLowerCase()))
	);
	const filteredCertificates = $derived(
		certificates.filter((c) => c.title.toLowerCase().includes(certSearch.toLowerCase()))
	);
	const filteredAchievements = $derived(
		achievements.filter((a) => a.title.toLowerCase().includes(achSearch.toLowerCase()))
	);

	const formatDateForInput = (date: string | Date | null | undefined) => {
		if (!date) return '';
		if (date instanceof Date) return date.toISOString().split('T')[0];
		return date.split('T')[0];
	};

	const handleEdit = (edu: Education) => {
		editingEducation = edu;
		formData = {
			institution: edu.institution,
			slug: edu.slug,
			degree: edu.degree || '',
			major: edu.major || '',
			start_date: formatDateForInput(edu.start_date),
			end_date: formatDateForInput(edu.end_date ?? null),
			is_current: edu.is_current,
			description: edu.description || '',
			logo_url: edu.logo_url || '',
			location: edu.location || '',
			gpa: edu.gpa?.toString() || '',
			gallery: edu.gallery || [],
			activities: edu.activities || [],
			project_ids: edu.project_ids || [],
			certificate_ids: edu.certificate_ids || [],
			achievement_ids: edu.achievement_ids || []
		};
		selectedLogo = null;
		isSlugManuallyEdited = true;
		slugStatus = { loading: false, available: true };
		activeTab = 'general';
		isModalOpen = true;
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this education record?')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/admin/educations/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to delete education');
		} finally {
			isLoading = false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;

		let finalLogoUrl = formData.logo_url;

		try {
			if (selectedLogo) {
				const uploadFormData = new FormData();
				uploadFormData.append('file', selectedLogo);

				const uploadRes = await fetch('/api/admin/upload', {
					method: 'POST',
					body: uploadFormData
				});

				const uploadJson = await uploadRes.json();
				if (uploadRes.ok) {
					finalLogoUrl = uploadJson.data.url;
				} else {
					throw new Error(uploadJson.message || 'Logo upload failed');
				}
			}

			const payload = {
				...formData,
				logo_url: finalLogoUrl || null,
				gpa: formData.gpa ? parseFloat(formData.gpa) : null,
				end_date: formData.is_current ? null : formData.end_date || null
			};

			const res = editingEducation
				? await fetch(`/api/admin/educations/${editingEducation.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					})
				: await fetch('/api/admin/educations', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					});

			const result = await res.json();

			if (res.ok) {
				isModalOpen = false;
				handleClose();
				await invalidateAll();
			} else {
				throw new Error(result.message || 'Failed to save education');
			}
		} catch (err: any) {
			alert(err.message);
		} finally {
			isLoading = false;
		}
	};

	const handleClose = () => {
		isModalOpen = false;
		editingEducation = null;
		formData = emptyForm();
		selectedLogo = null;
		isSlugManuallyEdited = false;
		slugStatus = { loading: false, available: null };
		activeTab = 'general';
		projectSearch = '';
		certSearch = '';
		achSearch = '';
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
				const excludeId = editingEducation ? `&excludeId=${editingEducation.id}` : '';
				const res = await fetch(
					`/api/admin/educations/check-slug?slug=${encodeURIComponent(debouncedSlug)}${excludeId}`
				);
				const data = await res.json();
				slugStatus = { loading: false, available: data.available };
			} catch {
				slugStatus = { loading: false, available: null };
			}
		}, 300);
		return () => clearTimeout(timeout);
	});

	const addActivity = () => {
		formData = {
			...formData,
			activities: [
				...formData.activities,
				{ title: '', role: '', description: '', start_date: '', end_date: '' }
			]
		};
	};

	const removeActivity = (index: number) => {
		const newActivities = [...formData.activities];
		newActivities.splice(index, 1);
		formData = { ...formData, activities: newActivities };
	};

	const updateActivity = (index: number, key: string, value: string) => {
		const newActivities = [...formData.activities];
		newActivities[index][key] = value;
		formData = { ...formData, activities: newActivities };
	};

	const toggleProject = (projectId: string) => {
		formData = {
			...formData,
			project_ids: formData.project_ids.includes(projectId)
				? formData.project_ids.filter((id) => id !== projectId)
				: [...formData.project_ids, projectId]
		};
	};

	const toggleCertificate = (certId: string) => {
		formData = {
			...formData,
			certificate_ids: formData.certificate_ids.includes(certId)
				? formData.certificate_ids.filter((id) => id !== certId)
				: [...formData.certificate_ids, certId]
		};
	};

	const toggleAchievement = (achId: string) => {
		formData = {
			...formData,
			achievement_ids: formData.achievement_ids.includes(achId)
				? formData.achievement_ids.filter((id) => id !== achId)
				: [...formData.achievement_ids, achId]
		};
	};

	const tabs = ['general', 'activities', 'relations', 'gallery'] as const;
</script>

<div class="space-y-8">
	<AdminHeader
		title="Education"
		description="Manage your academic history and campus activities."
		buttonLabel="Add Education"
		onButtonClick={() => {
			editingEducation = null;
			formData = emptyForm();
			selectedLogo = null;
			isSlugManuallyEdited = false;
			slugStatus = { loading: false, available: null };
			activeTab = 'general';
			isModalOpen = true;
		}}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
		{#each educations as edu (edu.id)}
			<div
				class="bg-surface border border-outline-variant/20 rounded-2xl p-5 flex flex-col transition-colors hover:border-outline-variant/40"
			>
				<div class="flex items-start gap-4 mb-4">
					{#if edu.logo_url}
						<div class="w-12 h-12 rounded-lg overflow-hidden relative bg-white border border-outline-variant/10 flex-shrink-0">
							<img src={edu.logo_url} alt={edu.institution} class="absolute inset-0 w-full h-full object-contain p-1.5" />
						</div>
					{:else}
						<div
							class="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 border border-outline-variant/10"
						>
							<span class="material-symbols-outlined text-2xl text-on-surface-variant/30">school</span>
						</div>
					{/if}
					<div class="flex-grow min-w-0">
						<h3 class="text-sm font-bold text-on-surface truncate">{edu.institution}</h3>
						<p class="text-[11px] text-primary font-medium mt-0.5 truncate">
							{edu.degree} {edu.major ? `in ${edu.major}` : ''}
						</p>
						<p class="text-[10px] text-on-surface-variant/60 mt-1">
							{formatDateForInput(edu.start_date).split('-')[0]} —
							{edu.is_current
								? 'Present'
								: formatDateForInput(edu.end_date ?? null).split('-')[0]}
						</p>
					</div>
				</div>

				<p class="text-[12px] text-on-surface-variant line-clamp-2 mb-5 flex-grow leading-relaxed">
					{edu.description}
				</p>

				<div class="flex items-center gap-2">
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleEdit(edu)}
						class="flex-grow py-2 px-4 rounded-lg bg-surface-container-high text-on-surface text-[11px] font-bold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2 border border-transparent"
					>
						<span class="material-symbols-outlined text-sm">edit</span>
						Manage
					</button>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleDelete(edu.id)}
						class="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-all border border-transparent"
					>
						<span class="material-symbols-outlined text-lg">delete</span>
					</button>
				</div>
			</div>
		{/each}
	</div>

	<AdminModal
		isOpen={isModalOpen}
		onClose={handleClose}
		title={editingEducation ? 'Edit Education' : 'Add Education'}
		isLarge
		className="h-[750px] max-h-[90dvh]"
		bodyClassName="overflow-hidden pt-0"
	>
		<div class="flex border-b border-outline-variant/20 mb-6 overflow-x-auto hide-scrollbar shrink-0">
			{#each tabs as tab}
				<button
					type="button"
					onclick={() => (activeTab = tab)}
					class={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${
						activeTab === tab
							? 'border-b-2 border-primary text-primary'
							: 'text-on-surface-variant hover:text-on-surface'
					}`}
				>
					{tab === 'general' ? 'General Info' : tab === 'activities' ? 'Activities' : tab === 'relations' ? 'Relations' : 'Gallery'}
				</button>
			{/each}
		</div>

		<form onsubmit={handleSubmit} class="flex flex-col flex-grow overflow-hidden min-h-0">
			<div class="flex-grow space-y-6 mb-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
				{#if activeTab === 'general'}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-4 md:col-span-2">
							<div class="space-y-2">
								<label for="edu-institution" class="text-xs font-medium text-on-surface-variant ml-1">Institution Name</label>
								<input
									id="edu-institution"
									type="text"
									required
									value={formData.institution}
									oninput={(e) => {
										const val = (e.currentTarget as HTMLInputElement).value;
										formData = {
											...formData,
											institution: val,
											slug: isSlugManuallyEdited ? formData.slug : slugify(val)
										};
									}}
									class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
								/>
							</div>

							<div class="space-y-2">
								<label for="edu-slug" class="text-xs font-medium text-on-surface-variant ml-1">Slug</label>
								<input
									id="edu-slug"
									type="text"
									required
									value={formData.slug}
									oninput={(e) => {
										isSlugManuallyEdited = true;
										formData = { ...formData, slug: (e.currentTarget as HTMLInputElement).value };
									}}
									class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
								/>
								<div class="flex justify-between items-center px-1">
									<p class="text-[11px] text-on-surface-variant/60 font-body">
										URL Preview: https://www.dimassfeb.com/education/{formData.slug || 'slug'}
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
						</div>

						<div class="space-y-2">
							<label for="edu-degree" class="text-xs font-medium text-on-surface-variant ml-1"
								>Degree (e.g. Bachelor)</label
							>
							<input
								id="edu-degree"
								type="text"
								value={formData.degree}
								oninput={(e) => (formData.degree = (e.currentTarget as HTMLInputElement).value)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
							/>
						</div>

						<div class="space-y-2">
							<label for="edu-major" class="text-xs font-medium text-on-surface-variant ml-1">Major</label>
							<input
								id="edu-major"
								type="text"
								value={formData.major}
								oninput={(e) => (formData.major = (e.currentTarget as HTMLInputElement).value)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
							/>
						</div>

						<div class="space-y-2">
							<label for="edu-start-date" class="text-xs font-medium text-on-surface-variant ml-1">Start Date</label>
							<input
								id="edu-start-date"
								type="date"
								required
								value={formData.start_date}
								oninput={(e) => (formData.start_date = (e.currentTarget as HTMLInputElement).value)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
							/>
						</div>

						<div class="space-y-2">
							<label for="edu-end-date" class="text-xs font-medium text-on-surface-variant ml-1">End Date</label>
							<div class="flex items-center gap-4">
								<input
									id="edu-end-date"
									type="date"
									disabled={formData.is_current}
									value={formData.end_date}
									oninput={(e) => (formData.end_date = (e.currentTarget as HTMLInputElement).value)}
									class="flex-grow px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm disabled:opacity-50"
								/>
								<label class="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={formData.is_current}
										onchange={(e) => (formData.is_current = (e.currentTarget as HTMLInputElement).checked)}
										class="w-4 h-4 rounded border-outline-variant/20 text-primary focus:ring-primary"
									/>
									<span class="text-xs font-medium text-on-surface-variant">Current</span>
								</label>
							</div>
						</div>

						<div class="space-y-2">
							<label for="edu-gpa" class="text-xs font-medium text-on-surface-variant ml-1">GPA (e.g. 3.85)</label>
							<input
								id="edu-gpa"
								type="number"
								step="0.01"
								min="0"
								max="4"
								value={formData.gpa}
								oninput={(e) => (formData.gpa = (e.currentTarget as HTMLInputElement).value)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
							/>
						</div>

						<div class="space-y-2">
							<label for="edu-location" class="text-xs font-medium text-on-surface-variant ml-1">Location</label>
							<input
								id="edu-location"
								type="text"
								value={formData.location}
								oninput={(e) => (formData.location = (e.currentTarget as HTMLInputElement).value)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
							/>
						</div>

						<div class="md:col-span-2">
							<ImageUploader
								value={formData.logo_url}
								onChange={(file) => (selectedLogo = file)}
								onClear={() => (formData.logo_url = '')}
								label="Institution Logo"
								maxSizeMB={1}
								aspectRatio="aspect-square"
								className="w-32 mx-auto"
							/>
						</div>

						<div class="md:col-span-2 space-y-2">
							<label for="edu-description" class="text-xs font-medium text-on-surface-variant ml-1">Description</label>
							<textarea
								id="edu-description"
								rows={4}
								value={formData.description}
								oninput={(e) => (formData.description = (e.currentTarget as HTMLTextAreaElement).value)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none"
							></textarea>
						</div>
					</div>
				{/if}

				{#if activeTab === 'activities'}
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<h4 class="text-sm font-bold text-on-surface">Activities & Organizations</h4>
							<button
								type="button"
								onclick={addActivity}
								class="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
							>
								+ Add Activity
							</button>
						</div>

						{#each formData.activities as activity, index (index)}
							<div class="p-4 rounded-2xl bg-surface-container-high border border-outline-variant/10 space-y-4 relative group">
								<button
									type="button"
									onclick={() => removeActivity(index)}
									class="absolute top-4 right-4 text-error opacity-0 group-hover:opacity-100 transition-all"
								>
									<span class="material-symbols-outlined">delete</span>
								</button>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									<input
										placeholder="Title (e.g. Student Council)"
										value={activity.title}
										oninput={(e) => updateActivity(index, 'title', (e.currentTarget as HTMLInputElement).value)}
										class="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
									/>
									<input
										placeholder="Role (e.g. President)"
										value={activity.role}
										oninput={(e) => updateActivity(index, 'role', (e.currentTarget as HTMLInputElement).value)}
										class="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
									/>
									<input
										type="date"
										value={formatDateForInput(activity.start_date)}
										oninput={(e) => updateActivity(index, 'start_date', (e.currentTarget as HTMLInputElement).value)}
										class="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
									/>
									<input
										type="date"
										value={formatDateForInput(activity.end_date)}
										oninput={(e) => updateActivity(index, 'end_date', (e.currentTarget as HTMLInputElement).value)}
										class="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
									/>
								</div>
								<textarea
									placeholder="Description"
									rows={2}
									value={activity.description || ''}
									oninput={(e) => updateActivity(index, 'description', (e.currentTarget as HTMLTextAreaElement).value)}
									class="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm resize-none"
								></textarea>
							</div>
						{/each}
					</div>
				{/if}

				{#if activeTab === 'relations'}
					<div class="flex flex-col h-full space-y-6">
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
							<div class="flex flex-col min-h-0 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
								<div class="flex items-center justify-between mb-4">
									<h4 class="text-xs font-bold text-on-surface flex items-center gap-2">
										<span class="material-symbols-outlined text-base text-primary">rocket_launch</span>
										Projects
									</h4>
									<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
										{formData.project_ids.length}
									</span>
								</div>
								<div class="relative mb-3">
									<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
										search
									</span>
									<input
										type="text"
										placeholder="Search..."
										value={projectSearch}
										oninput={(e) => (projectSearch = (e.currentTarget as HTMLInputElement).value)}
										class="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[11px] outline-none"
									/>
								</div>
								<div class="flex-grow overflow-y-auto pr-1 space-y-1.5 custom-scrollbar min-h-0">
									{#each filteredProjects as p (p.id)}
										<label
											class={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
												formData.project_ids.includes(p.id)
													? 'bg-primary/5 border-primary/20'
													: 'bg-surface-container-low border-transparent hover:border-outline-variant/20'
											}`}
										>
											<input type="checkbox" hidden checked={formData.project_ids.includes(p.id)} onchange={() => toggleProject(p.id)} />
											<div
												class={`w-4 h-4 rounded flex items-center justify-center transition-all ${
													formData.project_ids.includes(p.id)
														? 'bg-primary text-on-primary'
														: 'border border-outline-variant/30'
												}`}
											>
												{#if formData.project_ids.includes(p.id)}
													<span class="material-symbols-outlined text-[10px] font-bold">check</span>
												{/if}
											</div>
											<span class="text-[11px] font-medium truncate">{p.title}</span>
										</label>
									{/each}
								</div>
							</div>

							<div class="flex flex-col min-h-0 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
								<div class="flex items-center justify-between mb-4">
									<h4 class="text-xs font-bold text-on-surface flex items-center gap-2">
										<span class="material-symbols-outlined text-base text-primary">verified</span>
										Certificates
									</h4>
									<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
										{formData.certificate_ids.length}
									</span>
								</div>
								<div class="relative mb-3">
									<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
										search
									</span>
									<input
										type="text"
										placeholder="Search..."
										value={certSearch}
										oninput={(e) => (certSearch = (e.currentTarget as HTMLInputElement).value)}
										class="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[11px] outline-none"
									/>
								</div>
								<div class="flex-grow overflow-y-auto pr-1 space-y-1.5 custom-scrollbar min-h-0">
									{#each filteredCertificates as c (c.id)}
										<label
											class={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
												formData.certificate_ids.includes(c.id)
													? 'bg-primary/5 border-primary/20'
													: 'bg-surface-container-low border-transparent hover:border-outline-variant/20'
											}`}
										>
											<input type="checkbox" hidden checked={formData.certificate_ids.includes(c.id)} onchange={() => toggleCertificate(c.id)} />
											<div
												class={`w-4 h-4 rounded flex items-center justify-center transition-all ${
													formData.certificate_ids.includes(c.id)
														? 'bg-primary text-on-primary'
														: 'border border-outline-variant/30'
												}`}
											>
												{#if formData.certificate_ids.includes(c.id)}
													<span class="material-symbols-outlined text-[10px] font-bold">check</span>
												{/if}
											</div>
											<span class="text-[11px] font-medium truncate">{c.title}</span>
										</label>
									{/each}
								</div>
							</div>

							<div class="flex flex-col min-h-0 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
								<div class="flex items-center justify-between mb-4">
									<h4 class="text-xs font-bold text-on-surface flex items-center gap-2">
										<span class="material-symbols-outlined text-base text-primary">military_tech</span>
										Achievements
									</h4>
									<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
										{formData.achievement_ids.length}
									</span>
								</div>
								<div class="relative mb-3">
									<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
										search
									</span>
									<input
										type="text"
										placeholder="Search..."
										value={achSearch}
										oninput={(e) => (achSearch = (e.currentTarget as HTMLInputElement).value)}
										class="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[11px] outline-none"
									/>
								</div>
								<div class="flex-grow overflow-y-auto pr-1 space-y-1.5 custom-scrollbar min-h-0">
									{#each filteredAchievements as a (a.id)}
										<label
											class={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
												formData.achievement_ids.includes(a.id)
													? 'bg-primary/5 border-primary/20'
													: 'bg-surface-container-low border-transparent hover:border-outline-variant/20'
											}`}
										>
											<input type="checkbox" hidden checked={formData.achievement_ids.includes(a.id)} onchange={() => toggleAchievement(a.id)} />
											<div
												class={`w-4 h-4 rounded flex items-center justify-center transition-all ${
													formData.achievement_ids.includes(a.id)
														? 'bg-primary text-on-primary'
														: 'border border-outline-variant/30'
												}`}
											>
												{#if formData.achievement_ids.includes(a.id)}
													<span class="material-symbols-outlined text-[10px] font-bold">check</span>
												{/if}
											</div>
											<span class="text-[11px] font-medium truncate">{a.title}</span>
										</label>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/if}

				{#if activeTab === 'gallery'}
					<div class="space-y-4">
						<p class="text-xs text-on-surface-variant italic">
							Gallery management feature is coming soon in MVP phase 2. You can upload photos via
							the main description for now if needed.
						</p>
					</div>
				{/if}
			</div>

			<div class="pt-6 border-t border-outline-variant/20 flex gap-4 shrink-0">
				{#if activeTab !== 'general'}
					<button
						type="button"
						onclick={() => (activeTab = tabs[tabs.indexOf(activeTab) - 1])}
						class="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-container-highest transition-all"
					>
						Back
					</button>
				{/if}

				{#if activeTab !== 'gallery'}
					<button
						type="button"
						onclick={() => (activeTab = tabs[tabs.indexOf(activeTab) + 1])}
						class="flex-grow py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
					>
						Next Step
					</button>
				{:else}
					<button
						type="submit"
						disabled={isLoading || slugStatus.available === false}
						class="flex-grow py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
					>
						{isLoading
							? 'Saving...'
							: editingEducation
								? 'Update Education'
								: 'Create Education'}
					</button>
				{/if}
			</div>
		</form>
	</AdminModal>
</div>