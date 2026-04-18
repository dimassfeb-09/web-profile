import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/helpers/setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/repositories/**/*.ts',
    'src/services/**/*.ts',
    'src/lib/**/*.ts',
    '!src/lib/db.ts',
  ],
};

export default config;
