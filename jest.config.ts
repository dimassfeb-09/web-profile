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
    '^.+\\.(t|j)sx?$': ['ts-jest', { useESM: false }],
  },
  // Only transform @tiptap/* packages and ESM packages like lowlight
  transformIgnorePatterns: [
    '/node_modules/(?!(@tiptap/|lowlight/|devlop/|fault/|dequal/))',
  ],
};

export default config;