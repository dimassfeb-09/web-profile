<script lang="ts">
	import Badge from '../ui/Badge.svelte';

	let {
		data,
	}: {
		data: { badge_text: string; headline: string; subheadline: string; description: string; cv_url: string };
	} = $props();
</script>

<section class="min-h-[calc(100svh-5rem)] xs:min-h-[calc(100svh-6rem)] lg:min-h-[calc(100svh-8rem)] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 content-center items-center pt-8 pb-16 relative">
	<div class="lg:col-span-7 flex flex-col items-start text-left relative z-10">
		<Badge className="mb-6">{data.badge_text}</Badge>
		<h1 class="font-headline text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.1] mb-6">
			{data.headline} <br />
			<span class="text-primary">{data.subheadline}</span>
		</h1>
		<p class="font-body text-base xs:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-10 font-light">
			{data.description}
		</p>
		<div class="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
			<a
				class="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-label font-bold text-center tracking-wide transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,62,199,0.25)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
				href="#projects"
			>
				View My Work
			</a>
			<a
				class="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-label font-bold text-center tracking-wide transition-all duration-300 hover:-translate-y-1 active:translate-y-0 cursor-pointer"
				href={data.cv_url}
				target="_blank"
				rel="noopener noreferrer"
			>
				Resume
			</a>
		</div>
	</div>

	<div class="mt-4 lg:mt-0 lg:col-span-5 relative flex items-center justify-center lg:justify-end w-full min-h-[440px] xs:min-h-[460px] lg:min-h-[560px] group/hero-card">
		<div class="absolute right-12 top-12 w-64 h-64 bg-primary/4 rounded-full blur-[80px] pointer-events-none"></div>

		<div class="relative w-full max-w-[300px] xs:max-w-[340px] lg:max-w-[360px] mx-auto lg:mr-16 lg:ml-auto animate-fade-up"
			style="animation-fill-mode: both;"
		>
			<div class="absolute -top-16 xs:-top-20 sm:-top-14 lg:-top-24 left-0 xs:-left-4 sm:left-auto sm:-left-18 lg:-left-28 w-[140px] xs:w-[160px] z-10 animate-drift-a">
				<div
					class="p-3.5 xs:p-4.5 rounded-3xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl -rotate-3 xs:-rotate-6 group-hover/hero-card:-translate-y-3 group-hover/hero-card:-rotate-[6deg] will-change-transform pointer-events-none"
					style="transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);"
				>
					<span class="text-[9px] font-black uppercase tracking-widest text-blue-300 dark:text-blue-700 block mb-1">
						Delivered
					</span>
					<p class="text-2xl xs:text-3xl font-headline font-bold mb-1">
						5+
					</p>
					<p class="text-[9px] xs:text-[10px] text-zinc-300 dark:text-zinc-600 font-light leading-normal">
						Production-ready digital projects completed.
					</p>
				</div>
			</div>

			<!-- Middle Card: Availability Status -->
			<div class="absolute -bottom-16 xs:-bottom-20 sm:-bottom-12 lg:-bottom-24 right-0 xs:-right-4 sm:right-auto sm:-left-12 lg:-left-16 w-[140px] xs:w-[160px] z-10 animate-drift-b">
				<div
					class="p-3.5 xs:p-4.5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-700/40 text-zinc-800 dark:text-zinc-200 shadow-xl rotate-3 xs:rotate-6 group-hover/hero-card:translate-y-3 group-hover/hero-card:rotate-[6deg] will-change-transform pointer-events-none"
					style="transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);"
				>
					<div class="flex items-center gap-2 mb-2">
						<span class="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
						<span class="text-[8px] xs:text-[9px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
							Available
						</span>
					</div>
					<p class="text-[10px] xs:text-xs font-bold leading-snug mb-1">
						Full-time, Freelance
					</p>
					<p class="text-[8px] xs:text-[9px] text-zinc-600 dark:text-zinc-400 font-light leading-normal">
						Ready for opportunities.
					</p>
				</div>
			</div>

			<!-- Front Card: Interactive Developer Profile Mock -->
			<div class="w-full relative z-20 animate-drift-main">
				<div
					class="p-5 xs:p-6 rounded-[2rem] xs:rounded-[2.5rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/30 dark:border-zinc-700/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-zinc-300/80 dark:hover:border-zinc-600/80 hover:bg-white/90 dark:hover:bg-zinc-900/90 group-hover/hero-card:-translate-y-1 group-hover/hero-card:scale-[1.02] will-change-transform"
					style="transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);"
				>
				<!-- Profile Header -->
				<div class="flex items-center gap-3.5 mb-6">
					<div class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base shadow-sm">
						DF
					</div>
					<div>
						<p class="font-headline font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">
							Dimas Febriyanto
						</p>
						<span class="text-zinc-500 dark:text-zinc-400 font-body text-[11px] font-light">
							Software Engineer
						</span>
					</div>
				</div>

				<!-- Main Focus Areas (Clean Solid Bullets) -->
				<div class="space-y-3 mb-6">
					<div class="flex items-center gap-2.5">
						<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
						<span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
							Flutter Mobile Apps
						</span>
					</div>
					<div class="flex items-center gap-2.5">
						<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
						<span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
							Backend Golang &amp; PostgreSQL
						</span>
					</div>
					<div class="flex items-center gap-2.5">
						<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
						<span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">
							ReactJS &amp; NextJS
						</span>
					</div>
				</div>

				<!-- Core Skills Badges -->
				<div class="flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
					<span class="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
						Flutter
					</span>
					<span class="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
						Go
					</span>
					<span class="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
						NextJS
					</span>
					<span class="px-2.5 py-1 text-[10px] font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
						PostgreSQL
					</span>
				</div>
				</div>
			</div>
		</div>
	</div>
</section>