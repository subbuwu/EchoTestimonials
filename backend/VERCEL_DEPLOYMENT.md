# Vercel Deployment Setup

## Files Created/Modified

1. **`vercel.json`** - Vercel configuration for serverless functions
2. **`api/index.ts`** - Serverless function entry point that sets up path aliases
3. **`src/server.ts`** - Modified to export the Express app instead of calling `app.listen()`
4. **`package.json`** - Added `module-alias` to dependencies and `_moduleAliases` configuration
5. **`public/.gitkeep`** - Empty public directory required by Vercel
6. **`tsconfig.json`** - Updated to include `api` directory

## Environment Variables Required

Make sure to set these in Vercel:

- `DATABASE_URL` - Your Neon/PostgreSQL connection string
- `FRONTEND_URL` or `NEXT_PUBLIC_APP_URL` - Your frontend URL for CORS
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret (if using webhooks)

## Deployment Steps

1. Commit and push all changes including the updated `pnpm-lock.yaml`
2. In Vercel dashboard, ensure the root directory is set to `backend`
3. Set all required environment variables
4. Deploy

## How Path Aliases Work

The `module-alias` package reads the `_moduleAliases` configuration from `package.json` to resolve `@/` imports at runtime. This is necessary because TypeScript path aliases don't work in the compiled JavaScript runtime.

## Troubleshooting

- **"Missing public directory"**: The `public/.gitkeep` file should resolve this
- **Path alias errors**: The `module-alias/register` import in `api/index.ts` handles this
- **Function crashes**: Check Vercel function logs for specific error messages

