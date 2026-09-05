<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();
	const stats = $derived(data.stats);

	let updatedTime = $state('');
	onMount(() => {
		updatedTime = new Date().toLocaleTimeString();
	});

	const quickActions = [
		{ name: 'Add Project', icon: 'add_circle', href: '/admin/projects', color: 'text-primary' },
		{ name: 'Write Blog', icon: 'edit_note', href: '/admin/blog/create', color: 'text-secondary' },
		{ name: 'Add Experience', icon: 'work_history', href: '/admin/experience', color: 'text-tertiary' },
		{ name: 'Update Skills', icon: 'psychology', href: '/admin/skills', color: 'text-red-600' }
	];

	const contentSummary = $derived([
		{ label: 'Skills & Tech Stack', value: stats.skills, icon: 'psychology', color: 'bg-blue-500', href: '/admin/skills' },
		{ label: 'Achievements & Awards', value: stats.achievements, icon: 'workspace_premium', color: 'bg-amber-500', href: '/admin/achievements' },
		{ label: 'Professional Certificates', value: stats.certificates, icon: 'card_membership', color: 'bg-emerald-500', href: '/admin/certificates' }
	]);
</script>

<div class="space-y-10 animate-fade-in">
	<div class="flex justify-between items-end flex-wrap gap-4">
		<div>
			<h1 class="font-headline text-3xl sm:text-4xl font-bold text-on-surface mb-2 tracking-tight">Dashboard Overview</h1>
			<p class="font-body text-on-surface-variant opacity-80">Welcome back! Here&apos;s what&apos;s happening with your portfolio.</p>
		</div>
		<div class="flex items-center gap-4">
			{#if updatedTime}
				<p class="hidden sm:block text-[10px] font-label font-bold text-on-surface-variant/40 uppercase tracking-widest">
					Last Updated: {updatedTime}
				</p>
			{/if}
			<button
				onclick={() => invalidateAll()}
				class="p-3 rounded-2xl bg-surface-container-high text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest"
				title="Refresh Data"
			>
				<span class="material-symbols-outlined text-lg">refresh</span>
				Refresh
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
		<a
			href="/admin/projects"
			class="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden"
		>
			<div class="absolute -right-8 -top-8 w-24 h-24 bg-primary opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
			<div class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
				<span class="material-symbols-outlined text-3xl">folder_open</span>
			</div>
			<div class="relative z-10">
				<p class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60 group-hover:text-primary transition-colors">Total Projects</p>
				<p class="text-on-surface font-headline text-3xl font-bold tracking-tight">{stats.projects}</p>
			</div>
		</a>

		<a
			href="/admin/blog"
			class="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden"
		>
			<div class="absolute -right-8 -top-8 w-24 h-24 bg-secondary opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
			<div class="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
				<span class="material-symbols-outlined text-3xl">article</span>
			</div>
			<div class="relative z-10">
				<p class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60 group-hover:text-primary transition-colors">Blog Posts</p>
				<p class="text-on-surface font-headline text-3xl font-bold tracking-tight">{stats.blogs}</p>
			</div>
		</a>

		<a
			href="/admin/experience"
			class="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden"
		>
			<div class="absolute -right-8 -top-8 w-24 h-24 bg-tertiary opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500"></div>
			<div class="w-14 h-14 rounded-2xl bg-tertiary flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
				<span class="material-symbols-outlined text-3xl">work</span>
			</div>
			<div class="relative z-10">
				<p class="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60 group-hover:text-primary transition-colors">Experience Items</p>
				<p class="text-on-surface font-headline text-3xl font-bold tracking-tight">{stats.experience}</p>
			</div>
		</a>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
		<!-- Quick Actions -->
		<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
			<h3 class="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
				<span class="material-symbols-outlined text-primary">bolt</span>
				Quick Actions
			</h3>
			<div class="grid grid-cols-2 gap-4">
				{#each quickActions as action}
					<a
						href={action.href}
						class="relative p-5 rounded-[1.5rem] bg-surface-container-high/50 border border-outline-variant/5 text-on-surface font-label text-sm font-bold hover:bg-surface-container-lowest hover:border-primary/30 hover:text-primary transition-all duration-300 flex flex-col gap-4 group overflow-hidden"
					>
						<div class="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-[3] transition-transform duration-700 ease-out"></div>
						<div class="flex justify-between items-start relative z-10">
							<div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
								<span class="material-symbols-outlined text-2xl {action.color} group-hover:scale-110 transition-transform duration-300">
									{action.icon}
								</span>
							</div>
							<span class="material-symbols-outlined text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
								arrow_forward
							</span>
						</div>
						<span class="relative z-10 tracking-tight">{action.name}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Content Summary -->
		<div class="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
			<h3 class="font-headline text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
				<span class="material-symbols-outlined text-secondary">analytics</span>
				Content Summary
			</h3>
			<div class="space-y-4">
				{#each contentSummary as item}
					<a
						href={item.href}
						class="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high/50 border border-outline-variant/5 group hover:bg-white hover:shadow-sm hover:border-primary/20 transition-all duration-300"
					>
						<div class="flex items-center gap-4">
							<div class="w-10 h-10 rounded-xl {item.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
								<span class="material-symbols-outlined text-xl">{item.icon}</span>
							</div>
							<span class="font-body text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{item.label}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-headline font-bold text-lg text-on-surface">{item.value}</span>
							<span class="material-symbols-outlined text-sm text-primary opacity-0 group-hover:opacity-100 transition-all">chevron_right</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>