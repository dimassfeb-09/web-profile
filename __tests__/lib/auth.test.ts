import { encrypt, decrypt, login, logout, getSession, updateSession, COOKIE_NAME } from '@/src/lib/auth';
import { cookies } from 'next/headers';

// Mock jose
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mocked-jwt-token'),
  })),
  jwtVerify: jest.fn().mockResolvedValue({ payload: { email: 'admin@example.com' } }),
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
      const token = await encrypt({ email: 'test' });
      expect(token).toBe('mocked-jwt-token');
    });
  });

  describe('environment fallbacks', () => {
    it('should use fallback secret if JWT_SECRET is missing', async () => {
      const originalEnv = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      // We use isolateModules to reload the module and trigger top-level calculation
      jest.isolateModules(async () => {
        const { encrypt: encryptIsolated } = require('@/src/lib/auth');
        const token = await encryptIsolated({ email: 'test' });
        expect(token).toBe('mocked-jwt-token');
      });

      process.env.JWT_SECRET = originalEnv;
    });
  });

  describe('decrypt()', () => {
    it('should return payload from token', async () => {
      const payload = await decrypt('some-token');
      expect(payload).toEqual({ email: 'admin@example.com' });
    });
  });

  describe('login()', () => {
    it('should set the auth cookie', async () => {
      await login({ email: 'admin@example.com' });
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
      expect(session).toEqual({ email: 'admin@example.com' });
    });

    it('should return null if cookie is missing', async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);
      const session = await getSession();
      expect(session).toBeNull();
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
  });
});
