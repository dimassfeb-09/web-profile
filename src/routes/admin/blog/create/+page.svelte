<script lang="ts">
	import { goto } from '$app/navigation';
	import BlogEditor from '$lib/components/admin/blog/BlogEditor.svelte';
	import BlogPreviewModal from '$lib/components/admin/blog/BlogPreviewModal.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { ArrowLeft, FileText, Globe, Eye } from 'lucide-svelte';
	import { confirmSeoPublish } from '$lib/seo-check';

	const blogId = $state(uuidv4());
	let isSaving = $state(false);
	let isPreviewOpen = $state(false);

	let formData = $state({
		title: '',
		slug: '',
		excerpt: '',
		content: {} as Record<string, unknown>,
		is_published: false
	});
	let slugTouched = $state(false);
	function toSlug(s: string) {
		return s.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
	}

	const handleSubmit = async (publishOverride?: boolean) => {
		if (!formData.title || !formData.slug || !formData.content.type) {
			alert('Please fill in required fields and content');
			return;
		}

		isSaving = true;
		try {
			const finalIsPublished = publishOverride !== undefined ? publishOverride : formData.is_published;
			if (finalIsPublished && !confirmSeoPublish(formData.content)) {
				isSaving = false;
				return;
			}
			const res = await fetch('/api/blog', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					is_published: finalIsPublished,
					id: blogId
				})
			});

			if (res.ok) {
				goto('/admin/blog');
			} else {
				const data = await res.json();
				alert(data.message || 'Error saving blog');
			}
		} catch {
			alert('Failed to save blog');
		} finally {
			isSaving = false;
		}
	};
</script>

<div class="max-w-5xl mx-auto space-y-8">
	<div class="flex items-center gap-4">
		<a href="/admin/blog" class="p-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-white/10 transition-all">
			<ArrowLeft class="w-5 h-5" />
		</a>
		<div>
			<h1 class="font-headline text-2xl font-bold">Create New Blog Post</h1>
			<p class="font-body text-sm text-on-surface-variant italic">ID: {blogId}</p>
		</div>
	</div>

	<div class="space-y-6">
		<div class="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 sm:p-8 space-y-8">
			<div class="form-grid">
				<div class="space-y-2 lg:col-span-6">
					<label class="flex items-center gap-2">
						<FileText class="w-3 h-3 text-primary" /> Title
					</label>
					<input
						type="text"
						required
						placeholder="Post Title"
						value={formData.title}
						oninput={(e) => {
							formData.title = (e.currentTarget as HTMLInputElement).value;
							if (!slugTouched) formData.slug = toSlug(formData.title);
						}}
					/>
				</div>

				<div class="space-y-2 lg:col-span-6">
					<label class="flex items-center gap-2">
						<Globe class="w-3 h-3 text-primary" /> Slug
					</label>
					<div
						class="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
					>
						<span class="text-on-surface-variant text-xs font-bold font-label opacity-50 shrink-0">/blog/</span>
						<input
							type="text"
							required
							placeholder="post-url-slug"
							value={formData.slug}
							oninput={(e) => {
								slugTouched = true;
								formData.slug = (e.currentTarget as HTMLInputElement).value;
							}}
							class="border-none px-0 focus:ring-0"
						/>
					</div>
				</div>

				<div class="space-y-2 lg:col-span-12">
					<label for="blog-excerpt">Excerpt (Short Summary)</label>
					<textarea
						id="blog-excerpt"
						rows={2}
						placeholder="A brief summary for list view..."
						value={formData.excerpt}
						oninput={(e) => (formData.excerpt = (e.currentTarget as HTMLTextAreaElement).value)}
						class="resize-none"
					></textarea>
				</div>

				<div class="space-y-2 lg:col-span-12">
					<span>Content Editor</span>
					<BlogEditor
						blogId={blogId}
						content={formData.content}
						onChange={(json) => (formData = { ...formData, content: json })}
					/>
				</div>
			</div>

			<div
				class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-outline-variant/10"
			>
				<button
					type="button"
					disabled={isSaving}
					onclick={() => (isPreviewOpen = true)}
					class="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-all border border-secondary/20 order-3 sm:order-1 sm:mr-auto"
				>
					<Eye class="w-5 h-5" />
					Preview
				</button>

				<button
					type="button"
					disabled={isSaving}
					onclick={() => handleSubmit(false)}
					class="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-container-high transition-all disabled:opacity-50 order-2"
				>
					<FileText class="w-5 h-5" />
					Save Draft
				</button>

				<button
					type="button"
					disabled={isSaving}
					onclick={() => handleSubmit(true)}
					class="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 order-1 sm:order-3"
				>
					{#if isSaving}
						<div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
					{:else}
						<Globe class="w-5 h-5" />
					{/if}
					Publish
				</button>
			</div>
		</div>
	</div>

	<BlogPreviewModal
		isOpen={isPreviewOpen}
		onClose={() => (isPreviewOpen = false)}
		title={formData.title}
		excerpt={formData.excerpt}
		content={formData.content}
	/>
</div>