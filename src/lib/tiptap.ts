'use server';

import { generateHTML } from '@tiptap/html/server';
import { JSONContent } from '@tiptap/react';
import { tiptapExtensions } from './tiptap-extensions';

export async function renderBlogContent(content: JSONContent): Promise<string> {
  try {
    return generateHTML(content, tiptapExtensions);
  } catch (error) {
    console.error('Error rendering Tiptap content:', error);
    return '';
  }
}
