<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import CachedImage from './CachedImage.svelte';

	let {
		slug,
		title,
		description,
		imageUrl,
		imageHash,
		date,
	}: {
		slug: string;
		title: string;
		description: string;
		imageUrl: string | null;
		imageHash?: string | null;
		date: string | Date | null;
	} = $props();

	function formatDate(dateValue: string | Date | null) {
		if (!dateValue) return '';
		const date = new Date(dateValue);
		return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
	}
</script>

<a href={`/achievements/${slug}`} class="group bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 block">
	<div class="aspect-[1024/500] w-full bg-surface-container-high overflow-hidden relative">
		<CachedImage
			src={imageUrl}
			hash={imageHash}
			alt={`${title} - Achievement by Dimas Febriyanto`}
			class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
			fallback="/placeholder.jpg"
		/>
	</div>
	<div class="p-6">
		<div class="flex justify-between items-start mb-2">
			<h3 class="font-headline text-lg font-bold text-on-surface line-clamp-1">{title}</h3>
			<span class="font-label text-xs text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
				{formatDate(date)}
			</span>
		</div>
		<p class="font-body text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
			{description}
		</p>
		<div class="flex items-center gap-1.5 text-primary font-label text-xs font-bold tracking-wide">
			View Detail
			<ArrowRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
		</div>
	</div>
</a>