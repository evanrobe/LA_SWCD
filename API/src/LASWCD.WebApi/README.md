# LASWCD.WebApi

ASP.NET Core Web API for the LA SWCD project. Part of a clean-architecture solution:

- `LASWCD.Domain` — entities and abstractions (e.g. `ISwapiClient`)
- `LASWCD.Managers` — application/business logic
- `LASWCD.Infrastructure` — external integrations (e.g. SWAPI HTTP client)
- `LASWCD.WebApi` — this project; controllers, composition root, and hosting concerns (e.g. global exception handling middleware)

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)

## Running

From this directory:

```
dotnet run --launch-profile http
```

The API starts on `http://localhost:5240`. Use `--launch-profile https` instead to also bind `https://localhost:7294` (requires a trusted dev cert — run `dotnet dev-certs https --trust` once if your browser warns).

Alternatively, from the solution root (`API/`):

```
dotnet run --project src/LASWCD.WebApi
```

For auto-rebuild on file changes during development:

```
dotnet watch run --launch-profile http
```

## Endpoints

- Swagger UI: `http://localhost:5240/swagger/index.html`
- Swagger JSON: `http://localhost:5240/swagger/v1/swagger.json`
- `GET /api/v1/characters/search?name={name}` — searches Star Wars characters by name via SWAPI

## Configuration

- `Swapi:BaseUrl` (`appsettings.json`) — base URL for the SWAPI client, defaults to `https://swapi.info/api/`. This mirror has no server-side query support — `ISwapiClient` just returns the full people list; `CharacterManager` does the name filtering.

## Tests

Each `src/` project has a matching `tests/<ProjectName>.Tests` project (e.g. `LASWCD.Managers` ↔ `LASWCD.Managers.Tests`).

From the solution root (`API/`), run everything:

```
dotnet test
```

Or scope to one project, e.g.:

```
dotnet test tests/LASWCD.Managers.Tests
```
