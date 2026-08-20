<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const is404 = $derived(status === 404);

	const title = $derived(is404 ? 'Page Not Found' : 'Something Went Wrong');
	const message = $derived(
		is404
			? "The page you're looking for doesn't exist or has been moved."
			: (page.error?.message ?? 'An unexpected error occurred. Please try again.'),
	);
</script>

<svelte:head>
	<title>{is404 ? '404 — Page Not Found' : `${status} — Error`} | Dimas Febriyanto</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="min-h-svh flex flex-col items-center justify-center px-6 text-center py-20">
	<div
		class="font-headline font-bold tracking-tight leading-none select-none text-[7rem] xs:text-[9rem] lg:text-[12rem] text-zinc-900"
	>
		{status}
	</div>
	<h1 class="font-headline text-2xl xs:text-3xl font-bold text-zinc-900 mt-2">
		{title}
	</h1>
	<p class="font-body text-zinc-500 text-base xs:text-lg leading-relaxed max-w-md mt-4">
		{message}
	</p>
	<div class="flex flex-col sm:flex-row items-center gap-4 mt-10">
		<a
			href="/"
			class="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-label font-bold text-center tracking-wide transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,62,199,0.25)] hover:-translate-y-1 active:translate-y-0"
		>
			Back to Home
		</a>
		<a
			href="/blog"
			class="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-label font-bold text-center tracking-wide transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
		>
			Browse Blog
		</a>
	</div>
</main>