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
and the .NET 10 SDK respectively) and how to run their test suites.
