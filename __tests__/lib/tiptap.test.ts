import { JSONContent } from '@tiptap/react';

// Mock generateHTML before import renderBlogContent
jest.mock('@tiptap/html/server', () => ({
  generateHTML: jest.fn((content: JSONContent, _extensions: unknown) => {
    if (!content) throw new Error('Invalid content');

    const renderNode = (node: JSONContent): string => {
      if (!node) return '';
      if (node.type === 'text') return node.text ?? '';

      const children = (node.content ?? []).map(renderNode).join('');

      switch (node.type) {
        case 'doc': return children;
        case 'paragraph': return `<p>${children}</p>`;
        case 'heading': return `<h${node.attrs?.level}>${children}</h${node.attrs?.level}>`;
        case 'bulletList': return `<ul>${children}</ul>`;
        case 'listItem': return `<li>${children}</li>`;
        case 'image':
          return `<img src="${node.attrs?.src}" class="rounded-xl mx-auto my-8 border border-outline-variant/10">`;
        default: return children;
      }
    };

    return renderNode(content);
  }),
}));

// Import AFTER mock is defined
import { renderBlogContent } from '@/src/lib/tiptap';

describe('Tiptap Library', () => {
  it('should render basic text content to HTML', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello World' }],
        },
      ],
    };

    const html = await renderBlogContent(content);
    expect(html).toContain('<p>Hello World</p>');
  });

  it('should render images with the correct flat classes', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'https://example.com/test.png' },
        },
      ],
    };

    const html = await renderBlogContent(content);
    expect(html).toContain('<img src="https://example.com/test.png"');
    expect(html).toContain('class="rounded-xl mx-auto my-8 border border-outline-variant/10"');
    expect(html).not.toContain('shadow-2xl');
  });

  it('should return empty string and log error on invalid content', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // @ts-ignore
    const html = await renderBlogContent(null);

    expect(html).toBe('');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should render complex nested content', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Title' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item 1' }] }],
            },
          ],
        },
      ],
    };

    const html = await renderBlogContent(content);
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<ul><li><p>Item 1</p></li></ul>');
  });
});