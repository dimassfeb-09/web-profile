<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		value?: string | null;
		onChange: (file: File | null) => void;
		onClear: () => void;
		label?: string;
		maxSizeMB?: number;
		aspectRatio?: string;
		className?: string;
	}

	let {
		value,
		onChange,
		onClear,
		label = 'Upload Image',
		maxSizeMB = 5,
		aspectRatio = 'aspect-[1024/500]',
		className
	}: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let previewUrl = $state<string | null>(null);
	let selectedFile = $state<File | null>(null);

	$effect(() => {
		if (value) previewUrl = value;
	});

	function handleFileChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const MAX_SIZE = maxSizeMB * 1024 * 1024;
		if (file.size > MAX_SIZE) {
			alert(`File is too large! Maximum size allowed is ${maxSizeMB}MB.`);
			input.value = '';
			return;
		}

		selectedFile = file;
		onChange(file);
		previewUrl = URL.createObjectURL(file);
	}

	function handleClear(e: MouseEvent) {
		e.stopPropagation();
		selectedFile = null;
		previewUrl = null;
		onChange(null);
		onClear();
		if (fileInput) fileInput.value = '';
	}
</script>

<div class={cn('space-y-3', className)}>
	<span class="font-label text-xs text-on-surface-variant ml-1 font-body">
		{label} (Max {maxSizeMB}MB)
	</span>

	<div
		role="button"
		tabindex="0"
		onclick={() => fileInput?.click()}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				fileInput?.click();
			}
		}}
		class={cn(
			'relative group w-full overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all cursor-pointer bg-surface-container-low flex flex-col items-center justify-center gap-3',
			aspectRatio
		)}
	>
		{#if previewUrl}
			<div class="absolute inset-0 overflow-hidden">
				<img
					src={previewUrl}
					alt="Preview"
					class="w-full h-full object-cover transition-transform group-hover:scale-105"
				/>
			</div>
			<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
				<span class="text-white text-xs font-label">Change Image</span>
				<button
					type="button"
					onclick={handleClear}
					class="p-2 rounded-full bg-error text-white hover:bg-error-container hover:text-on-error-container transition-all"
					title="Remove image"
				>
					<span class="material-symbols-outlined text-lg">delete</span>
				</button>
			</div>
		{:else}
			<div class="flex flex-col items-center gap-2 text-on-surface-variant group-hover:text-primary transition-colors">
				<span class="material-symbols-outlined text-4xl">cloud_upload</span>
				<span class="text-sm font-label">Click to upload image</span>
			</div>
		{/if}

		<input
			bind:this={fileInput}
			type="file"
			onchange={handleFileChange}
			accept="image/*"
			class="hidden"
		/>
	</div>
</div>