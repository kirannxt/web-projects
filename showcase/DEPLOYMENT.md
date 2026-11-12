# Deployment Guide

This app is a dynamic Next.js application with API routes, server-side database queries (Prisma), and authentication (NextAuth). It **cannot** be deployed to GitHub Pages as that only serves static files.

## Recommended Stack (Free)

| Service | Purpose | Cost |
|---------|---------|------|
| [Vercel](https://vercel.com) | Hosting (Next.js) | Free |
| [Neon](https://neon.tech) | PostgreSQL Database | Free |

**Total monthly cost: $0**

---

## Step 1 — Set up Neon (Database)

1. Go to [neon.tech](https://neon.tech) and sign up with GitHub
2. Click **New Project** → give it a name (e.g. `showcase`)
3. Once created, go to **Dashboard → Connection Details**
4. Copy the **connection string** — it looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Keep this for Step 3

---

## Step 2 — Switch Database from SQLite to PostgreSQL

Update `prisma/schema.prisma` — change the datasource block:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your repository: `kirannxt/web-projects`
4. Set **Root Directory** to `showcase`
5. Add the following **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon connection string from Step 1 |
   | `NEXTAUTH_SECRET` | Any random 32-character string |
   | `NEXTAUTH_URL` | Your Vercel URL e.g. `https://your-app.vercel.app` |

6. Click **Deploy**

Your app will be live at `https://your-app.vercel.app`

---

## Admin Login

After deployment, seed the database and log in with:

| Field | Value |
|-------|-------|
| Email | `admin@showcase.com` |
| Password | `admin123` |

> **Important:** Change the admin password after first login in production.

---

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up the database
npx prisma migrate dev
npx prisma db seed

# Start the dev server
npm run dev
```

App runs at `http://localhost:3000`

---

## Why Not GitHub Pages?

GitHub Pages only serves static HTML files. This app requires a Node.js server because it has:

- API routes (`/api/pages`, `/api/projects`, `/api/auth`)
- Server-side database queries via Prisma
- Authentication via NextAuth
- Dynamic page rendering

These features are not compatible with static hosting.
