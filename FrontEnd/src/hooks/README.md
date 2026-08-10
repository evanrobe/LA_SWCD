# Hooks

Component-facing data hooks — the only thing components/pages should import to get data. One hook per resource, e.g. `useCharacters`.

This folder is deliberately **not** under `src/api/`. A hook here calls into `src/services/`, never into `src/api/<x>Api.ts` directly — living outside `api/` makes that boundary visible in the import path itself, not just in a convention someone has to remember.

```
component  ->  hooks/useThing.ts  ->  services/thingService.ts  ->  api/thingApi.ts  ->  api/client.ts
```

## No caching, on purpose

This app does not use TanStack Query (or any query-caching library). Earlier iterations did — but caching means giving every query an identity (a `queryKey`), and every hook sharing that identity model, whether it wants to or not. Two hooks that accidentally reuse the same key end up sharing one cache entry and can silently serve each other's data. Since we don't need cross-component cache sharing, stale-while-revalidate, or background refetching here, that risk wasn't worth it — `useServiceAction` gets you retry, timeout+cancellation, the global spinner, and centralized error reporting without any key, any cache, or any of that failure mode. If caching is genuinely needed later, it can be reintroduced deliberately (e.g. reintroducing TanStack Query for just the hook(s) that need it), not by default for everything.

- **`performActionWithTimeout.ts`** — the generic core. Runs any async action (`(signal) => Promise<T>`) and aborts it if it doesn't resolve within a timeout (10s default). Not API-specific — it doesn't know what it's running, only that it should be cancelled if it takes too long.
- **`globalBusyStore.ts`** / **`useIsBusy.ts`** — a plain module-level counter (`useSyncExternalStore`, same pattern as `errorReporting/globalErrorStore.ts`) tracking how many actions are currently in flight, app-wide. `GlobalLoadingBoundary` reads it to decide whether to block the UI.
- **`useServiceAction.ts`** — the generic hook every read hook should be built on: `useServiceAction(action, deps, options?)`. `deps` is a plain React dependency list (same idea as `useEffect`'s) that decides when to re-run — no query key, nothing to accidentally collide with another hook. On each run it: increments the busy counter, calls `action` through `performActionWithTimeout`, retries on failure (1 retry, 1s delay, by default), decrements the busy counter when settled, and on final failure reports to `errorReporting/globalErrorStore` (which drives `ErrorDialog`). If the component unmounts or `deps` change mid-flight, the in-flight action is aborted and its result is ignored. There's no `useServiceMutation` yet — add one, built on the same `performActionWithTimeout` core, if/when a write operation is needed.
- **`useCharacters.ts`** — the actual domain hook a component uses. Thin: just binds `characterService.searchCharacters` and its `name` dependency into `useServiceAction`.

```ts
// hooks/useThing.ts
import { useServiceAction } from './useServiceAction'
import { getThing } from '../services/thingService'

export function useThing(id: string) {
  return useServiceAction((signal) => getThing(id, signal), [id])
}
```

A component using `useThing` only ever deals with `data` — it doesn't need to know or check that a fetch is happening, retrying, timing out, or failing. The spinner starts and the error dialog fires from the moment the *service* call begins, not just the underlying HTTP request — `action` above is the service function itself.
