# Prompts Log — TimeTracker Project

All prompts sent to AI tools during development of the TimeTracker web application.

---

## Tool: Bolt.new

### Prompt 1 — Initial project generation

```
Create a Time Tracker web app using Next.js 14 (App Router),
Prisma with SQLite, TailwindCSS.

Entities:
- Project (id, name, color)
- TimeEntry (id, taskName, projectId, startTime, endTime, duration)

Features:
1. Active timer at the top: task name input with autocomplete,
   project dropdown, Start/Stop buttons
2. Today's entries list: edit task/project, manual time adjustment
   (hh:mm format), delete. Grouped by project with total time.
3. Projects page: add/edit projects with color picker
4. Reports page: filter by day/week/month, export CSV

Architecture:
- /components — UI only
- /hooks — useTimer, useProjects, useEntries
- /lib/api — fetch functions
- /lib/db — Prisma client
- /app/api — API routes

No everything-in-one-file. Clean separation of concerns.
```

**Result:** Full project scaffold generated with all pages, components, hooks, API routes, and Prisma schema.

---

## Tool: Claude (claude.ai)

### Prompt 2 — Fix Prisma version conflict

```
npx prisma generate fails with error: "The datasource property url is no longer
supported in schema files." How to fix this for Prisma 5 + SQLite?
```

**Result:** Downgraded to Prisma 5, restored original schema.prisma with url = env("DATABASE_URL"), removed prisma.config.ts.

---

### Prompt 3 — Fix live timer in entry list

```
The time shown on the active entry in TimeEntryList does not update in real time —
it only updates after switching windows. Fix TimeEntryItem to show a live
ticking duration for the active (running) entry.
```

**Result:** Added `useEffect` with `setInterval` in `TimeEntryItem` that computes elapsed seconds from `entry.startTime` every second when `isActive` is true.

---

### Prompt 4 — Fix entry not appearing immediately after Start

```
When I click Start, the new entry does not appear in Today's Entries list
until I switch away and come back to the window. Fix so the entry appears
immediately after starting the timer.
```

**Result:** Added `refreshInterval: 2000` to `useEntries` SWR hook so the list polls the API every 2 seconds and picks up new entries immediately.
