# TimeTracker

A full-featured time tracking web application built with Next.js 14, Prisma, and TailwindCSS.

## Features

- **Active Timer** — Start/Stop tracking with task name autocomplete and project selection. The running timer is always visible at the top of the page.
- **Task Management** — Today's entries grouped by project with total time per project. Edit task name, project, and manually adjust time (hh:mm format). Delete entries.
- **Project Management** — Dedicated page to add and edit projects with custom color assignment for visual identification.
- **Reports** — View time reports filtered by day, week, or month. Export any report to CSV.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React |
| Styling | TailwindCSS, shadcn/ui |
| State / Data fetching | SWR |
| Backend | Next.js API Routes |
| ORM | Prisma 5 |
| Database | SQLite (via `dev.db`) |

## Architecture

```
/app
  /api
    /entries        — CRUD + active entry + task-name autocomplete
    /projects       — CRUD
  /projects         — Projects page
  /reports          — Reports page
  page.tsx          — Main timer page

/components
  /timer            — ActiveTimer, TimeEntryList, TimeEntryItem
  /projects         — ProjectList, ProjectCard, ProjectForm, ColorPicker
  /reports          — ReportView, ReportFilters, ReportSummary, ReportTable, ReportChart
  /layout           — Navigation

/hooks
  useTimer.ts       — Start/stop logic, elapsed time
  useEntries.ts     — Fetch, group, edit, delete time entries
  useProjects.ts    — Fetch, add, edit, delete projects

/lib
  /api              — Fetch functions (client layer)
  /db               — Prisma client singleton
  /utils            — CSV export, time formatting helpers
  types.ts          — Shared TypeScript types

/prisma
  schema.prisma     — Database schema (Project, TimeEntry)
```

### Domain Entities

- **Project** — `id`, `name`, `color`
- **TimeEntry** — `id`, `taskName`, `projectId`, `startTime`, `endTime`, `duration`
- **TaskName** — derived from existing TimeEntry records for autocomplete

## Local Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
npx prisma generate
npx prisma db push

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

The `.env` file is included with the default SQLite path:

```
DATABASE_URL="file:./dev.db"
```

No additional configuration is needed for local development.

## Deployment

The app can be deployed to any platform that supports Next.js (Vercel, Netlify, Railway, etc.).

For Vercel deployment with a persistent database, replace SQLite with a managed PostgreSQL instance (e.g., Supabase or Neon) and update `DATABASE_URL` accordingly.
