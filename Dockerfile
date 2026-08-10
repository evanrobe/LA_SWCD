# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1: build the React/TypeScript frontend (FrontEnd/)
# ---------------------------------------------------------------------------
FROM node:24-alpine AS frontend-build
WORKDIR /src/frontend

# Install dependencies first so this layer is cached unless package*.json changes.
COPY FrontEnd/package.json FrontEnd/package-lock.json ./
RUN npm ci

# VITE_API_BASE_URL is intentionally left unset here: src/api/client.ts falls back to an empty
# string, so the built app calls the API with relative URLs (e.g. /api/v1/characters/search)
# and works no matter what host/port the container is reached on.
COPY FrontEnd/ ./
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: restore, build, and publish the ASP.NET Core Web API (API/src/LASWCD.WebApi)
# ---------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src

# Only API/src is needed to publish LASWCD.WebApi (project references stay within src/); the
# test projects under API/tests are not required to build the runtime image.
COPY API/src/ ./src/

RUN dotnet restore src/LASWCD.WebApi/LASWCD.WebApi.csproj
RUN dotnet build src/LASWCD.WebApi/LASWCD.WebApi.csproj -c Release --no-restore
RUN dotnet publish src/LASWCD.WebApi/LASWCD.WebApi.csproj -c Release -o /app/publish --no-restore --no-build

# ---------------------------------------------------------------------------
# Stage 3: final runtime image — ASP.NET Core runtime only, no SDK/Node/source.
# ---------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=backend-build /app/publish .
# The React production build is served as static files (and SPA-fallback target) from wwwroot,
# so the API and frontend are served together from this one process.
COPY --from=frontend-build /src/frontend/dist ./wwwroot

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "LASWCD.WebApi.dll"]
