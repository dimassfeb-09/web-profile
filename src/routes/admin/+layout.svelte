<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const menuItems = [
		{ name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
		{ name: 'Traffic', href: '/admin/traffic', icon: 'analytics' },
		{ name: 'Layout & Urutan', href: '/admin/layout-order', icon: 'format_list_numbered' },
		{ name: 'Home', href: '/admin/home', icon: 'home' },
		{ name: 'About', href: '/admin/about', icon: 'person' },
		{ name: 'Skills', href: '/admin/skills', icon: 'psychology' },
		{ name: 'Experience', href: '/admin/experience', icon: 'work' },
		{ name: 'Education', href: '/admin/educations', icon: 'school' },
		{ name: 'Projects', href: '/admin/projects', icon: 'folder_open' },
		{ name: 'Achievements', href: '/admin/achievements', icon: 'workspace_premium' },
		{ name: 'Certificates', href: '/admin/certificates', icon: 'card_membership' },
		{ name: 'Blog', href: '/admin/blog', icon: 'article' },
		{ name: 'Contact', href: '/admin/contact', icon: 'mail' }
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

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="min-h-screen bg-surface flex selection:bg-primary/10 transition-colors duration-300">
		<!-- Sidebar desktop (xl+) -->
		<aside class="hidden xl:flex w-64 bg-surface-container-low border-r border-outline-variant/10 flex-col sticky top-0 h-screen shrink-0">
			<div class="px-6 py-5">
				<a href="/admin/dashboard" class="font-headline text-lg font-black tracking-tighter text-on-surface">
					Admin Panel
				</a>
			</div>
			<nav class="grow px-3 space-y-1 overflow-y-auto">
				{#each menuItems as item}
					<a
						href={item.href}
						class="flex items-center px-3 py-2 gap-3 rounded-xl transition-all duration-200 {isActive(item.href) ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}"
					>
						<span class="material-symbols-outlined text-xl {isActive(item.href) ? 'fill-1' : ''}">{item.icon}</span>
						<span class="font-label text-xs tracking-wide">{item.name}</span>
					</a>
				{/each}
			</nav>
			<div class="p-4 border-t border-outline-variant/10">
				<button
					onclick={handleLogout}
					class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-500/10 transition-all font-label text-xs font-bold uppercase tracking-wider cursor-pointer"
				>
					<span class="material-symbols-outlined text-xl">logout</span>
					Logout
				</button>
			</div>
		</aside>

		<!-- Sidebar mini (md–xl) -->
		<aside class="hidden md:flex xl:hidden w-16 bg-surface-container-low border-r border-outline-variant/10 flex-col sticky top-0 h-screen shrink-0">
			<div class="py-5 flex justify-center">
				<div class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-headline font-black text-[10px]">A</div>
			</div>
			<nav class="grow px-2 space-y-1 flex flex-col items-center overflow-y-auto">
				{#each menuItems as item}
					<a
						href={item.href}
						title={item.name}
						class="flex items-center justify-center p-2 rounded-xl transition-all duration-200 {isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}"
					>
						<span class="material-symbols-outlined text-xl {isActive(item.href) ? 'fill-1' : ''}">{item.icon}</span>
					</a>
				{/each}
			</nav>
			<div class="p-2.5 border-t border-outline-variant/10 flex justify-center">
				<button
					onclick={handleLogout}
					class="p-2 rounded-xl text-red-600 hover:bg-red-500/10 transition-all cursor-pointer"
					title="Logout"
				>
					<span class="material-symbols-outlined text-xl">logout</span>
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<main class="grow flex flex-col min-h-screen min-w-0 bg-surface">
			<header class="h-20 lg:h-24 px-6 md:px-10 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant/5">
				<div class="md:hidden">
					<button
						onclick={() => (isMobileMenuOpen = true)}
						class="p-2 -ml-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors"
					>
						<span class="material-symbols-outlined text-2xl">menu</span>
					</button>
				</div>

				<h2 class="font-headline text-lg font-semibold text-on-surface truncate">
					{menuItems.find((item) => item.href === page.url.pathname)?.name || 'Dashboard'}
				</h2>

				<div class="flex items-center gap-4">
					<div class="flex flex-col items-end hidden sm:flex">
						<span class="text-xs font-label font-bold text-on-surface">Admin</span>
						<span class="text-[10px] text-on-surface-variant font-body">df@dimassfeb.com</span>
					</div>
					<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-label font-bold text-xs ring-1 ring-primary/20">DF</div>
				</div>
			</header>

			<div class="grow p-6 md:p-10 lg:p-12">
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
					class="absolute inset-0 p-0 border-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in"
				></button>
				<aside class="absolute top-0 bottom-0 left-0 w-64 bg-surface p-5 flex flex-col animate-slide-right shadow-2xl">
					<div class="flex items-center justify-between mb-5">
						<span class="font-headline text-base font-black tracking-tighter text-on-surface">Admin Menu</span>
						<button
							onclick={() => (isMobileMenuOpen = false)}
							class="p-1.5 -mr-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-all"
						>
							<span class="material-symbols-outlined text-xl">close</span>
						</button>
					</div>

					<nav class="grow space-y-1 overflow-y-auto pr-1">
						{#each menuItems as item}
							<a
								href={item.href}
								onclick={() => (isMobileMenuOpen = false)}
								class="flex items-center px-3 py-2 gap-3 rounded-xl transition-all duration-200 {isActive(item.href) ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}"
							>
								<span class="material-symbols-outlined text-xl {isActive(item.href) ? 'fill-1' : ''}">{item.icon}</span>
								<span class="font-label text-xs tracking-wide">{item.name}</span>
							</a>
						{/each}
					</nav>

					<div class="mt-auto pt-4 border-t border-outline-variant/10">
						<button
							onclick={handleLogout}
							class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-500/10 transition-all font-label text-xs font-bold uppercase tracking-wider cursor-pointer"
						>
							<span class="material-symbols-outlined text-xl">logout</span>
							Logout
						</button>
					</div>
				</aside>
			</div>
		{/if}
	</div>
{/if}