<script lang="ts">
	import { X, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let { isOpen, onClose, imageUrl, altText, onNext, onPrev, hasMultiple = false }: {
		isOpen: boolean;
		onClose: () => void;
		imageUrl: string;
		altText: string;
		onNext?: () => void;
		onPrev?: () => void;
		hasMultiple?: boolean;
	} = $props();

	let shouldRender = $state(false);
	let isAnimating = $state(false);
	let displayImage = $state('');
	let displayAlt = $state('');

	$effect(() => {
		if (isOpen) {
			shouldRender = true;
			requestAnimationFrame(() => {
				isAnimating = true;
			});
		} else {
			isAnimating = false;
			const timer = setTimeout(() => {
				shouldRender = false;
			}, 300);
			return () => clearTimeout(timer);
		}
	});

	$effect(() => {
		if (imageUrl) {
			displayImage = imageUrl;
			displayAlt = altText;
		}
	});

	$effect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
			if (hasMultiple) {
				if (e.key === 'ArrowRight' && onNext) onNext();
				if (e.key === 'ArrowLeft' && onPrev) onPrev();
			}
		};
		const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
		document.addEventListener('keydown', handleKeyDown);
		document.body.style.overflow = 'hidden';
		if (scrollBarWidth > 0) {
			document.body.style.paddingRight = `${scrollBarWidth}px`;
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
			document.body.style.paddingRight = '0px';
		};
	});
</script>

{#if shouldRender}
	<div
		class={`fixed inset-0 z-[100] flex justify-center items-center bg-black/80 transition-opacity duration-300 ease-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
		onclick={onClose}
		onkeydown={(e) => {
			if (e.key === 'Escape') onClose();
		}}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<button
			onclick={onClose}
			class="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
			aria-label="Close image modal"
		>
			<X class="w-6 h-6" />
		</button>

		{#if hasMultiple}
			<button
				onclick={(e) => {
					e.stopPropagation();
					onPrev?.();
				}}
				class="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
				aria-label="Previous image"
			>
				<ChevronLeft class="w-8 h-8" />
			</button>
			<button
				onclick={(e) => {
					e.stopPropagation();
					onNext?.();
				}}
				class="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[101]"
				aria-label="Next image"
			>
				<ChevronRight class="w-8 h-8" />
			</button>
		{/if}

		<div
			class={`relative w-[95vw] h-[85vh] max-w-6xl rounded-xl overflow-hidden transition-all duration-300 ease-out ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
			onclick={onClose}
			role="button"
			tabindex="-1"
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClose();
				}
			}}
		>
			{#if displayImage}
				<img src={displayImage} alt={displayAlt} class="w-full h-full object-contain" />
			{/if}
		</div>
	</div>
{/if}