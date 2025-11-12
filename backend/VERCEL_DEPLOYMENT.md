# Vercel Deployment Setup

## Files Created/Modified

1. **`vercel.json`** - Vercel configuration for serverless functions
2. **`api/index.ts`** - Serverless function entry point that sets up path aliases
3. **`src/server.ts`** - Modified to export the Express app instead of calling `app.listen()`
4. **`package.json`** - Added `module-alias` to dependencies and `_moduleAliases` configuration
5. **`public/.gitkeep`** - Empty public directory required by Vercel
6. **`tsconfig.json`** - Excludes `api` directory (Vercel compiles it separately)

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
- **TypeScript rootDir errors**: The `api` directory is excluded from TypeScript compilation since Vercel compiles it separately

## Vercel Dashboard Settings

In your Vercel project settings (Build and Deployment section):

1. **Framework Preset**: Change from "Express" to **"Other"** (or leave as "Express" if it works)
2. **Build Command**: Keep as **"None"** with Override **disabled** (Vercel compiles serverless functions automatically)
3. **Output Directory**: Keep as **"N/A"** with Override **disabled** (not needed for serverless functions)
4. **Install Command**: Leave as default (will auto-detect `pnpm install`)
5. **Root Directory**: Set to **`backend`** ✓ (you already have this correct)
6. **"Include files outside the root directory in the Build Step"**: Keep **Enabled** ✓ (helps include necessary files)

**Important**: After making any changes, click the **"Save"** button at the bottom of each section.

