import { tiptapExtensions, getLowlight, getBaseExtensions } from '@/src/lib/tiptap-extensions';

describe('Tiptap Extensions (Server)', () => {
  it('should have basic extensions defined', () => {
    const base = getBaseExtensions();
    expect(base).toBeDefined();
    expect(Array.isArray(base)).toBe(true);
  });

  it('should have lowlight configured with dart support', () => {
    const lowlight = getLowlight();
    expect(lowlight).toBeDefined();
    expect(lowlight.listLanguages()).toContain('dart');
  });

  it('should contain CodeBlockLowlight with filename attribute', () => {
    const codeBlockExt = tiptapExtensions.find(ext => ext.name === 'codeBlock') as any;
    expect(codeBlockExt).toBeDefined();

    // accessing internal addAttributes for coverage
    const attributes = codeBlockExt.config.addAttributes();
    expect(attributes).toHaveProperty('filename');

    const filenameAttr = attributes.filename;

    // Test parseHTML
    const mockElement = {
      getAttribute: jest.fn().mockImplementation((name) => {
        if (name === 'data-filename') return 'test.js';
        return null;
      })
    };
    expect(filenameAttr.parseHTML(mockElement)).toBe('test.js');

    // Test renderHTML
    expect(filenameAttr.renderHTML({ filename: 'main.py' })).toEqual({ 'data-filename': 'main.py' });
    expect(filenameAttr.renderHTML({ filename: null })).toEqual({});
    expect(filenameAttr.renderHTML({})).toEqual({});
    
    // Additional branch test: trigger parent call if possible (manual trigger)
    const mockContext = { parent: jest.fn().mockReturnValue({ existing: {} }) };
    const boundAttr = codeBlockExt.config.addAttributes.bind(mockContext);
    const result = boundAttr();
    expect(result).toHaveProperty('existing');
  });
});
