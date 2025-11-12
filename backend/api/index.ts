// Register path aliases for Vercel serverless functions
// Don't use module-alias/register as it tries to find package.json
// Instead, manually configure module-alias
const path = require('path');
const moduleAlias = require('module-alias');

// In CommonJS (compiled TypeScript), __dirname is automatically available
// Resolve src directory relative to this file's location
// In Vercel: /var/task/backend/api/index.js -> /var/task/backend/src/
const srcPath = path.resolve(__dirname, '../src');

// Manually configure module-alias with absolute path
// This must happen before any imports that use @/ aliases
moduleAlias.addAliases({
  '@': srcPath,
});

// Import server after aliases are configured
// Using require() to ensure CommonJS module resolution works correctly
const server = require('../src/server').default;

module.exports = server;

