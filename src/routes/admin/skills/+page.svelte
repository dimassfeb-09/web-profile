<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import AdminModal from '$lib/components/admin/ui/AdminModal.svelte';
	import IconPicker from '$lib/components/admin/ui/IconPicker.svelte';

	let { data }: PageProps = $props();
	const skillCategories = $derived(data.skills);

	interface SkillCategory {
		id: number;
		icon: string;
		title: string;
		skills: string[];
		color_class: string;
		delay_class: string;
	}

	let isModalOpen = $state(false);
	let editingCat = $state<SkillCategory | null>(null);
	let isLoading = $state(false);

	const emptyForm = () => ({ icon: '', title: '', skills: '', color_class: '', delay_class: '' });

	let formData = $state(emptyForm());

	const handleEdit = (cat: SkillCategory) => {
		editingCat = cat;
		formData = {
			icon: cat.icon,
			title: cat.title,
			skills: cat.skills.join(', '),
			color_class: cat.color_class,
			delay_class: cat.delay_class
		};
		isModalOpen = true;
	};

	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this category?')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to delete category');
		} finally {
			isLoading = false;
		}
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		isLoading = true;

		const payload = {
			...formData,
			skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s !== '')
		};

		try {
			const res = editingCat
				? await fetch(`/api/admin/skills/${editingCat.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					})
				: await fetch('/api/admin/skills', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload)
					});

			const result = await res.json();

			if (res.ok) {
				isModalOpen = false;
				formData = emptyForm();
				editingCat = null;
				await invalidateAll();
			} else {
				alert(result.message);
			}
		} catch {
			alert('Failed to save skills');
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="space-y-8">
	<AdminHeader
		title="Skill Categories"
		description="Manage your technical stacks and core competencies."
		buttonLabel="Add Category"
		onButtonClick={() => {
			editingCat = null;
			formData = emptyForm();
			isModalOpen = true;
		}}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
		{#each skillCategories as cat (cat.id)}
			<div
				class="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-8 flex flex-col group"
			>
				<div
					class={`w-14 h-14 rounded-2xl ${cat.color_class.replace('bg-opacity-10', 'bg-opacity-20')} flex items-center justify-center mb-6`}
				>
					<span class="material-symbols-outlined text-3xl">{cat.icon}</span>
				</div>
				<h3 class="font-headline text-xl font-bold text-on-surface mb-4">{cat.title}</h3>
				<div class="flex flex-wrap gap-2 mb-8 flex-grow">
					{#each cat.skills as skill, i (i)}
						<span
							class="px-3 py-1.5 h-min rounded-xl bg-surface-container-high text-on-surface-variant font-label text-xs"
						>
							{skill}
						</span>
					{/each}
				</div>

				<div class="flex items-center gap-3">
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleEdit(cat)}
						class="flex-grow py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2 disabled:opacity-50"
					>
						<span class="material-symbols-outlined text-sm">edit</span>
						Edit
					</button>
					<button
						type="button"
						disabled={isLoading}
						onclick={() => handleDelete(cat.id)}
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
		title={editingCat ? 'Edit Category' : 'Add Category'}
	>
		<form onsubmit={handleSubmit} class="space-y-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<span class="font-label text-xs text-on-surface-variant ml-1 font-body"
						>Select Category Icon</span
					>
					<IconPicker value={formData.icon} onChange={(iconName) => (formData.icon = iconName)} />
				</div>
				<div class="space-y-2">
					<label for="skill-title" class="font-label text-xs text-on-surface-variant ml-1">Category Title</label>
					<input
						id="skill-title"
						type="text"
						required
						value={formData.title}
						oninput={(e) => (formData.title = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<div class="space-y-2">
				<label for="skill-skills" class="font-label text-xs text-on-surface-variant ml-1">Skills (comma separated)</label>
				<input
					id="skill-skills"
					type="text"
					required
					value={formData.skills}
					oninput={(e) => (formData.skills = (e.currentTarget as HTMLInputElement).value)}
					placeholder="React, Next.js, TypeScript"
					class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
				/>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="space-y-2">
					<label for="skill-color-class" class="font-label text-xs text-on-surface-variant ml-1">Color Class (Tailwind)</label>
					<input
						id="skill-color-class"
						type="text"
						required
						value={formData.color_class}
						oninput={(e) => (formData.color_class = (e.currentTarget as HTMLInputElement).value)}
						placeholder="e.g. bg-primary/10 text-primary"
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
				<div class="space-y-2">
					<label for="skill-delay-class" class="font-label text-xs text-on-surface-variant ml-1">Delay Class (Tailwind)</label>
					<input
						id="skill-delay-class"
						type="text"
						required
						value={formData.delay_class}
						oninput={(e) => (formData.delay_class = (e.currentTarget as HTMLInputElement).value)}
						class="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm font-body"
					/>
				</div>
			</div>

			<div class="pt-4">
				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-body disabled:opacity-50"
				>
					{isLoading ? 'Saving...' : editingCat ? 'Update Category' : 'Create Category'}
				</button>
			</div>
		</form>
	</AdminModal>
</div>