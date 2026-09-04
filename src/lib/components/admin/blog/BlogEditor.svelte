<script lang="ts">
	import { Editor } from '@tiptap/core';
	import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';
	import { getTiptapExtensions } from '$lib/tiptap-extensions';
	import MediaDialog from './MediaDialog.svelte';
	import {
		Bold,
		Italic,
		List,
		ListOrdered,
		Heading1,
		Heading2,
		Heading3,
		Quote,
		Image as ImageIcon,
		Undo,
		Redo,
		Code,
		Underline as UnderlineIcon,
		Strikethrough,
		AlignLeft,
		AlignCenter,
		AlignRight,
		Link as LinkIcon,
		Minus,
		Highlighter,
		Subscript as SubscriptIcon,
		Superscript as SuperscriptIcon,
		CheckSquare,
		Trash2
	} from 'lucide-svelte';
	import './editor.css';

	interface Props {
		content: Record<string, unknown>;
		onChange: (json: Record<string, unknown>) => void;
		blogId: string;
	}

	let { content, onChange, blogId }: Props = $props();

	let editor = $state<Editor | null>(null);
	let editorEl = $state<HTMLDivElement>();
	let bubbleEl = $state<HTMLDivElement>();
	let isMediaDialogOpen = $state(false);
	// ponytail: transaction counter forces re-render so isActive() reflects editor state
	let activeVersion = $state(0);

	$effect(() => {
		if (!editorEl) return;

		const base = getTiptapExtensions().filter((ext: any) => ext.name !== 'bubbleMenu');

		// ponytail: assign ke outer state — `const` di sini dulu bikin seluruh toolbar mati (null selamanya)
		editor = new Editor({
			element: editorEl,
			extensions: [
				...base,
				BubbleMenuExtension.configure({
					element: bubbleEl,
					shouldShow: ({ editor, state }) => {
						const { selection } = state;
						if (!editor.isActive('link') && selection.empty) return false;
						if (editor.isActive('codeBlock')) return false;
						return true;
					}
				})
			],
			content: content,
			onUpdate: ({ editor }) => onChange(editor.getJSON()),
			editorProps: {
				attributes: {
					class:
						'tiptap-content max-w-none focus:outline-none p-4 md:p-12 min-h-[600px] selection:bg-primary/20'
				}
			}
		});

		editor.on('transaction', () => {
			activeVersion++;
		});

		return () => {
			editor?.destroy();
			editor = null;
		};
	});

	// ponytail: konten edit-page datang async SETELAH editor mount — sync sekali saat beda (banding JSON cegah loop)
	$effect(() => {
		if (!editor || editor.isDestroyed) return;
		const incoming = JSON.stringify(content ?? {});
		if (incoming === '{}') return;
		if (JSON.stringify(editor.getJSON()) !== incoming) {
			editor.commands.setContent(JSON.parse(incoming));
		}
	});

	const handleSetLink = () => {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href as string;
		const url = window.prompt('URL', previousUrl);

		if (url === null) return;
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	};

	const handleUpload = async (file: File): Promise<string | null> => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('blogId', blogId);

		try {
			const res = await fetch('/api/blog/upload', {
				method: 'POST',
				body: formData
			});
			const data = await res.json();
			if (data.url) {
				return data.url;
			}
		} catch (error) {
			console.error('Upload failed:', error);
		}
		return null;
	};

	const handleInsertMedia = (url: string) => {
		if (editor) {
			// ponytail: minta alt saat insert — og:image + aksesibilitas gratis, tanpa tebak-tebakan mesin
			const alt = window.prompt('Alt text gambar (deskripsi singkat untuk SEO & screen reader):', '') ?? '';
			editor.chain().focus().setImage({ src: url, alt }).run();
		}
	};
</script>

<div
	class="w-full border border-outline-variant/20 rounded-[1.5rem] md:rounded-[2.5rem] bg-surface shadow-xs ring-1 ring-black/[0.02] relative"
>
	<div
		class="flex flex-wrap gap-1 p-2 md:p-3 border-b border-outline-variant/10 bg-surface sticky top-[5.25rem] lg:top-[6.25rem] z-50"
	>
		<button
			type="button"
			title="Bold"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('bold')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleBold().run()}
		>
			<Bold class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Italic"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('italic')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleItalic().run()}
		>
			<Italic class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Underline"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('underline')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleUnderline().run()}
		>
			<UnderlineIcon class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Strikethrough"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('strike')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleStrike().run()}
		>
			<Strikethrough class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Code"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('code')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleCode().run()}
		>
			<Code class="w-4 h-4 md:w-5 md:h-5" />
		</button>

		<div class="w-px h-6 bg-outline-variant/20 mx-1 self-center"></div>

		<button
			type="button"
			title="Heading 1"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('heading', { level: 1 })
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		>
			<Heading1 class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Heading 2"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('heading', { level: 2 })
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		>
			<Heading2 class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Heading 3"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('heading', { level: 3 })
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
		>
			<Heading3 class="w-4 h-4 md:w-5 md:h-5" />
		</button>

		<div class="w-px h-6 bg-outline-variant/20 mx-1 self-center"></div>

		<button
			type="button"
			title="Bullet List"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('bulletList')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleBulletList().run()}
		>
			<List class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Numbered List"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('orderedList')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleOrderedList().run()}
		>
			<ListOrdered class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Blockquote"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('blockquote')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleBlockquote().run()}
		>
			<Quote class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Task List"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('taskList')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleTaskList().run()}
		>
			<CheckSquare class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Horizontal Rule"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().setHorizontalRule().run()}
		>
			<Minus class="w-4 h-4 md:w-5 md:h-5" />
		</button>

		<div class="w-px h-6 bg-outline-variant/20 mx-1 self-center"></div>

		<button
			type="button"
			title="Align Left"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive({ textAlign: 'left' })
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().setTextAlign('left').run()}
		>
			<AlignLeft class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Align Center"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive({ textAlign: 'center' })
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().setTextAlign('center').run()}
		>
			<AlignCenter class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Align Right"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive({ textAlign: 'right' })
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().setTextAlign('right').run()}
		>
			<AlignRight class="w-4 h-4 md:w-5 md:h-5" />
		</button>

		<div class="w-px h-6 bg-outline-variant/20 mx-1 self-center"></div>

		<button
			type="button"
			title="Subscript"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('subscript')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleSubscript().run()}
		>
			<SubscriptIcon class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Superscript"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('superscript')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={() => editor?.chain().focus().toggleSuperscript().run()}
		>
			<SuperscriptIcon class="w-4 h-4 md:w-5 md:h-5" />
		</button>

		<div class="w-px h-6 bg-outline-variant/20 mx-1 self-center"></div>

		<button
			type="button"
			title="Add Link"
			class={`p-2 rounded-lg transition-all duration-200 group ${
				activeVersion >= 0 && editor?.isActive('link')
					? 'bg-primary text-white shadow-lg shadow-primary/20'
					: 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
			}`}
			onclick={handleSetLink}
		>
			<LinkIcon class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Add Media (Upload, Link, GIF)"
			class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary transition-all"
			onclick={() => (isMediaDialogOpen = true)}
		>
			<ImageIcon class="w-4 h-4 md:w-5 md:h-5" />
		</button>

		<div class="flex-grow"></div>

		<button
			type="button"
			title="Undo"
			class="p-2 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary disabled:opacity-20 transition-all rounded-lg"
			disabled={!editor?.can().undo()}
			onclick={() => editor?.chain().focus().undo().run()}
		>
			<Undo class="w-4 h-4 md:w-5 md:h-5" />
		</button>
		<button
			type="button"
			title="Redo"
			class="p-2 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary disabled:opacity-20 transition-all rounded-lg"
			disabled={!editor?.can().redo()}
			onclick={() => editor?.chain().focus().redo().run()}
		>
			<Redo class="w-4 h-4 md:w-5 md:h-5" />
		</button>
	</div>

	<div
		bind:this={bubbleEl}
		class="flex items-center gap-1 p-1.5 rounded-2xl bg-surface-container-high shadow-xl border border-outline-variant/20"
		style="display:none"
	>
		<button
			type="button"
			title="Bold"
			class={`p-1.5 rounded-lg transition-all ${
				activeVersion >= 0 && editor?.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-surface-variant text-on-surface-variant'
			}`}
			onclick={() => editor?.chain().focus().toggleBold().run()}
		>
			<Bold class="w-4 h-4" />
		</button>
		<button
			type="button"
			title="Italic"
			class={`p-1.5 rounded-lg transition-all ${
				activeVersion >= 0 && editor?.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-surface-variant text-on-surface-variant'
			}`}
			onclick={() => editor?.chain().focus().toggleItalic().run()}
		>
			<Italic class="w-4 h-4" />
		</button>
		<button
			type="button"
			title="Underline"
			class={`p-1.5 rounded-lg transition-all ${
				activeVersion >= 0 && editor?.isActive('underline') ? 'bg-primary/20 text-primary' : 'hover:bg-surface-variant text-on-surface-variant'
			}`}
			onclick={() => editor?.chain().focus().toggleUnderline().run()}
		>
			<UnderlineIcon class="w-4 h-4" />
		</button>
		<button
			type="button"
			title="Inline Code"
			class={`p-1.5 rounded-lg transition-all ${
				activeVersion >= 0 && editor?.isActive('code') ? 'bg-primary/20 text-primary' : 'hover:bg-surface-variant text-on-surface-variant'
			}`}
			onclick={() => editor?.chain().focus().toggleCode().run()}
		>
			<Code class="w-4 h-4" />
		</button>
		<button
			type="button"
			title="Add/Edit Link"
			class={`p-1.5 rounded-lg transition-all ${
				activeVersion >= 0 && editor?.isActive('link') ? 'bg-primary/20 text-primary' : 'hover:bg-surface-variant text-on-surface-variant'
			}`}
			onclick={handleSetLink}
		>
			<LinkIcon class="w-4 h-4" />
		</button>

		<div class="w-px h-5 bg-outline-variant/30 mx-1"></div>

		<div class="flex items-center gap-1.5 px-1">
			<button
				type="button"
				title="Default Color"
				class="w-5 h-5 rounded-full bg-on-surface border-2 border-surface shadow-sm hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().unsetColor().run()}
			></button>
			<button
				type="button"
				title="Blue"
				class="w-5 h-5 rounded-full bg-blue-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().setColor('#3b82f6').run()}
			></button>
			<button
				type="button"
				title="Red"
				class="w-5 h-5 rounded-full bg-red-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().setColor('#ef4444').run()}
			></button>
			<button
				type="button"
				title="Green"
				class="w-5 h-5 rounded-full bg-green-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().setColor('#22c55e').run()}
			></button>
			<button
				type="button"
				title="Purple"
				class="w-5 h-5 rounded-full bg-purple-500 border-2 border-surface shadow-sm hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().setColor('#a855f7').run()}
			></button>
		</div>

		<div class="w-px h-5 bg-outline-variant/30 mx-1"></div>

		<div class="flex items-center gap-1.5 px-1">
			<button
				type="button"
				title="No Highlight"
				class="p-1 rounded-md text-on-surface-variant hover:bg-surface-variant transition-all"
				onclick={() => editor?.chain().focus().unsetMark('highlight').run()}
			>
				<Highlighter class="w-4 h-4 opacity-50" />
			</button>
			<button
				type="button"
				title="Highlight Yellow"
				class="w-5 h-5 rounded bg-yellow-200 border border-black/5 hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().toggleMark('highlight', { color: '#fef08a' }).run()}
			></button>
			<button
				type="button"
				title="Highlight Green"
				class="w-5 h-5 rounded bg-green-200 border border-black/5 hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().toggleMark('highlight', { color: '#bbf7d0' }).run()}
			></button>
			<button
				type="button"
				title="Highlight Blue"
				class="w-5 h-5 rounded bg-blue-200 border border-black/5 hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().toggleMark('highlight', { color: '#bfdbfe' }).run()}
			></button>
			<button
				type="button"
				title="Highlight Pink"
				class="w-5 h-5 rounded bg-pink-200 border border-black/5 hover:scale-110 transition-transform"
				onclick={() => editor?.chain().focus().toggleMark('highlight', { color: '#fbcfe8' }).run()}
			></button>
		</div>

		<div class="w-px h-5 bg-outline-variant/30 mx-1"></div>

		<button
			type="button"
			title="Clear All Formatting"
			class="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
			onclick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
		>
			<Trash2 class="w-4 h-4" />
		</button>
	</div>

	<div bind:this={editorEl}></div>

	<MediaDialog
		isOpen={isMediaDialogOpen}
		onClose={() => (isMediaDialogOpen = false)}
		onUpload={handleUpload}
		onInsert={handleInsertMedia}
	/>
</div>