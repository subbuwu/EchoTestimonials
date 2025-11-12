// Register path aliases for Vercel serverless functions
// CRITICAL: This must be the FIRST thing that runs - no other requires before this
const path = require('path');
const moduleAlias = require('module-alias');

// Get the src directory path
// In Vercel: /var/task/backend/api/index.js -> /var/task/backend/src/
const srcPath = path.resolve(__dirname, '../src');

// Configure module-alias BEFORE any modules that use @/ are loaded
moduleAlias.addAliases({
  '@': srcPath,
});

// Now import the server - module-alias will handle @/ imports in server.js
const server = require('../src/server').default;

module.exports = server;

