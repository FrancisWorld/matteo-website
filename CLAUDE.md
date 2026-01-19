# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Matteo** is a Minecraft community platform featuring a high-fidelity pixel art aesthetic. The project uses a modern fullstack tech stack with server-side rendering, backend services, and a pixel-perfect UI design system.

## Tech Stack

- **Frontend Framework:** TanStack Start (SSR-enabled React with server-side rendering)
- **Backend Database:** Convex (serverless backend with real-time subscriptions)
- **Authentication:** Better Auth with email/password and GitHub OAuth
- **UI Framework:** React 19 with Tailwind CSS v4 and shadcn/ui components
- **Animation:** Motion library with Tailwind CSS animations and Lenis smooth scrolling
- **Styling:** Pixel-perfect design with custom Tailwind configuration and CSS
- **Routing:** TanStack Router with file-based routing
- **Data Fetching:** TanStack React Query with Convex integration
- **Build Tool:** Vite with SSR support

## Commands

### Development
- `pnpm dev` - Start frontend dev server on port 3000
- `npx convex dev` - Start Convex backend (run in parallel with dev server)
- `pnpm test` - Run tests with Vitest
- `pnpm format` - Format code with Biome
- `pnpm lint` - Lint code with Biome
- `pnpm check` - Run Biome checks

### Production
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Architecture Overview

### Frontend Structure (`src/`)

- **`routes/`** - File-based routing with TanStack Router. Each `.tsx` file becomes a route. Generated route tree in `routeTree.gen.ts` (auto-generated).
- **`components/`** - React components, organized by feature or design system:
  - `pixel/` - Minecraft pixel art design system components (PixelButton, PixelCard, PixelLayout, AnimatedText, PageWrapper)
  - `ui/` - shadcn/ui components (carousel, form controls, icons)
- **`lib/`** - Core utilities and configuration:
  - `auth.ts` - Better Auth server configuration with roles (admin, moderator, creator, user) and email OTP
  - `auth-client.ts` - Client-side auth with Better Auth plugins
  - `convex-adapter.ts` - Adapter bridging Better Auth with Convex database
  - `permissions.ts` - RBAC permission definitions using `@casl/ability`
  - `auth-query.ts` - Auth-related React Query hooks
  - `convex-server.ts` - Server-side Convex utilities
- **`integrations/`** - Third-party integrations:
  - `convex/provider.tsx` - Convex provider setup with react-query integration
  - `tanstack-query/` - React Query configuration and devtools
- **`hooks/`** - Custom React hooks (useAuthGuard, etc.)
- **`data/`** - Static data or mock data
- **`router.tsx`** - Router instance creation with SSR query setup
- **`__root.tsx`** - Root layout with providers, Lenis (smooth scrolling), and devtools

### Backend Structure (`convex/`)

Convex is a serverless backend. Key files:

- **`schema.ts`** - Database schema definition with tables:
  - `users` - Better Auth user table (with role, ban status)
  - `sessions`, `accounts`, `verifications` - Better Auth auth tables
  - `posts` - Blog posts with slug-based indexing
  - `quizzes`, `quizResults` - Quiz functionality with scoring and share tokens
  - `videos` - YouTube video metadata (synced from YouTube API)
  - `todos`, `products` - Demo tables (can be removed)

- **`auth.ts`** - Better Auth server configuration (mirrors `src/lib/auth.ts`)
- **`admin.ts`** - Admin-related queries/mutations
- **`users.ts`** - User management queries/mutations
- **`posts.ts`** - Blog post queries/mutations
- **`quizzes.ts`** - Quiz queries/mutations
- **`videos.ts`** - Video queries/mutations and YouTube API sync
- **`youtube.ts`** - YouTube API integration (fetch metadata)
- **`crons.ts`** - Scheduled tasks (e.g., video sync)
- **`_generated/`** - Auto-generated Convex API types (never edit manually)

### Design System (Pixel Art Aesthetic)

The project implements a **Minecraft Web Design System** with:

- **Fonts:** "Press Start 2P" (headings), "VT323" (body) for blocky pixel look
- **Pixel Components:** PixelButton, PixelCard, PixelLayout use `border-pixel` utility and `steps()` animations
- **Colors:** Minecraft-inspired palette (green, dirt brown, stone, obsidian)
- **Animations:** CSS `steps()` function for pixel-perfect movement
- **Borders:** Hard edges using Tailwind border utilities
- **Responsive:** Mobile-first design with pixel-based spacing

## Key Patterns & Decisions

### Authentication Flow

1. Better Auth handles session management and social login
2. Convex adapter stores auth data in Convex
3. Email OTP sends verification codes via Nodemailer (SMTP)
4. Roles (admin, moderator, creator, user) determine permissions
5. `useSession` hook from auth-client checks logged-in status on client

### Data Fetching

- Use `useSuspenseQuery` from `@convex-dev/react-query` for server-side rendering
- Queries auto-update on data changes (Convex real-time)
- TanStack Query handles caching and synchronization

### Styling

- Tailwind CSS v4 with custom config
- Pixel components use the `px-pixel` class for consistent borders
- Motion library for spring animations
- CSS custom properties for theme colors

### Routing

- File-based routing: `/src/routes/index.tsx` → `/`
- Nested routes: `/src/routes/blog/$slug.tsx` → `/blog/:slug`
- Dynamic segments use `$` prefix
- `useParams` and `useSearch` for accessing route params/query strings

### Better Auth with Convex Adapter

- Custom adapter in `src/lib/convex-adapter.ts` maps Better Auth tables to Convex
- User IDs from Better Auth are stored, not Convex `_id`
- Indices on `by_auth_id` for lookups by Better Auth ID
- Email verification required before full access

## Common Development Tasks

### Adding a New Page

1. Create a new file in `src/routes/` (e.g., `src/routes/new-page.tsx`)
2. Export a route component with `export const Route = ...`
3. Use `createFileRoute` from TanStack Router
4. Route will auto-generate in `routeTree.gen.ts`

### Adding a New API Endpoint (Convex Function)

1. Create a function in `convex/` directory (e.g., `convex/myFunction.ts`)
2. Export using `export const myFunction = mutation(...)` or `query(...)`
3. Validate inputs with Convex validators (`v.*`)
4. Function auto-generates in `convex/_generated/api.ts`
5. Use in React with `useQuery` or `useMutation` from `@convex-dev/react-query`

### Adding a New shadcn Component

Use the official command:
```bash
pnpm dlx shadcn@latest add <component-name>
```

Components are installed in `src/components/ui/`.

### Working with Convex Schema

- All tables must use `defineTable` with proper type validators
- Add indexes for frequently queried fields (e.g., `by_email`, `by_slug`)
- Use `v.id("tableName")` for foreign keys (references)
- Better Auth integration requires matching fields (see schema comments about "Renamed from by_id")
- Deploy schema changes with `npx convex deploy`

## Environment Variables

Required `.env.local` or configured in deployment:

- `VITE_CONVEX_URL` - Convex deployment URL (starts with `https://`)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email sending (optional, will mock if not set)

## Testing

- Framework: Vitest
- Setup: `vitest.config.ts` (auto-configured by TanStack Start)
- Run single test: `pnpm test -- path/to/test.spec.ts`
- Run with coverage: `pnpm test -- --coverage`

## Important Files Not to Modify

- `src/routeTree.gen.ts` - Auto-generated by TanStack Router
- `convex/_generated/` - Auto-generated by Convex CLI
- These are regenerated when you run `pnpm dev` or `npx convex dev`

## Debugging

### Devtools

- **TanStack Query Devtools** - Bottom-right corner in dev mode, shows queries/mutations
- **TanStack Router Devtools** - Shows routing tree and active routes
- **React DevTools** - Use React DevTools browser extension

### Convex Console

- Run `npx convex dashboard` to open Convex console in browser
- View database, logs, and test functions

### Development Workflow

1. Terminal 1: `npx convex dev` (keeps backend in sync)
2. Terminal 2: `pnpm dev` (frontend server)
3. Changes to `convex/` auto-sync
4. Changes to `src/` hot-reload in browser
5. Check `/routeTree.gen.ts` changes to confirm routing is recognized

## Code Quality Tools

- **Biome** - Formatter and linter (configured in `biome.json`)
- **TypeScript** - Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`
- **Tailwind CSS** - IntelliSense and class detection

## Git Branch

Currently on `feat/ui-polish` branch. Main branch should be used for PRs.

## Additional Notes from .cursorrules

- See `.cursorrules` for Convex-specific schema design patterns
- Use `v()` validators from Convex for all schema fields
- Prefer Convex `v.id()` references for foreign keys instead of string IDs
- When adding shadcn components, use the official CLI command
