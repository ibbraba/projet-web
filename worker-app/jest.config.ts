export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './tests/jest.setup.ts',
  //globalTeardown: './tests/teardown.ts', // optional
  setupFiles: [],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)']
};
