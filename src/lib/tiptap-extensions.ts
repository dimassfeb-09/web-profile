import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

export const tiptapExtensions = [
  StarterKit.configure({
    horizontalRule: false,
    // Ensure these are NOT in StarterKit to avoid duplicates
    link: false,
    underline: false,
  } as any),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary font-bold underline hover:no-underline transition-all',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'rounded-xl mx-auto my-8 border border-outline-variant/10',
    },
  }),
];
