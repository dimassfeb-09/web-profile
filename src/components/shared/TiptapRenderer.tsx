'use client';

import React from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { tiptapExtensions } from '@/src/lib/tiptap-extensions';

interface TiptapRendererProps {
  content: JSONContent;
  className?: string;
}

const TiptapRenderer: React.FC<TiptapRendererProps> = ({ content, className }) => {
  const editor = useEditor({
    editable: false,
    content: content,
    extensions: tiptapExtensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: className || 'prose prose-invert max-w-none focus:outline-none',
      },
    },
  });

  return <EditorContent editor={editor} />;
};

export default TiptapRenderer;
