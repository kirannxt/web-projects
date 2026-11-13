# Project Showcase — Complete Setup Guide

A full-stack Next.js project showcase website with admin panel, dynamic navigation, page builder, media uploads, and theme customization.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Local Development](#local-development)
4. [Environment Variables](#environment-variables)
5. [Database Setup (Neon)](#database-setup-neon)
6. [Media Uploads (Vercel Blob)](#media-uploads-vercel-blob)
7. [Production Deployment (Vercel)](#production-deployment-vercel)
8. [Admin Panel](#admin-panel)
9. [Features Overview](#features-overview)
10. [Theme System](#theme-system)
11. [Page Builder Sections](#page-builder-sections)
12. [Known Issues & Notes](#known-issues--notes)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.4.6 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.3.3 |
| Auth | NextAuth.js | v5 beta |
| ORM | Prisma | 5.22.0 |
| Database | PostgreSQL via Neon | — |
| Media Storage | Vercel Blob | — |
| Password Hashing | bcryptjs | 2.4.3 |
| Hosting | Vercel | — |

---

## Project Structure

```
web-projects/
├── .github/
│   └── workflows/
│       └── nextjs.yml          # CI build check on push/PR
├── .gitignore
├── .neon                       # Neon project link config
├── neon.ts                     # Neon branch config
└── showcase/                   # The Next.js application
    ├── app/
    │   ├── (public)/           # Public-facing routes
    │   │   ├── layout.tsx      # Navbar + Footer wrapper
    │   │   ├── page.tsx        # Homepage
    │   │   └── pages/[slug]/   # Dynamic page viewer
    │   ├── admin/
    │   │   ├── layout.tsx      # Auth guard wrapper
    │   │   ├── login/          # Login page (no sidebar)
    │   │   └── (dashboard)/    # Protected admin routes
    │   │       ├── layout.tsx  # Sidebar layout
    │   │       ├── page.tsx    # Dashboard
    │   │       ├── homepage/   # Homepage content editor
    │   │       ├── pages/      # Page manager + builder
    │   │       ├── projects/   # Project manager
    │   │       ├── media/      # Media library
    │   │       └── theme/      # Theme settings
    │   ├── api/
    │   │   ├── auth/           # NextAuth handlers
    │   │   ├── pages/          # Pages CRUD API
    │   │   ├── projects/       # Projects CRUD API
    │   │   ├── media/          # Media upload/delete API
    │   │   └── settings/       # Site settings API
    │   ├── layout.tsx          # Root layout (ThemeProvider)
    │   └── globals.css         # Tailwind + CSS variables
    ├── components/
    │   ├── AdminSidebar.tsx    # Admin navigation sidebar
    │   ├── DeleteButton.tsx    # Confirm-before-delete button
    │   ├── Footer.tsx          # Public footer
    │   ├── MarkdownContent.tsx # Markdown renderer (no deps)
    │   ├── MediaPicker.tsx     # Media picker modal
    │   ├── Navbar.tsx          # Public navbar with dropdowns
    │   ├── PageForm.tsx        # Page create/edit form
    │   ├── ProjectCard.tsx     # Project card component
    │   ├── ProjectForm.tsx     # Project create/edit form
    │   ├── SectionEditor.tsx   # Page builder section editor
    │   ├── SectionRenderer.tsx # Renders sections on public pages
    │   ├── ThemeProvider.tsx   # Theme context + localStorage
    │   └── ThemeSwitcher.tsx   # Visitor theme toggle UI
    ├── lib/
    │   ├── prisma.ts           # Prisma client singleton
    │   └── theme.ts            # Theme types and constants
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   ├── seed.ts             # Seed admin user + sample data
    │   └── migrations/         # Migration history
    ├── types/
    │   ├── index.ts            # Page, Project, NavItem types
    │   └── sections.ts         # Section block types
    ├── auth.ts                 # NextAuth configuration
    ├── proxy.ts                # NextAuth middleware (Next.js 16)
    ├── next.config.ts          # Next.js config
    ├── vercel.json             # Vercel build command override
    ├── .npmrc                  # legacy-peer-deps=true
    ├── .env                    # Local env vars (not committed)
    └── package.json
```

---

## Local Development

### Prerequisites

- Node.js 22.x
- npm 10.x
- Access to a PostgreSQL database (Neon free tier recommended)

> **Note:** Port 5432 must be reachable from your machine. If your network
> blocks it (corporate firewall, etc.), use a mobile hotspot or Docker
> for local PostgreSQL. The Vercel production deployment is unaffected.

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/kirannxt/web-projects.git
cd web-projects/showcase

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Create your .env file
cp .env.example .env
# Then fill in the values (see Environment Variables section)

# 4. Run the database migration
npx prisma migrate dev

# 5. Seed the database with sample data
npx prisma db seed

# 6. Start the development server
npm run dev
```

App runs at: **http://localhost:3000**
Admin panel: **http://localhost:3000/admin/login**

---

## Environment Variables

Create a `.env` file in the `showcase/` directory:

```env
# ─── Database (Neon PostgreSQL) ───────────────────────────────
# Pooled URL — used by the app at runtime
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# Direct URL — used by Prisma migrations
DATABASE_URL_UNPOOLED="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# ─── Authentication (NextAuth v5) ─────────────────────────────
# Generate a secret: openssl rand -base64 32
AUTH_SECRET="your-32-character-random-secret-here"
NEXTAUTH_SECRET="your-32-character-random-secret-here"  # same value
NEXTAUTH_URL="http://localhost:3000"  # change to your domain in production

# ─── Media Uploads (Vercel Blob) ──────────────────────────────
# Get this from: Vercel Dashboard → Storage → Blob → your store → .env.local
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"
```

### Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Neon pooled connection string | From Neon Dashboard |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string | From Neon Dashboard |
| `AUTH_SECRET` | 32-char random string | `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Same as AUTH_SECRET | NextAuth v5 compatibility |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel domain |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | From Vercel Storage tab |

> **Important:** Do NOT set `NEXTAUTH_URL` if you have multiple Vercel
> preview deployments — it will break auth on non-production URLs.
> The app uses `trustHost: true` which auto-detects the host.

---

## Database Setup (Neon)

Neon is a free serverless PostgreSQL provider. The free tier includes:
- 0.5 GB storage
- Unlimited databases
- Branching (dev/prod separation)
- **Cost: $0/month**

### Setup Steps

1. Go to [neon.tech](https://neon.tech) and sign up with GitHub
2. Click **New Project** → name it `showcase`
3. Select a region close to your Vercel deployment (default: US East)
4. Once created, go to **Dashboard → Connection Details**
5. Copy both connection strings:
   - **Pooled** (for `DATABASE_URL`) — includes `-pooler` in the hostname
   - **Direct** (for `DATABASE_URL_UNPOOLED`) — no `-pooler` in hostname
6. Add both to your `.env` file and Vercel environment variables

### Database Schema

The app uses 5 Prisma models:

```prisma
User          # Admin users (email + bcrypt password)
Page          # CMS pages with section builder JSON
Project       # Showcase projects with tags/links
SiteSettings  # Key-value store for homepage & theme config
MediaAsset    # Uploaded file metadata (URL stored in Vercel Blob)
```

### Running Migrations

```bash
# Local development
npx prisma migrate dev

# Production (runs automatically via vercel.json build command)
npx prisma migrate deploy

# Seed sample data (run once after first migration)
npx prisma db seed
```

### Seed Data

The seed script creates:
- 1 admin user: `admin@showcase.com` / `admin123`
- 5 sample pages (About Us, Our Team, Web Apps, Mobile Apps, Open Source)
- 4 sample projects (E-Commerce Platform, Task Management App, AI Content Generator, DevOps Dashboard)

> **Change the admin password** after first login in production!

---

## Media Uploads (Vercel Blob)

Vercel Blob is used for storing uploaded images and videos.

**Free tier:** 1GB storage, unlimited bandwidth on Hobby plan.

### Setup Steps

1. In Vercel Dashboard, go to **Storage** tab
2. Click **Create Database** → select **Blob**
3. Name it `showcase-media` → click Create
4. Go to the blob store → **Settings** → copy the `BLOB_READ_WRITE_TOKEN`
5. Add it to your Vercel environment variables as `BLOB_READ_WRITE_TOKEN`
6. For local development, add it to your `.env` file too

### Upload Limits

- Max file size: **50MB** per file
- Allowed types: `image/*`, `video/*`
- Files are stored publicly at `https://xxxx.public.blob.vercel-storage.com/...`

---

## Production Deployment (Vercel)

### First-Time Setup

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import `kirannxt/web-projects`
3. Set **Root Directory** to `showcase`
4. Add all environment variables (see table above)
5. Click **Deploy**

### How Builds Work

The `vercel.json` overrides the build command:

```json
{ "buildCommand": "npm run build:prod" }
```

Which runs:
```
prisma generate → prisma migrate deploy → next build
```

This means every Vercel deployment:
1. Regenerates the Prisma client
2. Applies any pending migrations to the Neon database
3. Builds the Next.js app

### Automatic Deploys

Vercel auto-deploys on every push to `main`. The GitHub Actions workflow
(`.github/workflows/nextjs.yml`) runs a build check on feature branches
and PRs before merge.

### Domain

After deployment, your app is available at:
- Production: `https://your-project.vercel.app`
- Or a custom domain configured in Vercel → Domains

---

## Admin Panel

### Login

URL: `/admin/login`

Default credentials (change after first login!):
- **Email:** `admin@showcase.com`
- **Password:** `admin123`

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with stats and recent activity |
| `/admin/homepage` | Edit homepage hero, stats, section headings |
| `/admin/pages` | List all pages grouped by nav menu |
| `/admin/pages/new` | Create a new page with section builder |
| `/admin/pages/[id]/edit` | Edit an existing page |
| `/admin/projects` | List all showcase projects |
| `/admin/projects/new` | Add a new project |
| `/admin/projects/[id]/edit` | Edit an existing project |
| `/admin/media` | Upload and manage images/videos |
| `/admin/theme` | Set default dark mode and accent color |

### Auth Protection

All `/admin/*` routes (except `/admin/login`) are protected by the
`proxy.ts` middleware using NextAuth v5. Unauthenticated requests are
redirected to `/admin/login`.

---

## Features Overview

### Dynamic Navigation

Pages created in the admin automatically appear in the navbar as dropdown
menus grouped by their `parentMenu` field. For example, pages with
`parentMenu = "Projects"` appear under a "Projects" dropdown.

The navbar fetches pages from `/api/pages` on mount and re-fetches on
route change, so new pages appear without redeployment.

### Homepage Customization

Admins can edit all homepage content from `/admin/homepage`:
- Hero headline, subtitle, CTA button text and URL
- Stats bar: 3 configurable value + label pairs
- Section headings for featured and all projects

Changes are saved to the `SiteSettings` table and reflected immediately.

### Page Section Builder

Pages use a block-based content system instead of a plain textarea.
Each page stores a JSON array of sections in the `sections` field.

See [Page Builder Sections](#page-builder-sections) for details.

### Project Showcase

Projects appear on the homepage. Each project has:
- Title and description
- Optional image URL, demo URL, GitHub repo URL
- Technology tags (displayed as colored badges)
- Featured flag (shows in the highlighted section)
- Display order

---

## Theme System

### How It Works

The theme system uses CSS custom properties for color and class-based dark mode:

```css
/* Accent color — changes globally */
--accent:        hsl(var(--accent-h) var(--accent-s) var(--accent-l))
--accent-light:  lighter tint of accent
--accent-text:   darker shade for text on light backgrounds

/* Dark mode — toggled via .dark class on <html> */
```

### Available Accent Colors

| Name | Hue |
|------|-----|
| Blue (default) | 221° |
| Purple | 263° |
| Green | 142° |
| Orange | 25° |
| Rose | 347° |
| Teal | 172° |

### Visitor Controls

Visitors can change their theme using the switcher icon in the navbar:
- **Mode:** Light / System / Dark
- **Accent:** 6 color swatches

Preferences are saved to `localStorage` under the key `ps-theme`.

### Admin Default

Admins set the site default from `/admin/theme`. These values are stored
in `SiteSettings` as `theme_dark_mode` and `theme_accent` and loaded
server-side in `app/layout.tsx` as the initial theme for all visitors.

Visitors can still override with their own preference.

---

## Page Builder Sections

Each page can have unlimited sections of these types:

### Hero
Full-width banner. Fields:
- Title, Subtitle
- Button Text, Button URL
- Background: Accent Gradient | Image URL | Solid Color

### Text
Markdown content block. Fields:
- Content (Markdown)
- Alignment: Left | Center | Right

### Image
Single image. Fields:
- Image URL (or pick from Media Library)
- Alt text, Caption
- Size: Small | Medium | Full Width

### Video
Video player or embed. Fields:
- URL (direct video file, YouTube embed, or Vimeo embed)
- Title
- Autoplay (muted)

> For YouTube: use `https://www.youtube.com/embed/VIDEO_ID`
> For Vimeo: use `https://player.vimeo.com/video/VIDEO_ID`

### Two Column
Side-by-side Markdown columns. Fields:
- Left Column content (Markdown)
- Right Column content (Markdown)

### Call to Action
Highlighted action block. Fields:
- Title, Subtitle
- Button Text, Button URL

### Divider
Visual separator. Styles:
- Horizontal Line
- Whitespace
- Dots

### Section Controls

- **↑ / ↓** — Reorder sections
- **Collapse** — Hide fields to reduce clutter
- **Delete** — Remove a section (with confirmation)
- **Add Section** — Opens type picker at the bottom

---

## Known Issues & Notes

### Port 5432 Blocked Locally

If your corporate network or firewall blocks outbound port 5432
(PostgreSQL), you cannot connect to Neon from your local machine.

**Workarounds:**
1. Use your phone's mobile hotspot for development
2. Run a local PostgreSQL via Docker:
   ```bash
   docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres
   ```
   Then set `DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres`
3. Push changes to a feature branch and test on Vercel preview deployment

### NextAuth `NEXTAUTH_URL`

If you're deploying to multiple Vercel environments (production +
previews), do NOT set `NEXTAUTH_URL` — it will break auth on non-matching
domains. The app uses `trustHost: true` to auto-detect the host.

### Vercel Blob for Local Dev

`BLOB_READ_WRITE_TOKEN` must be set even for local development to use
media uploads. Get it from your Vercel Blob store settings.

### SQLite vs PostgreSQL

The database provider is PostgreSQL (Neon) in all environments.
SQLite is NOT used even locally — the schema uses PostgreSQL-specific
features. If you want a local database without port restrictions, use
Docker PostgreSQL (see above).

### Next.js 16 + NextAuth v5

Next.js 16 uses `proxy.ts` instead of `middleware.ts` for auth middleware.
The app already uses `proxy.ts`. If you see auth redirect issues:
1. Check `AUTH_SECRET` and `NEXTAUTH_SECRET` are both set in Vercel
2. Ensure `trustHost: true` is in `auth.ts`
3. Delete `NEXTAUTH_URL` from Vercel if you have preview deployments

### Credential Manager Warning

When pushing to GitHub, you may see:
```
git: 'credential-manager-core' is not a git command
```
This is a harmless warning from an outdated Git credential helper.
The push succeeds regardless. Fix it by updating Git for Windows.

---

## Quick Reference

```bash
# Start dev server
npm run dev

# Build (local — no migration)
npm run build

# Build (production — with migration)
npm run build:prod

# Run migrations (local)
npx prisma migrate dev

# Apply migrations (production)
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio (DB browser)
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate

# Push to feature branch
git push origin feature/project-showcase
```

---

## Git Workflow

```
main                    ← production (auto-deploys to Vercel)
└── feature/project-showcase  ← current development branch
```

Create a PR from `feature/project-showcase` → `main` to deploy to production.
GitHub Actions runs a build check on every push.

---

*Last updated: November 2026*
