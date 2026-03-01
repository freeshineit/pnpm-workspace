export default {
  preset: 'ts-jest',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: ['packages/*/src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/main.ts', '!packages/*/src/**/*.d.ts', '!packages/*/src/main.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss|less)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle static assets
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
