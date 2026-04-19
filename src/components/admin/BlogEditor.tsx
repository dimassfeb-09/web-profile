'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Image as ImageIcon, Undo, Redo, Code, 
  Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, 
  Link as LinkIcon, Minus, Terminal
} from 'lucide-react';
import { JSONContent } from '@tiptap/react';
import { tiptapExtensionsClient } from '@/src/lib/tiptap-extensions-client';
import './editor.css';

interface BlogEditorProps {
  content: JSONContent | string;
  onChange: (json: JSONContent) => void;
  blogId: string;
}

const MenuBar = ({ editor, blogId }: { editor: any, blogId: string }) => {
  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('blogId', blogId);

      try {
        const res = await fetch('/api/blog/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const buttons = [
    // Basic Formatting
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold', title: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', title: 'Italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'Underline' },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: 'strike', title: 'Strikethrough' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code', title: 'Code' },
    { icon: Terminal, action: () => editor.chain().focus().toggleCodeBlock().run(), active: 'codeBlock', title: 'Code Block' },
    
    { type: 'spacer' },

    // Headings
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: { heading: { level: 1 } }, title: 'Heading 1' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: { heading: { level: 2 } }, title: 'Heading 2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: { heading: { level: 3 } }, title: 'Heading 3' },
    
    { type: 'spacer' },

    // Lists & Blocks
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList', title: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList', title: 'Numbered List' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote', title: 'Blockquote' },
    { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), active: null, title: 'Horizontal Rule' },
    
    { type: 'spacer' },

    // Alignment
    { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), active: { textAlign: 'left' }, title: 'Align Left' },
    { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), active: { textAlign: 'center' }, title: 'Align Center' },
    { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), active: { textAlign: 'right' }, title: 'Align Right' },
    
    { type: 'spacer' },

    // Media & Links
    { icon: LinkIcon, action: setLink, active: 'link', title: 'Add Link' },
    { icon: ImageIcon, action: addImage, active: null, title: 'Add Image' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 md:p-3 border-b border-outline-variant/10 bg-surface sticky top-[5.25rem] lg:top-[6.25rem] z-50">
      {buttons.map((btn, i) => {
        if (btn.type === 'spacer') {
          return <div key={`spacer-${i}`} className="w-px h-6 bg-outline-variant/20 mx-1 self-center" />;
        }
        
        const Icon = (btn as any).icon;
        return (
          <button
            key={i}
            onClick={(btn as any).action}
            className={`p-2 rounded-lg transition-all duration-200 group ${
              (btn as any).active && editor.isActive((btn as any).active)
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary'
            }`}
            type="button"
            title={(btn as any).title}
          >
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        );
      })}
      
      <div className="flex-grow" />

      <div className="flex gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary disabled:opacity-20 transition-all rounded-lg"
          type="button"
          title="Undo"
        >
          <Undo className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary disabled:opacity-20 transition-all rounded-lg"
          type="button"
          title="Redo"
        >
          <Redo className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default function BlogEditor({ content, onChange, blogId }: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: tiptapExtensionsClient,
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content max-w-none focus:outline-none p-4 md:p-12 min-h-[600px] selection:bg-primary/20',
      },
    },
  });

  return (
    <div className="w-full border border-outline-variant/20 rounded-[1.5rem] md:rounded-[2.5rem] bg-surface shadow-xs ring-1 ring-black/[0.02]">
      <MenuBar editor={editor} blogId={blogId} />
      <EditorContent editor={editor} />
    </div>
  );
}
