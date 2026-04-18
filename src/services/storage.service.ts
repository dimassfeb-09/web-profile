// Credentials will be read inside methods to allow for dynamic environment variable updates (useful for testing)

export class StorageService {
  private static bucket = 'blogs';

  /**
   * Upload file to Supabase Storage using REST API
   * Path format: blogs/{blogId}/{imageId}.webp
   */
  static async uploadFile(filePath: string, fileBuffer: Buffer, contentType: string): Promise<string> {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const url = `${SUPABASE_URL}/storage/v1/object/${this.bucket}/${filePath}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      body: new Uint8Array(fileBuffer)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Upload failed: ${error.message || response.statusText}`);
    }

    // Public URL format
    return `${SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${filePath}`;
  }

  /**
   * Delete single file from Supabase Storage
   */
  static async deleteFile(filePath: string): Promise<boolean> {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const url = `${SUPABASE_URL}/storage/v1/object/${this.bucket}/${filePath}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    return response.ok;
  }

  /**
   * Delete folder (all files in folder)
   * Note: Supabase REST API doesn't have "delete folder", 
   * we must list files then delete them.
   */
  static async deleteFolder(folderPath: string): Promise<void> {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    // List files in folder
    const listUrl = `${SUPABASE_URL}/storage/v1/object/list/${this.bucket}`;
    const listResponse = await fetch(listUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prefix: folderPath,
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    });

    if (!listResponse.ok) return;

    const files = await listResponse.json();
    if (!Array.isArray(files) || files.length === 0) return;

    // Delete files in batch
    const deleteUrl = `${SUPABASE_URL}/storage/v1/object/${this.bucket}`;
    await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prefixes: files.map(f => `${folderPath}/${f.name}`)
      })
    });
  }
}
