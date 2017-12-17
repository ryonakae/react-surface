module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.tsx?$': '<rootDir>/tsPreprocessor.js',
  },
  testMatch: [
    '**/*.test.(ts|tsx)'
  ]
};
