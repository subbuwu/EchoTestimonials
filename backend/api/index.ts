// Register path aliases for Vercel serverless functions
// Use require() to ensure this runs synchronously before any imports
require('module-alias/register');

const path = require('path');
const moduleAlias = require('module-alias');

// In CommonJS (compiled TypeScript), __dirname is automatically available
// Resolve src directory relative to this file's location
// File structure: api/index.js (compiled) -> src/ is one level up
const srcPath = path.resolve(__dirname, '../src');

// Configure module-alias with absolute path
// This must happen before any imports that use @/ aliases
moduleAlias.addAliases({
  '@': srcPath,
});

// Import server after aliases are configured
// Using require() to ensure CommonJS module resolution works correctly
const server = require('../src/server').default;

module.exports = server;

