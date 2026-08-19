<script lang="ts">
	import SkillCategory from '../ui/SkillCategory.svelte';

	interface Category {
		id?: number;
		icon: string;
		title: string;
		skills: string[];
		color_class: string;
		delay_class: string;
	}

	let { categories }: { categories: Category[] } = $props();
</script>

<section id="skills" class="relative pt-12 xs:pt-16 lg:pt-24 scroll-mt-20">
	<div class="relative mb-12 sm:mb-16">
		<div class="flex items-center gap-3 mb-4">
			<div class="h-px w-8 bg-primary/40"></div>
			<span class="text-primary font-bold text-xs uppercase tracking-[0.2em]">
				Expertise
			</span>
		</div>
		<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6">
			Tech Stack<span class="text-primary">.</span>
		</h2>
		<p class="font-body text-zinc-500 text-lg xs:text-xl max-w-2xl leading-relaxed">
			A curated set of tools, frameworks, and technologies I use to build
			high-performance digital experiences.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xs:gap-8">
		{#each categories as cat, index}
			<div class="transition-all duration-500 animate-scale-up" style="animation-delay: {index * 100}ms">
				<SkillCategory
					title={cat.title}
					skills={cat.skills}
					colorClass={cat.color_class}
					delayClass={cat.delay_class}
				/>
			</div>
		{/each}
	</div>
</section>