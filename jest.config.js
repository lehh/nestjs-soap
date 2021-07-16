module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts'
  ],
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/{dist,lib,coverage,node_modules}/**',
    '!*.config.{ts,js}',
    '!*.d.ts',
    '!.eslintrc.js',
    '!**/src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'gql'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules'],
  transformIgnorePatterns: [],
  modulePathIgnorePatterns: ['bin', 'dist', 'lib'],
  globals: {},
};
