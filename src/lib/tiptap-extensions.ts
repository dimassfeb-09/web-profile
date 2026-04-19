import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import dart from 'highlight.js/lib/languages/dart';

const lowlight = createLowlight(common);
lowlight.register('dart', dart);

export const getLowlight = () => lowlight;

export const getBaseExtensions = () => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false, // Matikan default code block karena kita pakai lowlight
    // Ensure these are NOT in StarterKit to avoid duplicates
    underline: false,
  } as Record<string, unknown>),
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

export const tiptapExtensions = [
  ...getBaseExtensions(),
  CodeBlockLowlight.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        filename: {
          default: null,
          parseHTML: element => element.getAttribute('data-filename'),
          renderHTML: attributes => {
            if (!attributes.filename) return {}
            return { 'data-filename': attributes.filename }
          },
        },
      }
    },
  }).configure({ lowlight }),
];
