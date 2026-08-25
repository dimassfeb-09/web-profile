<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { FolderOpen, FileText, Briefcase, PlusCircle, Pencil, BriefcaseBusiness, Brain, Award, BadgeCheck, BarChart3, Zap, RefreshCw, ArrowRight, ChevronRight } from 'lucide-svelte';

	let { data }: PageProps = $props();
	const stats = $derived(data.stats);

	let updatedTime = $state('');
	onMount(() => {
		updatedTime = new Date().toLocaleTimeString();
	});

	const quickActions = [
		{ name: 'Add Project', icon: PlusCircle, href: '/admin/projects' },
		{ name: 'Write Blog', icon: Pencil, href: '/admin/blog/create' },
		{ name: 'Add Experience', icon: BriefcaseBusiness, href: '/admin/experience' },
		{ name: 'Update Skills', icon: Brain, href: '/admin/skills' }
	];

	const contentSummary = $derived([
		{ label: 'Skills & Tech Stack', value: stats.skills, icon: Brain, color: 'bg-zinc-900', href: '/admin/skills' },
		{ label: 'Achievements & Awards', value: stats.achievements, icon: Award, color: 'bg-zinc-700', href: '/admin/achievements' },
		{ label: 'Professional Certificates', value: stats.certificates, icon: BadgeCheck, color: 'bg-zinc-500', href: '/admin/certificates' }
	]);
</script>

<div class="space-y-6">
	<div class="flex justify-between items-end flex-wrap gap-4">
		<div>
			<h1 class="font-headline text-2xl font-semibold tracking-tight text-zinc-900">Dashboard Overview</h1>
			<p class="text-sm text-zinc-500 mt-1">Welcome back! Here's what's happening with your portfolio.</p>
		</div>
		<div class="flex items-center gap-3">
			{#if updatedTime}
				<p class="hidden sm:block text-xs text-zinc-400">Last updated: {updatedTime}</p>
			{/if}
			<button
				onclick={() => invalidateAll()}
				class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-all text-xs font-medium"
				title="Refresh Data"
			>
				<RefreshCw size={14} />
				Refresh
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<a
			href="/admin/projects"
			class="bg-white p-6 rounded-2xl border border-zinc-200 flex items-center gap-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
		>
			<div class="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0">
				<FolderOpen size={20} />
			</div>
			<div>
				<p class="text-xs font-medium tracking-wide text-zinc-500 uppercase">Total Projects</p>
				<p class="font-headline text-2xl font-semibold tracking-tight text-zinc-900">{stats.projects}</p>
			</div>
		</a>

		<a
			href="/admin/blog"
			class="bg-white p-6 rounded-2xl border border-zinc-200 flex items-center gap-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
		>
			<div class="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0">
				<FileText size={20} />
			</div>
			<div>
				<p class="text-xs font-medium tracking-wide text-zinc-500 uppercase">Blog Posts</p>
				<p class="font-headline text-2xl font-semibold tracking-tight text-zinc-900">{stats.blogs}</p>
			</div>
		</a>

		<a
			href="/admin/experience"
			class="bg-white p-6 rounded-2xl border border-zinc-200 flex items-center gap-4 hover:shadow-sm hover:border-zinc-300 transition-all group"
		>
			<div class="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center text-white shrink-0">
				<Briefcase size={20} />
			</div>
			<div>
				<p class="text-xs font-medium tracking-wide text-zinc-500 uppercase">Experience Items</p>
				<p class="font-headline text-2xl font-semibold tracking-tight text-zinc-900">{stats.experience}</p>
			</div>
		</a>
	</div>

	<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
		<!-- Quick Actions -->
		<div class="bg-white p-6 rounded-2xl border border-zinc-200">
			<h3 class="font-headline text-[15px] font-semibold text-zinc-900 mb-4 flex items-center gap-2">
				<Zap size={16} class="text-zinc-700" />
				Quick Actions
			</h3>
			<div class="grid grid-cols-2 gap-3">
				{#each quickActions as action}
					{@const Icon = action.icon}
					<a
						href={action.href}
						class="p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col gap-3 group"
					>
						<div class="flex justify-between items-start">
							<div class="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700">
								<Icon size={18} />
							</div>
							<ArrowRight size={16} class="text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all" />
						</div>
						<span class="text-sm font-medium text-zinc-900 tracking-tight">{action.name}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Content Summary -->
		<div class="bg-white p-6 rounded-2xl border border-zinc-200">
			<h3 class="font-headline text-[15px] font-semibold text-zinc-900 mb-4 flex items-center gap-2">
				<BarChart3 size={16} class="text-zinc-700" />
				Content Summary
			</h3>
			<div class="space-y-3">
				{#each contentSummary as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-white hover:shadow-sm transition-all group"
					>
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-xl {item.color} flex items-center justify-center text-white">
								<Icon size={16} />
							</div>
							<span class="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{item.label}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-semibold text-zinc-900">{item.value}</span>
							<ChevronRight size={14} class="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
