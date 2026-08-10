# Services layer

Business logic that sits between the API layer (`src/api/`) and components. Components should call services, not `<x>Api.ts` files directly — that indirection is what lets a service later add logic (combining multiple API calls, caching decisions, client-side transforms, validation) without every caller needing to change.

Right now each service is a pass-through to its matching `api/<x>Api.ts` — there's no business logic yet, just the seam for it.

- **`characterService.ts`** — wraps `api/characterApi.ts`.

## Convention

A service function's signature mirrors its API counterpart: an optional `signal?: AbortSignal` last parameter, so callers (a hook in `src/hooks/`, via `useServiceAction`) can still get proper request cancellation through the service.

Services should not be imported by components directly — go through a hook in `src/hooks/` so loading/error/retry/blocking stay automatic. See `src/hooks/README.md`.
