<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { X, Upload, Link as LinkIcon, ImagePlay, Loader2, Search } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onInsert: (url: string) => void;
		onUpload: (file: File) => Promise<string | null>;
	}

	let { isOpen, onClose, onInsert, onUpload }: Props = $props();

	type Tab = 'upload' | 'link' | 'giphy';

	let activeTab = $state<Tab>('upload');
	let linkUrl = $state('');
	let isUploading = $state(false);
	let searchQuery = $state('');
	let gifs = $state<any[]>([]);
	let isSearching = $state(false);
	let apiKeyMissing = $state(false);
	let errorMsg = $state('');

	$effect(() => {
		if (isOpen) {
			linkUrl = '';
			searchQuery = '';
			gifs = [];
			activeTab = 'upload';
		}
	});

	let dialogRef = $state<HTMLDivElement>();

	$effect(() => {
		if (!isOpen || !dialogRef) return;
		const handleOutsideClick = (e: MouseEvent) => {
			if (dialogRef && !dialogRef.contains(e.target as Node)) {
				onClose();
			}
		};
		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	});

	const handleFileUpload = async (e: Event) => {
		const file = (e.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;

		isUploading = true;
		try {
			const url = await onUpload(file);
			if (url) {
				onInsert(url);
				onClose();
			}
		} finally {
			isUploading = false;
		}
	};

	const handleLinkSubmit = (e?: Event) => {
		e?.preventDefault();
		if (linkUrl.trim()) {
			onInsert(linkUrl.trim());
			onClose();
		}
	};

	const searchGifs = async () => {
		if (!searchQuery.trim()) return;

		isSearching = true;
		apiKeyMissing = false;
		errorMsg = '';

		if (!env.PUBLIC_GIPHY_API_KEY) {
			isSearching = false;
			apiKeyMissing = true;
			return;
		}

		try {
			const res = await fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=${env.PUBLIC_GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=20&rating=g`
			);
			const data = await res.json();
			if (res.ok && data.data) {
				gifs = data.data;
			} else {
				errorMsg = data.message || 'Failed to fetch GIFs from Giphy';
			}
		} catch {
			console.error('Error fetching GIFs:');
			errorMsg = 'Network error: Failed to reach Giphy. If you are using an adblocker, it might be blocking the request.';
		} finally {
			isSearching = false;
		}
	};

	const getTrendingGifs = async () => {
		isSearching = true;
		errorMsg = '';
		if (!env.PUBLIC_GIPHY_API_KEY) {
			isSearching = false;
			apiKeyMissing = true;
			return;
		}

		try {
			const res = await fetch(
				`https://api.giphy.com/v1/gifs/trending?api_key=${env.PUBLIC_GIPHY_API_KEY}&limit=20&rating=g`
			);
			const data = await res.json();
			if (res.ok && data.data) {
				gifs = data.data;
			} else {
				errorMsg = data.message || 'Failed to load trending GIFs';
			}
		} catch {
			console.error('Error fetching trending GIFs:');
			errorMsg = 'Network error: Failed to reach Giphy. If you are using an adblocker, it might be blocking the request.';
		} finally {
			isSearching = false;
		}
	};

	$effect(() => {
		if (activeTab === 'giphy' && gifs.length === 0 && !searchQuery && !apiKeyMissing) {
			getTrendingGifs();
		}
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
		<div
			bind:this={dialogRef}
			class="bg-surface w-full max-w-lg rounded-3xl shadow-xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[80vh]"
		>
			<div class="flex items-center justify-between p-4 border-b border-outline-variant/10">
				<h3 class="font-headline font-bold text-lg text-on-surface">Add Media</h3>
				<button
					onclick={onClose}
					class="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="flex border-b border-outline-variant/10">
				<button
					onclick={() => (activeTab = 'upload')}
					class={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-bold transition-colors ${activeTab === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
				>
					<Upload class="w-4 h-4" /> Upload
				</button>
				<button
					onclick={() => (activeTab = 'link')}
					class={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-bold transition-colors ${activeTab === 'link' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
				>
					<LinkIcon class="w-4 h-4" /> Link
				</button>
				<button
					onclick={() => (activeTab = 'giphy')}
					class={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-bold transition-colors ${activeTab === 'giphy' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
				>
					<ImagePlay class="w-4 h-4" /> Giphy
				</button>
			</div>

			<div class="p-6 overflow-y-auto custom-scrollbar flex-grow">
				{#if activeTab === 'upload'}
					<div class="flex flex-col items-center justify-center py-8">
						<input
							type="file"
							id="media-upload"
							accept="image/*"
							class="hidden"
							onchange={handleFileUpload}
							disabled={isUploading}
						/>
						<label
							for="media-upload"
							class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-outline-variant/40 rounded-2xl cursor-pointer hover:bg-surface-container-low hover:border-primary transition-all"
						>
							{#if isUploading}
								<Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
								<span class="text-sm font-bold text-on-surface-variant">Uploading...</span>
							{:else}
								<div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
									<Upload class="w-6 h-6" />
								</div>
								<span class="text-sm font-bold text-on-surface">Click to upload image or GIF</span>
								<span class="text-xs text-on-surface-variant mt-1">Supports JPG, PNG, WEBP, GIF (Max 5MB)</span>
							{/if}
						</label>
					</div>
				{/if}

				{#if activeTab === 'link'}
					<div class="flex flex-col gap-4 py-4">
						<div>
							<label for="media-url" class="block text-sm font-bold text-on-surface mb-2">Image or GIF URL</label>
							<input
								id="media-url"
								type="url"
								placeholder="https://example.com/image.gif"
								value={linkUrl}
								oninput={(e) => (linkUrl = (e.currentTarget as HTMLInputElement).value)}
								onkeydown={(e) => e.key === 'Enter' && handleLinkSubmit(e)}
								class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/50"
								required
							/>
						</div>
						<button
							type="button"
							onclick={() => handleLinkSubmit()}
							disabled={!linkUrl}
							class="w-full py-3 rounded-xl bg-primary text-white font-bold disabled:opacity-50 transition-all hover:opacity-90"
						>
							Insert Media
						</button>
					</div>
				{/if}

				{#if activeTab === 'giphy'}
					<div class="flex flex-col gap-4 h-full">
						<div class="relative">
							<input
								type="text"
								placeholder="Search GIFs..."
								value={searchQuery}
								oninput={(e) => (searchQuery = (e.currentTarget as HTMLInputElement).value)}
								onkeydown={(e) => e.key === 'Enter' && searchGifs()}
								class="w-full pl-10 pr-20 py-3 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/50"
							/>
							<Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
							<button
								onclick={searchGifs}
								class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90"
							>
								Search
							</button>
						</div>

						{#if apiKeyMissing}
							<div class="p-4 bg-error/10 text-error rounded-xl text-sm text-center">
								<strong>API Key Missing!</strong><br />
								Please add <code class="bg-error/20 px-1 rounded">PUBLIC_GIPHY_API_KEY</code> to your .env file to use Giphy search.
							</div>
						{/if}

						{#if errorMsg && !apiKeyMissing}
							<div class="p-4 bg-error/10 text-error rounded-xl text-sm text-center">
								{errorMsg}
							</div>
						{/if}

						{#if isSearching}
							<div class="flex justify-center py-8">
								<Loader2 class="w-8 h-8 text-primary animate-spin" />
							</div>
						{:else}
							<div class="grid grid-cols-2 gap-2 overflow-y-auto pb-4">
								{#each gifs as gif (gif.id)}
									<button
										onclick={() => {
											onInsert(gif.images.original.url);
											onClose();
										}}
										class="relative rounded-xl overflow-hidden aspect-video bg-surface-container-low group hover:ring-2 hover:ring-primary transition-all"
									>
										<img
											src={gif.images.fixed_height_small.url}
											alt={gif.title}
											class="w-full h-full object-cover"
											loading="lazy"
										/>
									</button>
								{/each}
								{#if gifs.length === 0 && !apiKeyMissing}
									<div class="col-span-2 text-center py-8 text-on-surface-variant text-sm">
										No GIFs found
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}