<script lang="ts">
	import { cn } from '$lib/utils';
	import { X } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		className?: string;
		bodyClassName?: string;
		isLarge?: boolean;
		children: import('svelte').Snippet;
	}

	let { isOpen, onClose, title, className, bodyClassName, isLarge = false, children }: Props = $props();

	$effect(() => {
		if (!isOpen) return;
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleEsc);
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', handleEsc);
			document.body.style.overflow = 'unset';
		};
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 xs:p-6 sm:p-10">
		<div
			class="absolute inset-0 bg-zinc-900/30 backdrop-blur-sm animate-fade-in"
			role="presentation"
			onclick={onClose}
		></div>

		<div
			class={cn(
				'relative w-full bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden animate-scale-up flex flex-col max-h-[90dvh]',
				isLarge ? 'max-w-4xl' : 'max-w-2xl',
				className
			)}
		>
			<div class="p-6 border-b border-zinc-200 flex justify-between items-center shrink-0">
				<h2 class="font-headline text-lg font-semibold tracking-tight text-zinc-900">{title}</h2>
				<button
					type="button"
					onclick={onClose}
					class="text-zinc-500 hover:text-zinc-900 p-2 -mr-1 rounded-xl hover:bg-zinc-100 transition-all"
					aria-label="Close modal"
				>
					<X size={18} />
				</button>
			</div>

			<div
				class={cn(
					'p-6 overflow-y-auto custom-scrollbar flex-grow flex flex-col bg-white',
					bodyClassName
				)}
			>
				{@render children()}
			</div>
		</div>
	</div>
{/if}