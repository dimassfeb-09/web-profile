import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Color } from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
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
    link: false,
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
  TextStyle,
  Color,
  BubbleMenu,
  Highlight.configure({ multicolor: true }),
  Subscript,
  Superscript,
  Typography,
  Placeholder.configure({
    placeholder: 'Write something amazing...',
    includeChildren: true,
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: 'border-t border-gray-500/30 my-8',
    },
  }),
];

export const getTiptapExtensions = () => [
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
