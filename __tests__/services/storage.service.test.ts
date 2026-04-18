import { StorageService } from '@/src/services/storage.service';

describe('StorageService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.SUPABASE_URL = 'https://mock-project.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-key';
    
    // Mock global fetch
    global.fetch = jest.fn() as jest.Mock;
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('uploadFile()', () => {
    it('should upload a file and return the public URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const buffer = Buffer.from('test content');
      const url = await StorageService.uploadFile('test.png', buffer, 'image/png');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('storage/v1/object/blogs/test.png'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'apikey': 'mock-key',
            'Content-Type': 'image/png'
          })
        })
      );
      expect(url).toBe('https://mock-project.supabase.co/storage/v1/object/public/blogs/test.png');
    });

    it('should throw error if fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ message: 'Invalid file' })
      });

      await expect(StorageService.uploadFile('test.png', Buffer.from(''), 'image/png'))
        .rejects.toThrow('Upload failed: Invalid file');
    });

    it('should throw error with statusText if message missing in error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({})
      });

      await expect(StorageService.uploadFile('test.png', Buffer.from(''), 'image/png'))
        .rejects.toThrow('Upload failed: Forbidden');
    });

    it('should throw error if credentials missing', async () => {
      delete process.env.SUPABASE_URL;
      await expect(StorageService.uploadFile('test.png', Buffer.from(''), 'image/png'))
        .rejects.toThrow('Supabase credentials not configured');
    });
  });

  describe('deleteFile()', () => {
    it('should delete a file correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const success = await StorageService.deleteFile('some/path.png');

      expect(success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('storage/v1/object/blogs/some/path.png'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should throw error if credentials missing', async () => {
      delete process.env.SUPABASE_URL;
      await expect(StorageService.deleteFile('test.png'))
        .rejects.toThrow('Supabase credentials not configured');
    });
  });

  describe('deleteFolder()', () => {
    it('should list and then delete all files in a folder', async () => {
      // 1. Mock list call
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { name: 'image1.png' },
          { name: 'image2.png' }
        ])
      });

      // 2. Mock delete call
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await StorageService.deleteFolder('blog-id');

      // Check list call
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('storage/v1/object/list/blogs'),
        expect.objectContaining({ method: 'POST' })
      );

      // Check delete call
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('storage/v1/object/blogs'),
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({
            prefixes: ['blog-id/image1.png', 'blog-id/image2.png']
          })
        })
      );
    });

    it('should exit early if folder is empty or list fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([])
      });

      await StorageService.deleteFolder('empty-folder');

      expect(global.fetch).toHaveBeenCalledTimes(1); // Only list call
    });

    it('should return early if list call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Service Unavailable'
      });

      await StorageService.deleteFolder('blog-id');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only list call
    });

    it('should throw error if credentials missing', async () => {
      delete process.env.SUPABASE_URL;
      await expect(StorageService.deleteFolder('blog-id'))
        .rejects.toThrow('Supabase credentials not configured');
    });
  });
});
