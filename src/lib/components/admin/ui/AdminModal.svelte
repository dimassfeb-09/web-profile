<script lang="ts">
	import { cn } from '$lib/utils';

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
			class="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in"
			role="presentation"
			onclick={onClose}
		></div>

		<div
			class={cn(
				'relative w-full bg-surface rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90dvh]',
				isLarge ? 'max-w-4xl' : 'max-w-2xl',
				className
			)}
		>
			<div class="p-6 sm:p-8 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
				<h2 class="font-headline text-lg sm:text-xl font-bold text-on-surface">{title}</h2>
				<button
					type="button"
					onclick={onClose}
					class="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-high transition-all"
					aria-label="Close modal"
				>
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>

			<div
				class={cn(
					'p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-grow flex flex-col',
					bodyClassName
				)}
			>
				{@render children()}
			</div>
		</div>
	</div>
{/if}