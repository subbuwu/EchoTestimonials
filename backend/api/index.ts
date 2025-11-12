// Register path aliases for Vercel serverless functions
// This must be imported first before any other imports
// module-alias will read the _moduleAliases from package.json
import 'module-alias/register';

// Import the server - path aliases are now active
import server from '../src/server';

export default server;

