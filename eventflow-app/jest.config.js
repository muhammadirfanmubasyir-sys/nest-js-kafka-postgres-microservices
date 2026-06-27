module.exports = {
  // Tells Jest to use ts-jest preset to compile TypeScript files
  preset: 'ts-jest',
  
  // Specifies that tests run in a Node.js server environment
  testEnvironment: 'node',
  
  // Look for TypeScript, JavaScript, and JSON source files
  moduleFileExtensions: ['js', 'json', 'ts'],
  
  // The root directory where Jest should look for files
  rootDir: 'src',
  
  // Regex pattern matching test files ending in .spec.ts or .test.ts
  testRegex: '.*\\.spec\\.ts$',
  
  // Transforms TypeScript files using ts-jest compiler options
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  
  // Defines where code coverage report files are exported
  coverageDirectory: '../coverage',
  
  // Array of glob patterns indicating which files to include in coverage reports
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.(t|j)s',      // Ignore NestJS modules
    '!main.(t|j)s',             // Ignore application entry point
    '!**/*.interface.(t|j)s',   // Ignore TypeScript interfaces
    '!**/node_modules/**',
  ],
};