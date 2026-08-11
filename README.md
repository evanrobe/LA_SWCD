# LA SWCD — Star Wars Character Datapad

A small full-stack app for browsing Star Wars characters: a React/TypeScript
frontend backed by an ASP.NET Core Web API, which in turn pulls character,
species, and homeworld data from the public [SWAPI](https://swapi.info)
service.

```
FrontEnd/   React + TypeScript SPA (Vite)
API/        ASP.NET Core Web API (clean-architecture layout, .NET 10)
Dockerfile  Multi-stage build that packages both into one runtime image
```

See `FrontEnd/README.md` and `API/src/LASWCD.WebApi/README.md` for
project-specific details (structure, configuration, running tests, etc.).

## Run it with Docker

This is the only supported way to run the whole app with a single command —
the built image serves the frontend and the API from one ASP.NET Core
process, so nothing besides Docker needs to be installed on the host.

***Important***
Ensure that the user you build and run with is in the docker group:
```
usermod -aG docker $YOUR_USER_HERE
```

You will either need to log-out/log-in or just issue (as the user you are running as)
```
newgrp docker
```

Alternative is to just run the commands as root.
```
docker build -t laswcd .
docker run -p 8080:8080 laswcd
```

Then open:

- App: http://localhost:8080/
- Swagger UI: http://localhost:8080/swagger
- Swagger JSON: http://localhost:8080/swagger/v1/swagger.json

The container needs outbound internet access (it calls `swapi.info` for
character data) — don't run it with `--network none` or similarly
restricted networking.

### Docker version requirements

- **Recommended:** Docker Engine 23.0+ / Docker Desktop 4.19+ (or newer).
  BuildKit is the default builder from this version on, which is what the
  `# syntax=docker/dockerfile:1` line at the top of the Dockerfile expects.
- **Minimum:** Docker Engine 18.09+ also works, including with the classic
  (non-BuildKit) builder — the Dockerfile only uses plain multi-stage build
  features (`FROM ... AS`, `COPY --from=`), which have been supported since
  Docker 17.05, so nothing here is BuildKit-exclusive.
- No Docker Compose is needed — it's a single container.
- The base images (`node:24-alpine`, `mcr.microsoft.com/dotnet/sdk:10.0`,
  `mcr.microsoft.com/dotnet/aspnet:10.0`) all publish `amd64` and `arm64`
  variants, so this builds natively on Apple Silicon / ARM hosts too.

### How the image is built

Three stages, defined in `Dockerfile` at the repo root:

1. **`node:24-alpine`** — installs `FrontEnd`'s dependencies and runs
   `npm run build`, producing the static production bundle in `dist/`.
2. **`mcr.microsoft.com/dotnet/sdk:10.0`** — restores, builds, and publishes
   `API/src/LASWCD.WebApi` in `Release` configuration.
3. **`mcr.microsoft.com/dotnet/aspnet:10.0`** (the final image) — contains
   only the published API plus the frontend's `dist/` output copied into
   `wwwroot`. No Node, npm, .NET SDK, or source code is present in this
   final layer — just the ASP.NET Core runtime and the published app.

At runtime, ASP.NET Core serves the React build as static files from
`wwwroot` and falls back to `index.html` for unmatched routes so
client-side routing works, while `/api/...` and `/swagger` continue to be
handled by the API and Swagger middleware respectively — those never fall
through to the SPA. The frontend calls the API with relative URLs (e.g.
`/api/v1/characters/search`), so it always talks to whatever host/port the
container itself is reached on.

## Local development (without Docker)

For day-to-day development with hot reload, run the frontend and backend
as separate processes instead:

```
make run
```

This starts the API (`http://localhost:5240`) and the Vite dev server
(`http://localhost:5173`, proxying `/api` to the backend) and opens a
browser. See `FrontEnd/README.md` and `API/src/LASWCD.WebApi/README.md` for
running each side individually, plus their prerequisites (Node.js 24 LTS
and the .NET 10 SDK respectively).

## Running the tests

```
cd API && dotnet test          # backend: xUnit, one *.Tests project per src project
cd FrontEnd && npm test        # frontend: Vitest + React Testing Library
```

## Submission notes

### Assumptions

The wireframe and tickets left several behaviors unspecified; these were
assumed rather than left ambiguous:

- The character list pre-populates with all characters on load, sorted
  alphabetically, and is single-select.
- The search box does a substring match only (no wildcards, no
  autocomplete) and filters the list as you type.
- Selecting a character populates every other panel with that character's
  data. The first character in the (possibly re-filtered) list is
  selected by default — including after a search re-narrows the list,
  rather than trying to preserve the prior selection.
- If a search empties the list, or removes the selected character, the
  detail panels go blank.
- Films/starships/vehicles show only items belonging to the selected
  character (no greyed-out entries); lists that overflow their box get a
  scrollbar instead of resizing the box.
- A section with no data shows "No data found" (this can happen for
  Species). A character with more than one SWAPI species uses the first
  one.
- Desktop-only; no inputs besides the search box and character list.

### Technical approach & architecture

- **Backend** (`API/`): ASP.NET Core Web API in Clean Architecture —
  `Domain` (entities + the `ISwapiClient` abstraction), `Infrastructure`
  (the SWAPI HTTP client), `Managers` (business logic, mapping domain
  entities to their own response models), `WebApi` (controllers,
  composition root). Dependency injection throughout.
- **Frontend** (`FrontEnd/`): React/TypeScript SPA layered
  `api/` (fetch wrappers) → `services/` → `hooks/` (data fetching, all
  built on one shared `useServiceAction`) → `components/`. Components
  never call `fetch` directly.
- **Deployment**: a single multi-stage Docker image — ASP.NET Core serves
  the built SPA and the API from one process (see "Run it with Docker").

### Architectural decisions & tradeoffs

- The backend calls SWAPI itself, rather than the frontend calling it
  directly — slower to build, but deliberately chosen to demonstrate
  back-end engineering rather than skip it for speed.
- Resiliency (retry with exponential backoff) is implemented at both the
  API→SWAPI layer and the frontend→API layer.
- Caching was considered and left out as gold-plating for this exercise's
  scope, given the small, mostly-static SWAPI dataset.
- Loading/error/empty states were treated as base work, not optional
  polish, even though the tickets didn't call them out explicitly.

### Technical risks & limitations

- No pagination on the list endpoints — fine for SWAPI's size, would need
  addressing for a larger dataset.
- No caching — every character-detail view re-fetches species, homeworld,
  and starships from SWAPI.
- No authentication, and no encryption/data-security controls.
- No front-end error telemetry (e.g. OpenTelemetry) — errors are only
  logged to the console and surfaced via the global error dialog.
- Test coverage could go deeper, e.g. explicitly asserting the
  substring-vs-wildcard search assumption.

### Features/improvements to prioritize with more time

- Pagination and caching on the API.
- Front-end error logging/telemetry.
- Broader test coverage around the assumptions above.
- With more people, splitting front-end and back-end work into separately
  tracked issues.

### AI-assisted development

Built with Claude, including turning a layout description and a wireframe
screenshot into the initial React structure. Without explicit
architectural guardrails it tended to drift toward poor layering by
default — e.g. business logic leaking into the API client layer, raw API
models returned from manager methods — which needed direct correction and
several rounds of iteration (the shared loading/retry/error-dialog hook
in particular took repeated, detailed direction to get right). All output
was reviewed and validated normally: reading every diff, and running the
build/tests/app after each change.

### Guidance for extending this application

- New SWAPI resource: add a `Domain` entity + `ISwapiClient` method,
  implement it in `SwapiClient`, then map it to its own model in
  `CharacterManager` — never return a raw `Domain` entity from a manager
  method. Species/homeworld/starships each follow this same pattern.
- New frontend data: wire it through `api/` → `services/` → a `hooks/`
  wrapper built on `useServiceAction`, the same way the existing hooks do.
- Run `dotnet test` and `npm test` (see above) before committing.
