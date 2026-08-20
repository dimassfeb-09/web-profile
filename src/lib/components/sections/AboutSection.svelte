<script lang="ts">
	let { data }: { data: { headline: string; paragraphs: string[] } } = $props();
</script>

<section class="pt-8 xs:pt-12 lg:pt-16">
	<div class="max-w-3xl">
		<h2 class="font-headline text-4xl xs:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] text-pretty">
			{data.headline}
		</h2>

		<div class="mt-10 xs:mt-12 space-y-6">
			{#each data.paragraphs as para, index}
				<p
					class="font-body leading-relaxed text-pretty
					{index === 0
						? 'text-xl xs:text-2xl text-zinc-800 font-normal'
						: 'text-base xs:text-lg text-zinc-500 font-light'}"
				>
					{para}
				</p>
			{/each}
		</div>
	</div>
</section>
