# Vercel Deployment Setup

## Files Created/Modified

1. **`vercel.json`** - Vercel configuration for serverless functions
2. **`api/index.ts`** - Serverless function entry point
3. **`src/server.ts`** - Modified to export the Express app instead of calling `app.listen()`
4. **`package.json`** - Moved `tsconfig-paths` to dependencies

## Environment Variables Required

Make sure to set these in Vercel:

- `DATABASE_URL` - Your Neon/PostgreSQL connection string
- `FRONTEND_URL` or `NEXT_PUBLIC_APP_URL` - Your frontend URL for CORS
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SECRET` - Clerk webhook secret (if using webhooks)

## Deployment Steps

1. Push these changes to your repository
2. In Vercel dashboard, ensure the root directory is set to `backend`
3. Set all required environment variables
4. Deploy

## Troubleshooting

If you get path alias errors, Vercel should handle TypeScript compilation automatically. The `tsconfig-paths/register` in `api/index.ts` helps resolve `@/` imports at runtime.

