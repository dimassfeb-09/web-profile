<script lang="ts">
	let { data }: { data: { headline: string; paragraphs: string[] } } = $props();
</script>

<section class="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-12 lg:gap-16 items-start pt-12 xs:pt-16 lg:pt-24">
	<div class="lg:col-span-5 lg:sticky lg:top-32">
		<h2 class="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-6">
			{data.headline}
		</h2>
		<div class="w-16 h-1 bg-primary rounded-full"></div>
	</div>
	<div class="lg:col-span-7 bg-surface-container-lowest p-6 xs:p-8 md:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] border border-outline-variant/10 group hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
		<div class="prose prose-base xs:prose-lg text-on-surface-variant font-body leading-relaxed max-w-none">
			{#each data.paragraphs as para, index}
				<p class={index < data.paragraphs.length - 1 ? 'mb-6' : ''}>{para}</p>
			{/each}
		</div>
	</div>
</section>