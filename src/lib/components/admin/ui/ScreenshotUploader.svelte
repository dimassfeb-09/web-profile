<script lang="ts">
	import { ImagePlus, Trash2 } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type ScreenshotItem =
		| { type: 'url'; url: string; id: string }
		| { type: 'file'; file: File; previewUrl: string; id: string };

	interface Props {
		existingUrls: string[];
		maxImages?: number;
		maxSizeMB?: number;
		onFilesChange: (files: File[]) => void;
		onUrlsChange: (urls: string[]) => void;
		className?: string;
	}

	let {
		existingUrls,
		maxImages = 8,
		maxSizeMB = 3,
		onFilesChange,
		onUrlsChange,
		className
	}: Props = $props();

	let fileInput = $state<HTMLInputElement | null>(null);
	let items = $state<ScreenshotItem[]>([]);

	$effect(() => {
		const urlItems: ScreenshotItem[] = existingUrls.map((url, i) => ({
			type: 'url',
			url,
			id: `url-${i}-${url}`
		}));
		const currentFiles = items.filter((item) => item.type === 'file');
		items = [...urlItems, ...currentFiles];
	});

	$effect(() => {
		const fileItems = items.filter((item): item is Extract<ScreenshotItem, { type: 'file' }> => item.type === 'file');
		onFilesChange(fileItems.map((f) => f.file));
	});

	function handleFileChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const files = Array.from(input.files || []);
		if (files.length === 0) return;

		const currentTotal = items.length;
		if (currentTotal + files.length > maxImages) {
			alert(
				`You can only upload up to ${maxImages} images in total. You are trying to add ${files.length} to ${currentTotal} existing images.`
			);
			input.value = '';
			return;
		}

		const MAX_SIZE = maxSizeMB * 1024 * 1024;
		const newItems: ScreenshotItem[] = [];

		for (const file of files) {
			if (!file.type.startsWith('image/')) {
				alert(`${file.name} is not a valid image format.`);
				continue;
			}
			if (file.size > MAX_SIZE) {
				alert(`${file.name} is too large! Maximum size allowed is ${maxSizeMB}MB.`);
				continue;
			}
			newItems.push({
				type: 'file',
				file,
				previewUrl: URL.createObjectURL(file),
				id: `file-${Date.now()}-${file.name}`
			});
		}

		items = [...items, ...newItems];
		input.value = '';
	}

	function handleRemove(idToRemove: string) {
		const itemToRemove = items.find((i) => i.id === idToRemove);
		if (!itemToRemove) return;

		if (itemToRemove.type === 'file') {
			URL.revokeObjectURL(itemToRemove.previewUrl);
		} else {
			const currentUrlItems = items.filter(
				(item): item is Extract<ScreenshotItem, { type: 'url' }> => item.type === 'url'
			);
			const updatedUrls = currentUrlItems.filter((i) => i.id !== idToRemove).map((i) => i.url);
			onUrlsChange(updatedUrls);
		}

		items = items.filter((item) => item.id !== idToRemove);
	}

	const currentCount = $derived(items.length);
</script>

<div class={cn('space-y-3', className)}>
	<div class="flex justify-between items-center px-1">
		<span class="font-label text-xs text-on-surface-variant font-body">
			Gallery Screenshots ({currentCount}/{maxImages})
		</span>
		<div class="text-[10px] text-on-surface-variant/70 font-label">Max {maxSizeMB}MB per image</div>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each items as item, index (item.id)}
			<div
				class="group relative aspect-[9/16] bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm animate-fade-in"
			>
				<img
					src={item.type === 'url' ? item.url : item.previewUrl}
					alt={`Screenshot ${index + 1}`}
					class="w-full h-full object-cover transition-transform group-hover:scale-105"
				/>

				<div
					class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
				>
					<button
						type="button"
						onclick={() => handleRemove(item.id)}
						class="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:bg-error-container hover:text-on-error-container transition-all shadow-lg hover:scale-110 active:scale-95"
						title="Remove image"
					>
						<Trash2 class="w-4 h-4" />
					</button>
				</div>

				{#if item.type === 'file'}
					<div
						class="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
					>
						New
					</div>
				{/if}
			</div>
		{/each}

		{#if currentCount < maxImages}
			<button
				type="button"
				onclick={() => fileInput?.click()}
				class="aspect-[9/16] bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low transition-all rounded-xl cursor-pointer flex flex-col items-center justify-center gap-2 group text-on-surface-variant"
			>
				<div class="p-3 rounded-full bg-surface-container-high group-hover:bg-primary/10 group-hover:text-primary transition-colors">
					<ImagePlus class="w-5 h-5" />
				</div>
				<span class="text-[10px] font-label font-medium uppercase tracking-wider group-hover:text-primary transition-colors">
					Add Image
				</span>
			</button>
		{/if}
	</div>

	<input
		bind:this={fileInput}
		type="file"
		multiple
		onchange={handleFileChange}
		accept="image/jpeg,image/png,image/webp"
		class="hidden"
	/>
</div>