<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		LayoutDashboard,
		ChartColumn,
		ListOrdered,
		House,
		User,
		Brain,
		Briefcase,
		GraduationCap,
		FolderOpen,
		Award,
		BadgeCheck,
		FileText,
		Mail,
		LogOut,
		Menu,
		X
	} from 'lucide-svelte';

	let { children } = $props();

	const menuItems = [
		{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
		{ name: 'Traffic', href: '/admin/traffic', icon: ChartColumn },
		{ name: 'Layout & Urutan', href: '/admin/layout-order', icon: ListOrdered },
		{ name: 'Home', href: '/admin/home', icon: House },
		{ name: 'About', href: '/admin/about', icon: User },
		{ name: 'Skills', href: '/admin/skills', icon: Brain },
		{ name: 'Experience', href: '/admin/experience', icon: Briefcase },
		{ name: 'Education', href: '/admin/educations', icon: GraduationCap },
		{ name: 'Projects', href: '/admin/projects', icon: FolderOpen },
		{ name: 'Achievements', href: '/admin/achievements', icon: Award },
		{ name: 'Certificates', href: '/admin/certificates', icon: BadgeCheck },
		{ name: 'Blog', href: '/admin/blog', icon: FileText },
		{ name: 'Contact', href: '/admin/contact', icon: Mail }
	];

	let isMobileMenuOpen = $state(false);

	const isActive = (href: string) => page.url.pathname === href;
	const isLoginPage = $derived(page.url.pathname === '/admin/login');

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			goto('/admin/login');
		} catch (err) {
			console.error('Logout failed:', err);
		}
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="min-h-screen bg-zinc-50 flex selection:bg-zinc-900 selection:text-white">
		<!-- Sidebar desktop (xl+) -->
		<aside class="hidden xl:flex w-64 bg-white border-r border-zinc-200 flex-col sticky top-0 h-screen shrink-0">
			<div class="px-6 py-5 flex items-center gap-3 border-b border-zinc-100">
				<div class="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-headline font-black text-xs">DF</div>
				<span class="font-headline text-[13px] font-semibold tracking-tight text-zinc-900">Admin Panel</span>
			</div>
			<nav class="grow px-3 py-4 space-y-1 overflow-y-auto">
				{#each menuItems as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class="flex items-center px-3 py-2.5 gap-3 rounded-xl text-[13px] transition-all {isActive(item.href)
							? 'bg-zinc-900 text-white font-medium shadow-sm'
							: 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
					>
						<Icon size={18} class="shrink-0" />
						<span class="font-medium tracking-tight">{item.name}</span>
					</a>
				{/each}
			</nav>
			<div class="p-3 border-t border-zinc-100">
				<button
					onclick={handleLogout}
					class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-all text-[13px] font-medium cursor-pointer"
				>
					<LogOut size={18} class="shrink-0" />
					Logout
				</button>
			</div>
		</aside>

		<!-- Sidebar mini (md–xl) -->
		<aside class="hidden md:flex xl:hidden w-[68px] bg-white border-r border-zinc-200 flex-col sticky top-0 h-screen shrink-0">
			<div class="py-5 flex justify-center border-b border-zinc-100">
				<div class="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-headline font-black text-xs">DF</div>
			</div>
			<nav class="grow px-2 py-3 space-y-1 flex flex-col items-center overflow-y-auto">
				{#each menuItems as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						title={item.name}
						class="flex items-center justify-center w-10 h-10 rounded-xl transition-all {isActive(item.href)
							? 'bg-zinc-900 text-white shadow-sm'
							: 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}"
					>
						<Icon size={18} />
					</a>
				{/each}
			</nav>
			<div class="p-2.5 border-t border-zinc-100 flex justify-center">
				<button
					onclick={handleLogout}
					class="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
					title="Logout"
				>
					<LogOut size={18} />
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<main class="grow flex flex-col min-h-screen min-w-0 bg-zinc-50">
			<header class="h-[64px] px-6 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-zinc-200">
				<div class="flex items-center gap-3">
					<button
						onclick={() => (isMobileMenuOpen = true)}
						class="md:hidden p-2 -ml-2 text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
						aria-label="Open menu"
					>
						<Menu size={20} />
					</button>
					<h2 class="font-headline text-[15px] font-semibold tracking-tight text-zinc-900 truncate">
						{menuItems.find((item) => item.href === page.url.pathname)?.name || 'Dashboard'}
					</h2>
				</div>

				<div class="flex items-center gap-3">
					<div class="hidden sm:flex flex-col items-end">
						<span class="text-[13px] font-medium text-zinc-900 leading-none">Admin</span>
						<span class="text-xs text-zinc-500">df@dimassfeb.com</span>
					</div>
					<div class="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-medium text-xs">DF</div>
				</div>
			</header>

			<div class="grow p-6 md:p-8 lg:p-8">
				<div class="max-w-[1600px] mx-auto w-full">
					{@render children()}
				</div>
			</div>
		</main>

		<!-- Mobile drawer -->
		{#if isMobileMenuOpen}
			<div class="fixed inset-0 z-[60] md:hidden">
				<button
					type="button"
					aria-label="Close menu"
					onclick={() => (isMobileMenuOpen = false)}
					class="absolute inset-0 p-0 border-0 bg-zinc-900/30 backdrop-blur-sm animate-fade-in"
				></button>
				<aside class="absolute top-0 bottom-0 left-0 w-72 bg-white p-4 flex flex-col animate-slide-right shadow-2xl border-r border-zinc-200">
					<div class="flex items-center justify-between mb-4 px-1">
						<div class="flex items-center gap-2.5">
							<div class="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-xs">DF</div>
							<span class="font-headline text-sm font-semibold tracking-tight text-zinc-900">Admin Menu</span>
						</div>
						<button
							onclick={() => (isMobileMenuOpen = false)}
							class="p-2 -mr-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
						>
							<X size={18} />
						</button>
					</div>

					<nav class="grow space-y-1 overflow-y-auto pr-1">
						{#each menuItems as item}
							{@const Icon = item.icon}
							<a
								href={item.href}
								onclick={() => (isMobileMenuOpen = false)}
								class="flex items-center px-3 py-2.5 gap-3 rounded-xl text-[13px] transition-all {isActive(item.href)
									? 'bg-zinc-900 text-white font-medium'
									: 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}"
							>
								<Icon size={18} class="shrink-0" />
								<span class="font-medium tracking-tight">{item.name}</span>
							</a>
						{/each}
					</nav>

					<div class="mt-auto pt-4 border-t border-zinc-100">
						<button
							onclick={handleLogout}
							class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all text-[13px] font-medium cursor-pointer"
						>
							<LogOut size={18} />
							Logout
						</button>
					</div>
				</aside>
			</div>
		{/if}
	</div>
{/if}
