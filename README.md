# Edudash Admin (Next.js)

Static HTML template migrated to **Next.js 15 (App Router)** + **TypeScript**. Original styles and scripts load from `public/assets` (synced from `assets/` on `predev` / `prebuild`).

## Commands

| Command | Description |
|--------|-------------|
| `npm run dev` | Development server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run convert` | Regenerate `src/app/**` and shared components from root `*.html` (after editing HTML) |
| `npm run sync-assets` | Copy `assets/` → `public/assets/` only |

## Structure

- `src/app/layout.tsx` — global CSS links + `LegacyScripts`
- `src/app/(dashboard)/layout.tsx` — theme, sidebar, navbar, footer shell
- `src/app/(dashboard)/page.tsx` — home (`/`)
- `src/app/(dashboard)/<name>/page.tsx` — other dashboard routes (e.g. `/student-list`)
- `src/app/login`, `src/app/register` — auth pages (no dashboard shell)
- `scripts/convert-html.mjs` — HTML → TSX generator

Original `.html` files are kept in the repo as reference.
