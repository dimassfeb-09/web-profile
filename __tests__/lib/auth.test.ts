import { encrypt, decrypt, login, logout, getSession, updateSession, requireAuth, COOKIE_NAME } from '@/src/lib/auth';
import { cookies } from 'next/headers';

// Mock jose
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mocked-jwt-token'),
  })),
  jwtVerify: jest.fn().mockResolvedValue({ payload: { id: 'admin-123', email: 'admin@example.com' } }),
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('Auth Library', () => {
  const mockCookieStore = {
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
  });

  describe('encrypt()', () => {
    it('should return a JWT token', async () => {
      const token = await encrypt({ id: '1', email: 'test' });
      expect(token).toBe('mocked-jwt-token');
    });
  });

  describe('environment fallbacks', () => {
    it('should use fallback secret if JWT_SECRET is missing', async () => {
      const originalEnv = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      jest.isolateModules(async () => {
        const { encrypt: encryptIsolated } = require('@/src/lib/auth');
        const token = await encryptIsolated({ id: '1', email: 'test' });
        expect(token).toBe('mocked-jwt-token');
      });

      process.env.JWT_SECRET = originalEnv;
    });

    it('should throw error in production if JWT_SECRET is missing', () => {
      const originalSecret = process.env.JWT_SECRET;
      const originalNodeEnv = process.env.NODE_ENV;
      
      delete process.env.JWT_SECRET;
      (process.env as any).NODE_ENV = 'production';

      jest.isolateModules(() => {
        expect(() => {
          require('@/src/lib/auth');
        }).toThrow('FATAL: JWT_SECRET environment variable is not set.');
      });

      process.env.JWT_SECRET = originalSecret;
      (process.env as any).NODE_ENV = originalNodeEnv;
    });
  });

  describe('decrypt()', () => {
    it('should return payload from token', async () => {
      const payload = await decrypt('some-token');
      expect(payload).toEqual({ id: 'admin-123', email: 'admin@example.com' });
    });
  });

  describe('login()', () => {
    it('should set the auth cookie', async () => {
      await login({ id: '1', email: 'admin@example.com' });
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        COOKIE_NAME,
        'mocked-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        })
      );
    });
  });

  describe('logout()', () => {
    it('should clear the auth cookie', async () => {
      await logout();
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        COOKIE_NAME,
        '',
        expect.objectContaining({ expires: expect.any(Date) })
      );
    });
  });

  describe('getSession()', () => {
    it('should return decrypted payload if cookie exists', async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: 'valid-token' });
      const session = await getSession();
      expect(session).toEqual({ id: 'admin-123', email: 'admin@example.com' });
    });

    it('should return null if cookie is missing', async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);
      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return null if decryption fails', async () => {
      const { jwtVerify } = require('jose');
      jwtVerify.mockRejectedValueOnce(new Error('Invalid token'));
      mockCookieStore.get.mockReturnValueOnce({ value: 'invalid-token' });
      
      const session = await getSession();
      expect(session).toBeNull();
    });
  });

  describe('requireAuth()', () => {
    it('should return session if authenticated', async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: 'valid-token' });
      const session = await requireAuth();
      expect(session).toEqual({ id: 'admin-123', email: 'admin@example.com' });
    });

    it('should throw UNAUTHORIZED if not authenticated', async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);
      await expect(requireAuth()).rejects.toThrow('UNAUTHORIZED');
    });
  });

  describe('updateSession()', () => {
    it('should refresh session if it exists', async () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'valid-token' }),
        },
      } as any;

      const response = await updateSession(mockRequest);
      
      expect(response).toBeDefined();
      expect(mockRequest.cookies.get).toHaveBeenCalledWith(COOKIE_NAME);
    });

    it('should return undefined if session is missing', async () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      } as any;

      const response = await updateSession(mockRequest);
      expect(response).toBeUndefined();
    });

    it('should return undefined if decryption fails', async () => {
      const { jwtVerify } = require('jose');
      jwtVerify.mockRejectedValueOnce(new Error('Invalid token'));
      
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
        },
      } as any;

      const response = await updateSession(mockRequest);
      expect(response).toBeUndefined();
    });
  });
});
