import { getTiptapExtensionsClient } from '@/src/lib/tiptap-extensions-client';

// Mock ReactNodeViewRenderer since it requires a real DOM/React context
jest.mock('@tiptap/react', () => ({
  ReactNodeViewRenderer: jest.fn().mockImplementation((component) => component),
}));

describe('Tiptap Extensions (Client)', () => {
  it('should contain CodeBlockLowlight with custom attributes and node view', () => {
    const extensions = getTiptapExtensionsClient();
    const codeBlockExt = extensions.find(ext => ext.name === 'codeBlock') as any;
    expect(codeBlockExt).toBeDefined();

    // Test addAttributes
    const attributes = codeBlockExt.config.addAttributes();
    expect(attributes).toHaveProperty('filename');

    // Branch coverage test: simulate when this.parent exists
    const mockContext = { parent: jest.fn().mockReturnValue({ existing: {} }) };
    const boundAttr = codeBlockExt.config.addAttributes.bind(mockContext);
    const result = boundAttr();
    expect(result).toHaveProperty('existing');
    expect(result).toHaveProperty('filename');
    
    // Test filename parse/render
    const mockElement = { getAttribute: jest.fn().mockReturnValue('style.css') };
    expect(attributes.filename.parseHTML(mockElement)).toBe('style.css');
    expect(attributes.filename.renderHTML({ filename: 'test.go' })).toEqual({ 'data-filename': 'test.go' });
    expect(attributes.filename.renderHTML({})).toEqual({});

    // Test addNodeView
    const nodeView = codeBlockExt.config.addNodeView();
    expect(nodeView).toBeDefined();
    // In our mock it returns the component passed to it
    expect(typeof nodeView).toBe('function');
  });
});
