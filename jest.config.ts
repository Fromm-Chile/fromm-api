// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Change from 'jsdom' to 'node' for NestJS
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Add module name mapping for prisma folder
  moduleNameMapper: {
    '^prisma/(.*)$': '<rootDir>/prisma/$1',
    '^config/(.*)$': '<rootDir>/config/$1', // Map config/* to config folder
    '^src/(.*)$': '<rootDir>/src/$1', // Map src/* to src folder
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Add roots to include both src and prisma
  roots: ['<rootDir>/src', '<rootDir>/prisma'],

  // Update module directories
  moduleDirectories: ['node_modules', '<rootDir>/src', '<rootDir>/prisma'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  testMatch: ['<rootDir>/src/**/*.{spec,test}.{ts,tsx}'],
  collectCoverage: false, // Explicitly disable coverage by default
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text'], // Only show text output when coverage is enabled
};

export default config;
