# The Bialto by Asemont Estate

A premium luxury homestay website with full admin panel for The Bialto estate in Kasauli, Himachal Pradesh.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, serves at /api)
- `pnpm --filter @workspace/bialto run dev` — run the frontend (port 21406, serves at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Admin Access

- URL: `/admin/login`
- Email: `admin@bialto.com`
- Password: `admin123`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, Framer Motion, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Auth: JWT (jsonwebtoken), stored in localStorage as `bialto_admin_token`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB schema (floors, rooms, bookings, attractions, reviews, gallery, amenities, settings, admin)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/middlewares/auth.ts` — JWT auth middleware
- `artifacts/bialto/src/` — React frontend (pages + components)
- `lib/api-client-react/src/generated/` — Generated React Query hooks

## Architecture decisions

- Dark-first design with navy/gold luxury palette; no light mode toggle needed
- Admin auth via JWT Bearer tokens stored in localStorage; `useGetAdminMe` determines session state
- All DB schema changes go through Drizzle (`pnpm --filter @workspace/db run push`)
- OpenAPI contract-first: add endpoints to `openapi.yaml`, run codegen, then implement
- Settings table uses singleton pattern (first row is always the site settings)

## Product

Public website: Hero slider, About page, Floors & Rooms browsing, Amenities, Gallery (masonry + lightbox), Nearby Attractions, Guest Reviews with submission, Contact/Enquiry form, Booking form with room selection.

Admin panel: Dashboard with stats, Room CRUD, Floor management, Booking management with status workflow, Attraction management, Review moderation (approve/reject), Gallery management, Amenities CRUD, Site settings.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- Always run `pnpm --filter @workspace/db run push` after changing schema files
- The `rooms/featured` route must come BEFORE `rooms/:id` in the router (already done)
- Admin password hash uses `sha256(password + "bialto_salt")` — see `middlewares/auth.ts`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
