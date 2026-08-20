<script lang="ts">
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

<section id="skills" class="pt-8 xs:pt-12 lg:pt-16 scroll-mt-20">
	<div class="max-w-3xl mb-12 xs:mb-16">
		<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-pretty">
			Tech Stack
		</h2>
		<p class="font-body text-zinc-500 text-base xs:text-lg leading-relaxed font-light mt-4 max-w-2xl">
			A curated set of tools, frameworks, and technologies I use to build
			high-performance digital experiences.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2">
		{#each categories as cat, index}
			<div class="py-6 border-t border-zinc-200 {index % 2 === 1 ? 'md:border-l md:border-zinc-200 md:pl-16' : 'md:pr-16'}">
				<h3 class="font-headline text-lg font-bold text-zinc-900 mb-1.5">
					{cat.title}
				</h3>
				<p class="font-body text-zinc-500 leading-relaxed text-pretty">
					{cat.skills.join(' · ')}
				</p>
			</div>
		{/each}
	</div>
</section>
