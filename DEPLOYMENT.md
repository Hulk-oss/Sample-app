# Deployment

## Full-stack Vercel deployment

The repository contains both sides of the SaaS:

    Vercel
    ├── Vite frontend
    └── /api/[...path].js -> Express + MongoDB

The Express app is separated into:

- server/app.js: reusable Express application
- server/index.js: local development server
- api/[...path].js: Vercel serverless entrypoint

## Required Vercel environment variables

    MONGODB_URI=your-mongodb-atlas-connection-string
    JWT_SECRET=long-random-production-secret
    JWT_EXPIRES_IN=7d
    CLIENT_ORIGIN=https://your-production-domain.vercel.app
    PLATFORM_OWNER_EMAIL=your-owner-account@example.com

Do not commit .env.

## Local full stack

    npm install
    npm run dev:full

Frontend: http://localhost:5173

API: http://localhost:5000

Vite proxies /api to the local Express server.

## Production

    npm install
    npm run build

Vercel uses vercel.json, builds the frontend into dist, and exposes the API catch-all function under /api/*.

## Security checklist

- Use a long random JWT_SECRET.
- Use MongoDB Atlas with restricted network access.
- Keep MONGODB_URI and JWT secrets out of client code.
- Keep company admin and user routes role-protected.
- Keep financial queries scoped to userId.
- Keep company queries scoped to companyId.
- Use HTTPS in production.
- Review rate limits and authentication logs before public launch.


## Plan enforcement

Individual accounts use `free` or `pro`. Organization workspaces use `starter`, `growth`, or `scale`.

Plan entitlements are enforced in server middleware; hiding navigation items in the frontend is only the presentation layer.

Set `PLATFORM_OWNER_EMAIL` to the trusted product-owner account email. That account can access the protected product administration console and its access to customer records is written to the admin audit trail.
