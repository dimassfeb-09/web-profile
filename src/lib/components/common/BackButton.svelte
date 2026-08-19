<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { href, label = 'Kembali ke Beranda', className = '' }: {
		href: string;
		label?: string;
		className?: string;
	} = $props();
</script>

<a
	href={href}
	class={cn(
		'group inline-flex items-center gap-3 text-on-surface-variant hover:text-primary transition-all duration-300 font-label font-bold text-sm',
		className
	)}
>
	<div
		class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-sm"
	>
		<ArrowLeft class="w-4 h-4" />
	</div>
	{label}
</a>