# LASWCD.FrontEnd

React SPA for the LA SWCD project, built with Vite + TypeScript. Calls into `LASWCD.WebApi`.

## Prerequisites

- [Node.js 24 LTS](https://nodejs.org/) (or later)

## Setup

From this directory, install dependencies:

```
npm install
```

## Running

Start the dev server:

```
npm run dev
```

The app runs at `http://localhost:5173` (Vite will pick the next free port if that one's taken). The dev server proxies `/api` requests to the backend at `http://localhost:5240`, so for API calls to work, also start `LASWCD.WebApi` (see `API/src/LASWCD.WebApi/README.md`) — the two run side by side, no CORS setup needed.

## Project structure

```
src/
  api/         # HTTP client, TanStack Query client
  components/  # shared UI (e.g. ErrorBoundary)
  pages/       # route-level pages
  App.tsx      # route definitions
  main.tsx     # app entry point, provider composition
tests/         # mirrors src/, one test file per unit under test
```

## Tests

```
npm run test        # run once
npm run test:watch  # watch mode
```

Uses Vitest + React Testing Library + `@testing-library/user-event`.

## Linting

```
npm run lint
```

## Building for production

```
npm run build
```

Output goes to `dist/`. Set `VITE_API_BASE_URL` (see `.env.example`) if the built app won't be served behind a proxy that forwards `/api` to the backend.
