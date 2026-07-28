# FocusBoard

A 2-week bridge portfolio project: a personal task manager built with modern frontend tooling to prepare for **OpsBoard** and junior fullstack roles.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **TanStack Query** — server state & mutations
- **Prisma** + **PostgreSQL** (Neon recommended)
- **Zod** + **React Hook Form** — validated forms
- **shadcn/ui** + **Tailwind CSS v4**
- **Vitest** + **React Testing Library**
- **GitHub Actions** CI

## Features (MVP scaffold)

- Task list with search, status/project filters, and sorting
- Create / edit / delete tasks (dialog form)
- Projects support (API ready; seed included)
- Dashboard with open, overdue, and weekly completed stats
- Loading skeletons, error retry states, toast notifications

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Database

Create a free Postgres database on [Neon](https://neon.tech), then copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in `.env`.

### 3. Migrate & seed

```bash
npm run db:migrate
npm run db:seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run Vitest tests |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed sample projects & tasks |
| `npm run db:generate` | Regenerate Prisma client |

## Project structure

```
src/
├── app/
│   ├── (dashboard)/     # Tasks + dashboard pages
│   └── api/             # REST route handlers
├── components/
│   ├── dashboard/
│   ├── layout/
│   ├── tasks/
│   └── ui/              # shadcn components
├── hooks/               # TanStack Query hooks
├── lib/                 # api client, validators, prisma
└── providers/
```

## Roadmap (2-week plan)

- [x] Project scaffold & stack setup
- [x] Prisma schema (Project, Task)
- [x] API routes + Query hooks
- [x] Task list, filters, form dialog
- [x] Dashboard stats
- [x] Vitest + CI
- [ ] Debounced search
- [ ] Project management UI
- [ ] Optimistic updates
- [ ] Deploy to Vercel + Neon

## Related projects

- **[filmlog](https://github.com/onurrbl/mern-stack-letterboxd-clone-app)** — MERN Letterboxd clone (previous portfolio app)
- **OpsBoard** — team dashboard with roles (planned after frontend training program)

## Author

Built by [onurrbl](https://github.com/onurrbl).
