<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import AdminHeader from '$lib/components/admin/ui/AdminHeader.svelte';
	import SortFilter from '$lib/components/common/SortFilter.svelte';

	let { data }: PageProps = $props();
	const blogs = $derived(data.blogs);

	let isLoading = $state(false);
	let searchTerm = $state(page.url.searchParams.get('search') || '');

	let searchTimeout: ReturnType<typeof setTimeout> | undefined;

	const debouncedSearch = (value: string) => {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const params = new URLSearchParams(page.url.searchParams);
			if (value) {
				params.set('search', value);
			} else {
				params.delete('search');
			}
			const qs = params.toString();
			goto(`${page.url.pathname}${qs ? `?${qs}` : ''}`, { replaceState: true });
		}, 500);
	};

	const handleSearchChange = (e: Event) => {
		const value = (e.currentTarget as HTMLInputElement).value;
		searchTerm = value;
		debouncedSearch(value);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this blog? This will also delete all images associated with it.')) return;
		isLoading = true;
		try {
			const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
			const result = await res.json();
			if (res.ok) {
				await invalidateAll();
			} else {
				alert(result.message || 'Failed to delete blog');
			}
		} catch {
			alert('Failed to delete blog');
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="space-y-8">
	<AdminHeader
		title="Manage Blog Posts"
		description="Write, edit, and publish your thoughts."
		buttonLabel="Create Post"
		icon="add"
		onButtonClick={() => goto('/admin/blog/create')}
	/>

	<div class="flex justify-end">
		<SortFilter />
	</div>

	<div class="relative mb-6 group">
		<div
			class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors"
		>
			<span class="material-symbols-outlined text-xl">search</span>
		</div>
		<input
			type="text"
			placeholder="Cari blog berdasarkan judul atau slug..."
			value={searchTerm}
			oninput={handleSearchChange}
			class="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-body shadow-sm"
		/>
		{#if searchTerm}
			<button
				onclick={() => {
					searchTerm = '';
					debouncedSearch('');
				}}
				class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-error transition-colors"
			>
				<span class="material-symbols-outlined text-lg">close</span>
			</button>
		{/if}
	</div>

	<div class="bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse min-w-[800px] sm:min-w-0">
				<thead>
					<tr class="border-b border-outline-variant/10 bg-surface-container-high/50">
						<th class="p-6 font-headline text-sm font-bold text-on-surface">Title</th>
						<th class="p-6 font-headline text-sm font-bold text-on-surface">Status</th>
						<th class="p-6 font-headline text-sm font-bold text-on-surface">Created At</th>
						<th class="p-6 font-headline text-sm font-bold text-on-surface text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each blogs as blog (blog.id)}
						<tr class="border-b border-outline-variant/10 hover:bg-white/5 transition-colors group">
							<td class="p-6 font-body text-on-surface">
								<div class="font-bold line-clamp-1">{blog.title}</div>
								<div class="text-xs text-on-surface-variant line-clamp-1">/{blog.slug}</div>
							</td>
							<td class="p-6 whitespace-nowrap">
								{#if blog.is_published}
									<span
										class="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider"
									>
										Published
									</span>
								{:else}
									<span
										class="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 uppercase tracking-wider"
									>
										Draft
									</span>
								{/if}
							</td>
							<td class="p-6 font-body text-sm text-on-surface-variant whitespace-nowrap">
								{new Date(blog.created_at).toLocaleDateString('en-GB')}
							</td>
							<td class="p-6 text-right">
								<div class="flex items-center justify-end gap-2">
									<a
										href={`/admin/blog/edit/${blog.id}`}
										class="p-2.5 rounded-xl bg-surface-container-high text-on-surface hover:text-primary transition-all border border-outline-variant/10"
										title="Edit"
									>
										<span class="material-symbols-outlined text-lg">edit</span>
									</a>
									<button
										disabled={isLoading}
										onclick={() => handleDelete(blog.id)}
										class="p-2.5 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all border border-outline-variant/10 disabled:opacity-50"
										title="Delete"
									>
										<span class="material-symbols-outlined text-lg">delete</span>
									</button>
								</div>
							</td>
						</tr>
					{/each}
					{#if blogs.length === 0}
						<tr>
							<td colspan={4} class="p-12 text-center text-on-surface-variant font-body">
								No blog posts found. Start by creating one!
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>