using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using LASWCD.Domain.Entities;
using LASWCD.Domain.Interfaces;
using LASWCD.Infrastructure.Swapi.Models;

namespace LASWCD.Infrastructure.Swapi;

// swapi.info serves a static, unfiltered dump per resource; there is no query-param search support.
/// <summary>HTTP-backed <see cref="ISwapiClient"/> that fetches and maps SWAPI resources to domain entities.</summary>
public class SwapiClient(HttpClient httpClient) : ISwapiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    /// <summary>Gets every character.</summary>
    public async Task<IEnumerable<Character>> GetPeopleAsync(CancellationToken cancellationToken = default)
    {
        var people = await GetOrDefaultAsync<List<SwapiPerson>>("people/", cancellationToken);

        return people?.Select(ToCharacter) ?? [];
    }

    /// <summary>Gets a single character by id, or null if not found.</summary>
    public async Task<Character?> GetPersonAsync(string id, CancellationToken cancellationToken = default)
    {
        var person = await GetOrDefaultAsync<SwapiPerson>($"people/{id}/", cancellationToken);

        return person is null ? null : ToCharacter(person);
    }

    /// <summary>Gets a species by its resource URL, or null if not found.</summary>
    public async Task<Species?> GetSpeciesAsync(string url, CancellationToken cancellationToken = default)
    {
        var species = await GetOrDefaultAsync<SwapiSpecies>(url, cancellationToken);

        return species is null
            ? null
            : new Species
            {
                Name = species.Name,
                Classification = species.Classification,
                Designation = species.Designation,
                AverageHeight = species.AverageHeight,
                AverageLifespan = species.AverageLifespan,
                Language = species.Language
            };
    }

    /// <summary>Gets a homeworld by its resource URL, or null if not found.</summary>
    public async Task<Homeworld?> GetHomeworldAsync(string url, CancellationToken cancellationToken = default)
    {
        var planet = await GetOrDefaultAsync<SwapiPlanet>(url, cancellationToken);

        return planet is null
            ? null
            : new Homeworld
            {
                Name = planet.Name,
                Climate = planet.Climate,
                Terrain = planet.Terrain,
                Population = planet.Population,
                SurfaceWater = planet.SurfaceWater,
                Diameter = planet.Diameter,
                RotationPeriod = planet.RotationPeriod,
                OrbitalPeriod = planet.OrbitalPeriod,
                Gravity = planet.Gravity
            };
    }

    /// <summary>Gets a starship by its resource URL, or null if not found.</summary>
    public async Task<Starship?> GetStarshipAsync(string url, CancellationToken cancellationToken = default)
    {
        var starship = await GetOrDefaultAsync<SwapiStarship>(url, cancellationToken);

        return starship is null
            ? null
            : new Starship
            {
                Id = ExtractId(starship.Url),
                Name = starship.Name,
                Classification = starship.StarshipClass,
                Crew = starship.Crew,
                Passengers = starship.Passengers,
                Model = starship.Model,
                Manufacturer = starship.Manufacturer
            };
    }

    private async Task<T?> GetOrDefaultAsync<T>(string requestUri, CancellationToken cancellationToken)
    {
        using var response = await httpClient.GetAsync(requestUri, cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return default;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<T>(JsonOptions, cancellationToken);
    }

    private static string ExtractId(string url) => url.TrimEnd('/').Split('/').Last();

    private static Character ToCharacter(SwapiPerson person) => new()
    {
        Id = ExtractId(person.Url),
        Name = person.Name,
        BirthYear = person.BirthYear,
        Gender = person.Gender,
        Height = person.Height,
        Mass = person.Mass,
        HairColor = person.HairColor,
        EyeColor = person.EyeColor,
        SkinColor = person.SkinColor,
        HomeworldUrl = person.Homeworld,
        SpeciesUrls = person.Species,
        StarshipUrls = person.Starships
    };
}
