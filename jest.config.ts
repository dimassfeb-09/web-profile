import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Point to the CJS build so Jest doesn't hit the ESM entry
    '^@tiptap/html/server$': '<rootDir>/node_modules/@tiptap/html/dist/server/index.cjs',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/helpers/setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/repositories/**/*.ts',
    'src/services/**/*.ts',
    'src/lib/**/*.ts',
    '!src/lib/db.ts',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: false }],
  },
  // Only transform @tiptap/* packages (NOT happy-dom — it stays mocked)
  transformIgnorePatterns: [
    '/node_modules/(?!@tiptap/)',
  ],
};

export default config;