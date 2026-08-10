# API layer

Infrastructure for talking to `LASWCD.WebApi`. This layer doesn't know about business rules, React, or "how should this be presented" — it's transport and per-endpoint request wrappers only. No caching lives here, or anywhere in this app — see `src/hooks/README.md` for why.

- **`client.ts`** — transport. `apiGet<T>(path, signal?)` wraps `fetch`, resolves relative to `VITE_API_BASE_URL` (empty in dev, since the Vite dev server proxies `/api` to the backend — see `vite.config.ts`), and throws `ApiError` on a non-OK response.
- **`characterApi.ts`**, and future `<x>Api.ts` files — one per resource, each a thin wrapper turning a REST call into a typed function, e.g. `searchCharacters(name?, signal?)`. Nothing but request-shaping lives here.
- **`types.ts`** — response shapes.

Nothing here should be imported by a component, a page, or a hook that isn't `src/hooks/`. Components call hooks in `src/hooks/`, which call `src/services/`, which call the `<x>Api.ts` files here — see `src/hooks/README.md` and `src/services/README.md`. Retry, timeout/cancellation, the loading spinner, and error reporting are all handled in `src/hooks/`, not here.

## Adding a new resource

1. Add the response type (`types.ts`, or co-located if only used in one place).
2. Add `<resource>Api.ts` here — a typed wrapper around `apiGet`/`apiPost`/etc.
3. Add a service in `src/services/` that calls it (see `src/services/README.md`).
4. Add a hook in `src/hooks/` (see `src/hooks/README.md`).
5. Call the hook from the component that needs the data. Loading/error/retry/cancellation are automatic — the component only needs to render based on `data`.
