// Global setup for all tests
import { jest } from '@jest/globals';

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock environment variables if needed
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
Object.assign(process.env, { NODE_ENV: 'test' });
process.env.JWT_SECRET = 'test-secret';
