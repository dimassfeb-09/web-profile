<script lang="ts">
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/common/ThemeToggle.svelte';

	let {
		cvUrl,
		navLinks = [],
	}: { cvUrl: string; navLinks?: { name: string; href: string }[] } = $props();

	let activeHash = $state('');
	let isVisible = $state(true);
	let lastScrollY = $state(0);
	let isMobileMenuOpen = $state(false);
	let isInitialJumping = $state(false);

	const pathname = $derived(page.url.pathname);
	const isHome = $derived(pathname === '/');

	$effect(() => {
		document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Always show navbar on route change and sync scroll position
	$effect(() => {
		void pathname;
		isVisible = true;
		lastScrollY = window.scrollY;
	});

	// Instantly jump to hash on initial page load / route change from another page
	$effect(() => {
		if (!isHome) return;

		const hash = window.location.hash;
		if (!hash) return;
		const id = hash.substring(1);

		let attempts = 0;
		const interval = setInterval(() => {
			const element = document.getElementById(id);
			if (element) {
				clearInterval(interval);
				isInitialJumping = true;
				element.scrollIntoView({ behavior: 'auto' });
				isVisible = true;
				setTimeout(() => {
					lastScrollY = window.scrollY;
					isInitialJumping = false;
				}, 150);
			}
			attempts++;
			if (attempts > 30) clearInterval(interval);
		}, 100);

		return () => clearInterval(interval);
	});

	// Show/Hide on scroll
	$effect(() => {
		const handleScroll = () => {
			if (isInitialJumping) {
				isVisible = true;
				return;
			}

			const currentScrollY = window.scrollY;

			// Always show at the very top
			if (currentScrollY < 10) {
				isVisible = true;
			} else if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMobileMenuOpen) {
				// Scrolling down & not at the top & mobile menu not open -> hide
				isVisible = false;
			} else if (currentScrollY < lastScrollY) {
				// Scrolling up -> show
				isVisible = true;
			}

			lastScrollY = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Hash Change + Scroll Spy (Intersection Observer)
	$effect(() => {
		const handleHashChange = () => {
			activeHash = window.location.hash;
		};

		let observer: IntersectionObserver | null = null;

		if (isHome) {
			const sectionIds = navLinks
				.filter((link) => link.href.startsWith('#'))
				.map((link) => link.href.substring(1));

			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							activeHash = `#${entry.target.id}`;
						}
					});
				},
				{
					rootMargin: '-20% 0px -70% 0px',
					threshold: 0,
				},
			);

			sectionIds.forEach((id) => {
				const element = document.getElementById(id);
				if (element) observer?.observe(element);
			});
		}

		// Initial sync
		activeHash = window.location.hash;
		window.addEventListener('hashchange', handleHashChange);

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
			observer?.disconnect();
		};
	});

	// Dynamic Browser Tab Title based on active section
	$effect(() => {
		if (!isHome) return;

		if (!activeHash || activeHash === '#hero') {
			document.title = 'Dimas Febriyanto — Fullstack & Mobile Developer (Golang + Flutter)';
			return;
		}

		const activeLink = navLinks.find((link) => link.href === activeHash);
		if (activeLink) {
			document.title = `${activeLink.name} | Dimas Febriyanto`;
		}
	});

	function getHref(href: string) {
		if (href.startsWith('#')) {
			return isHome ? href : `/${href}`;
		}
		return href;
	}

	function isActive(href: string) {
		const hasActiveHash = activeHash.length > 0;

		// Handle Hash Links
		if (href.includes('#')) {
			const [, hash] = href.split('#');
			return isHome && activeHash === `#${hash}`;
		}

		// Handle Path Links
		const isPathMatch = pathname === href || (href !== '/' && pathname.startsWith(href));
		if (href === '/' || href === '') {
			return isPathMatch && !hasActiveHash;
		}
		return isPathMatch;
	}

	function scrollToHash(href: string) {
		if (isHome) {
			activeHash = href;
			const targetEl = document.querySelector(href);
			if (targetEl) {
				targetEl.scrollIntoView({ behavior: 'smooth' });
			}
			pushState(href, {});
		} else {
			goto(`/${href}`);
		}
	}

	function onNavClick(e: MouseEvent, link: { href: string }) {
		if (link.href.startsWith('#')) {
			e.preventDefault();
			scrollToHash(link.href);
		} else {
			activeHash = '';
		}
	}
</script>

<nav
	class="fixed top-0 w-full z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/60 {isVisible ? 'translate-y-0' : '-translate-y-full'}"
	style="transition: transform 500ms cubic-bezier(0.16, 1, 0.3, 1)"
>
	<div class="flex justify-between items-center px-4 xs:px-6 py-4 xs:py-5 max-w-screen-2xl mx-auto relative z-50">
		<a
			class="text-lg xs:text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 font-headline transition-all duration-300 ease-in-out hover:opacity-80 scale-95 active:scale-90 transition-transform"
			href="/"
			onclick={() => (isMobileMenuOpen = false)}
		>
			{#if isHome && activeHash && activeHash !== '#hero'}
				<span class="flex items-center gap-1.5">
					<span class="text-zinc-400 dark:text-zinc-500 font-normal">Dimas</span>
					<span class="text-zinc-300 dark:text-zinc-600 font-normal">/</span>
					<span class="text-primary font-black">
						{navLinks.find((l) => l.href === activeHash)?.name || ''}
					</span>
				</span>
			{:else}
				Dimas Febriyanto
			{/if}
		</a>

		<!-- Desktop Links -->
		<div class="hidden lg:flex items-center gap-8 font-plus-jakarta text-sm font-medium tracking-tight">
			{#each navLinks as link}
				{@const active = isActive(link.href)}
				<a
					class="transition-all duration-300 ease-in-out hover:opacity-80 border-b-2 py-1 {active
						? 'text-primary border-primary'
						: 'text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-primary/30'}"
					href={getHref(link.href)}
					onclick={(e) => onNavClick(e, link)}
				>
					{link.name}
				</a>
			{/each}
		</div>

		<!-- Desktop Resume Button -->
		<div class="hidden lg:flex items-center gap-2">
			<ThemeToggle />
			<a
				class="flex items-center justify-center px-4 xs:px-6 py-2 xs:py-2.5 rounded-full bg-primary text-white font-label font-medium text-xs xs:text-sm tracking-wide transition-all duration-300 ease-in-out hover:opacity-90 scale-95 active:scale-90 transition-transform hover:shadow-[0_8px_24px_rgb(0,62,199,0.22)]"
				href={cvUrl}
				target="_blank"
				rel="noopener noreferrer"
			>
				Resume
			</a>
		</div>

		<div class="lg:hidden flex items-center gap-1">
			<ThemeToggle />
			<!-- Mobile Hamburger Button -->
			<button
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="flex flex-col justify-center items-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none relative z-50"
				aria-label="Toggle Menu"
			>
				<div class="w-5 flex flex-col gap-1.5">
					<span class="h-0.5 w-full bg-zinc-800 dark:bg-zinc-200 rounded transition-all duration-300 origin-center {isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}"></span>
					<span class="h-0.5 w-full bg-zinc-800 dark:bg-zinc-200 rounded transition-all duration-300 origin-center {isMobileMenuOpen ? 'w-0 opacity-0' : ''}"></span>
					<span class="h-0.5 w-full bg-zinc-800 dark:bg-zinc-200 rounded transition-all duration-300 origin-center {isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}"></span>
				</div>
			</button>
		</div>
	</div>
</nav>

<!-- Premium Under-Navbar Mobile Menu Overlay with Clipping Boundary -->
<div
	class="fixed inset-x-0 bottom-0 top-[61px] xs:top-[69px] z-40 overflow-hidden lg:hidden {isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}"
>
	<div
		class="w-full h-full bg-white/98 dark:bg-zinc-950/98 backdrop-blur-3xl flex flex-col justify-between px-6 py-6 xs:px-8 xs:py-8 {isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}"
		style="transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)"
	>
		<!-- Spacious Center Navigation Link Stack -->
		<div class="flex flex-col gap-6 xs:gap-8 my-auto pl-2">
			{#each navLinks as link}
				{@const active = isActive(link.href)}
				<a
					class="text-xl xs:text-2xl font-bold font-headline tracking-tight transition-all duration-300 flex items-center gap-4 {active
						? 'text-primary translate-x-2'
						: 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:translate-x-1'}"
					href={getHref(link.href)}
					onclick={(e) => {
						isMobileMenuOpen = false;
						onNavClick(e, link);
					}}
				>
					{#if active}
						<span class="w-2 h-2 rounded-full bg-primary"></span>
					{/if}
					{link.name}
				</a>
			{/each}
		</div>

		<!-- Bottom Call-To-Action & Status -->
		<div class="flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-800 pt-6">
			<div class="flex items-center gap-2 px-1">
				<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
				<span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide">
					Available for opportunities
				</span>
			</div>
			<a
				class="w-full py-4 rounded-full bg-primary text-white font-label font-bold text-center tracking-wide shadow-[0_8px_24px_rgb(0,62,199,0.2)] active:scale-95 transition-transform duration-200"
				href={cvUrl}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => (isMobileMenuOpen = false)}
			>
				Resume
			</a>
		</div>
	</div>
</div>