module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': '<rootDir>/tsPreprocessor.js',
  },
  moduleNameMapper: {
    'yoga-layout': 'yoga-layout/sources/entry-browser'
  },
  setupFiles: [
    '<rootDir>/jestPolyfill.ts'
  ],
  testMatch: [
    '**/*.test.(ts|tsx)'
  ]
};
