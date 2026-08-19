<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';

	let { data }: PageProps = $props();
	const experiences = $derived(data.experiences);

	interface Experience {
		id: number;
		role: string;
		company: string;
		start_date: string;
		end_date: string | null;
		description: string[];
		tags: string[];
	}

	let isModalOpen = $state(false);
	let editingExp = $state<Experience | null>(null);
	let isLoading = $state(false);

	const emptyForm = () => ({
		role: '',
		company: '',
		start_date: '',
		end_date: '',
		summary: '',
		highlights: '',
		tags: '',
		isCurrent: false
	});

	let formData = $state(emptyForm());

	const formatDateForInput = (dateStr: string | null) => {
		if (!dateStr) return '';
		return dateStr.split('T')[0];
	};

	const handleEdit = (exp: Experience) => {
		editingExp = exp;
		formData = {
			role: exp.role,
			company: exp.company,
			start_date: formatDateForInput(exp.start_date),
			end_date: formatDateForInput(exp.end_date),
			summary: exp.description[0] || '',
			highlights: exp.description.slice(1).join('\n'),
			tags: exp.tags ? exp.tags.join(', ') : '',
			isCurrent: exp.end_date === null
		};
		isModalOpen = true;
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this experience?')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to delete experience');
		} finally {
			isLoading = false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;

		if (
			!formData.isCurrent &&
			formData.end_date &&
			new Date(formData.end_date) < new Date(formData.start_date)
		) {
			alert('End date cannot be earlier than start date');
			isLoading = false;
			return;
		}

		const descriptionArr = [
			formData.summary.trim(),
			...formData.highlights
				.split('\n')
				.map((d) => d.trim())
				.filter((d) => d !== '')
		].filter((d) => d !== '');

		const payload = {
			role: formData.role,
			company: formData.company,
			start_date: formData.start_date,
			end_date: formData.isCurrent ? null : formData.end_date,
			description: descriptionArr,
			tags: formData.tags
				.split(',')
				.map((t) => t.trim())
				.filter((t) => t !== '')
		};

		try {
			const res = editingExp
				? await fetch(`/api/admin/experience/${editingExp.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					})
				: await fetch('/api/admin/experience', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					});

			const result = await res.json();

			if (res.ok) {
				isModalOpen = false;
				formData = emptyForm();
				editingExp = null;
				await invalidateAll();
			} else {
				alert(result.message || 'Failed to save experience');
			}
		} catch {
			alert('An error occurred. Please try again.');
		} finally {
			isLoading = false;
		}
	};

	const formatDisplayDate = (dateStr: string | null) => {
		if (!dateStr) return 'Present';
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat('id-ID', {
			month: 'short',
			year: 'numeric'
		}).format(date);
	};

	const companies = $derived(Array.from(new Set(experiences.map((exp) => exp.company))).sort());
</script>

<div class="space-y-8">
	<AdminHeader
		title="Experience History"
		description="Manage your professional journey with exact dates."
		buttonLabel="Add Experience"
		onButtonClick={() => {
			editingExp = null;
			formData = emptyForm();
			isModalOpen = true;
		}}
	/>

	<div class="space-y-4">
		{#each experiences as exp (exp.id)}
			<div
				class="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/20 transition-all"
			>
				<div class="flex-grow space-y-2">
					<div class="flex items-center gap-3">
						<h3 class="font-headline text-xl font-bold text-on-surface">{exp.role}</h3>
						<span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
							{formatDisplayDate(exp.start_date)} — {formatDisplayDate(exp.end_date)}
						</span>
					</div>
					<p class="font-label text-sm text-primary font-semibold">{exp.company}</p>
					<div class="text-sm text-on-surface-variant font-body">
						{exp.description.length} points of achievements
					</div>
					{#if exp.tags && exp.tags.length > 0}
						<div class="flex flex-wrap gap-2 mt-2">
							{#each exp.tags as tag, i (i)}
								<span
									class="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-medium border border-primary/10"
								>
									{tag}
								</span>
							{/each}
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-3">
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleEdit(exp)}
						class="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2 disabled:opacity-50"
					>
						<span class="material-symbols-outlined text-sm">edit</span>
						Edit
					</button>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleDelete(exp.id)}
						class="p-3 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all disabled:opacity-50"
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
		title={editingExp ? 'Edit Experience' : 'Add Experience'}
	>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<label for="exp-role" class="font-label text-xs text-on-surface-variant ml-1">Role / Position</label>
					<input
						id="exp-role"
						type="text"
						required
						value={formData.role}
						oninput={(e) => (formData.role = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
				<div class="space-y-2">
					<label for="exp-company" class="font-label text-xs text-on-surface-variant ml-1">Company</label>
					<input
						id="exp-company"
						type="text"
						required
						list="company-list"
						value={formData.company}
						oninput={(e) => (formData.company = (e.currentTarget as HTMLInputElement).value)}
						placeholder="Search or enter company..."
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
					<datalist id="company-list">
						{#each companies as company (company)}
							<option value={company}></option>
						{/each}
					</datalist>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex items-center gap-2 mb-2 ml-1">
					<input
						type="checkbox"
						id="isCurrent"
						checked={formData.isCurrent}
						onchange={(e) => (formData.isCurrent = (e.currentTarget as HTMLInputElement).checked)}
						class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
					/>
					<label for="isCurrent" class="font-label text-sm text-on-surface cursor-pointer">
						I currently work here
					</label>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<label for="exp-start-date" class="font-label text-xs text-on-surface-variant ml-1">Start Date</label>
						<input
							id="exp-start-date"
							type="date"
							required
							value={formData.start_date}
							oninput={(e) => (formData.start_date = (e.currentTarget as HTMLInputElement).value)}
							class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
						/>
					</div>
					<div class="space-y-2">
						<label
							for="exp-end-date"
							class={`font-label text-xs ml-1 ${
								formData.isCurrent ? 'text-on-surface-variant/40' : 'text-on-surface-variant'
							}`}
						>
							End Date
						</label>
						<input
							id="exp-end-date"
							type="date"
							required={!formData.isCurrent}
							disabled={formData.isCurrent}
							value={formData.end_date}
							oninput={(e) => (formData.end_date = (e.currentTarget as HTMLInputElement).value)}
							class={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-body ${
								formData.isCurrent
									? 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant/30 cursor-not-allowed'
									: 'bg-surface-container-high border-outline-variant/20 focus:outline-none focus:border-primary'
							}`}
						/>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<label for="exp-tags" class="font-label text-xs text-on-surface-variant ml-1">
					Tags (separated by commas, e.g. Flutter, Dart, Go)
				</label>
				<input
					id="exp-tags"
					type="text"
					value={formData.tags}
					oninput={(e) => (formData.tags = (e.currentTarget as HTMLInputElement).value)}
					placeholder="Flutter, Dart, Golang..."
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="space-y-2">
				<label for="exp-summary" class="font-label text-xs text-on-surface-variant ml-1">Work Summary (Paragraph)</label>
				<textarea
					id="exp-summary"
					required
					rows={3}
					value={formData.summary}
					oninput={(e) => (formData.summary = (e.currentTarget as HTMLTextAreaElement).value)}
					placeholder="Briefly explain your role and overall impact..."
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none custom-scrollbar font-body"
				></textarea>
			</div>

			<div class="space-y-2">
				<label for="exp-highlights" class="font-label text-xs text-on-surface-variant ml-1">
					Key Achievements (Bullet points - separate by enter)
				</label>
				<textarea
					id="exp-highlights"
					required
					rows={5}
					value={formData.highlights}
					oninput={(e) => (formData.highlights = (e.currentTarget as HTMLTextAreaElement).value)}
					placeholder="Developed a mobile app using Flutter...&#10;Optimized database performance by 40%..."
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none custom-scrollbar font-body"
				></textarea>
			</div>

			<div class="pt-4">
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body disabled:opacity-50"
				>
					{isLoading ? 'Saving...' : editingExp ? 'Update Experience' : 'Create Experience'}
				</button>
			</div>
		</form>
	</AdminModal>
</div>