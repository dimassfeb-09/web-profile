'use client';

import { ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CodeBlockComponent from '@/src/components/admin/editor/CodeBlockComponent';
import { getBaseExtensions, getLowlight } from './tiptap-extensions';

const lowlight = getLowlight();

export const getTiptapExtensionsClient = () => {
  const extensions = [
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
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockComponent);
    },
  }).configure({ lowlight }),
  ];
  console.log('Tiptap Extensions Loaded:', extensions.length);
  return extensions;
};
